import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { uploadFileToIPFS } from "@/lib/ipfs";
import {
  generateImageWithStability,
  StabilityApiError,
  type StabilityAspectRatio,
  type StabilityStylePreset,
} from "@/lib/stability";

interface CreateNftBody {
  name: string;
  description?: string;
  nft_type: "basic" | "premium";
  rarity_color: "common" | "rare" | "epic" | "legendary" | "mythic";
  xp_cost?: number | null;
  total_supply: number;
  image_url?: string;
  prompt?: string;
  negative_prompt?: string;
  aspect_ratio?: StabilityAspectRatio;
  style_preset?: StabilityStylePreset;
  output_format?: "png" | "jpeg" | "webp";
  seed?: number;
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: organiser } = await supabase
      .from("organisers")
      .select("id")
      .eq("id", user.id)
      .single();

    if (!organiser) {
      return NextResponse.json({ error: "Only organisers can create NFT definitions" }, { status: 403 });
    }

    const body = (await request.json()) as CreateNftBody;

    if (!body.name || !body.nft_type || !body.rarity_color || !body.total_supply) {
      return NextResponse.json({ error: "Missing required NFT fields" }, { status: 400 });
    }

    let imageUrl = (body.image_url || "").trim();

    if (!imageUrl) {
      if (!body.prompt?.trim()) {
        return NextResponse.json(
          { error: "Provide either image_url or prompt for AI generation" },
          { status: 400 }
        );
      }

      const generated = await generateImageWithStability({
        prompt: body.prompt.trim(),
        negativePrompt: body.negative_prompt,
        aspectRatio: body.aspect_ratio,
        stylePreset: body.style_preset,
        outputFormat: body.output_format,
        seed: body.seed,
      });

      const fileName = `${body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}.${generated.fileExtension}`;
      const file = new File([generated.bytes], fileName, { type: generated.contentType });

      const uploadResult = await uploadFileToIPFS(file, `nft-${body.name}-${Date.now()}`);
      if (!uploadResult.success) {
        return NextResponse.json({ error: "Image generated but failed to upload to IPFS" }, { status: 500 });
      }

      imageUrl = uploadResult.url;
    }

    const { data: created, error: insertError } = await supabase
      .from("nft_definitions")
      .insert({
        name: body.name,
        description: body.description || null,
        image_url: imageUrl,
        nft_type: body.nft_type,
        rarity_color: body.rarity_color,
        xp_cost: body.xp_cost ?? null,
        total_supply: Math.max(1, body.total_supply),
      })
      .select("*")
      .single();

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, nft: created });
  } catch (error) {
    if (error instanceof StabilityApiError) {
      if (error.status === 403) {
        return NextResponse.json(
          {
            error:
              "Image generation was blocked by content moderation. Please revise the prompt and try again.",
            provider_message: error.providerMessage,
          },
          { status: 403 }
        );
      }

      if (error.status === 429) {
        const retryHint = error.retryAfterSeconds
          ? ` Please wait about ${error.retryAfterSeconds} seconds before retrying.`
          : " Please wait a moment and try again.";

        return NextResponse.json(
          {
            error: `Stability API rate limit reached.${retryHint}`,
            provider_message: error.providerMessage,
          },
          { status: 429 }
        );
      }

      if (error.status >= 500) {
        return NextResponse.json(
          {
            error: "Image provider is temporarily unavailable. Please try again shortly.",
            provider_message: error.providerMessage,
          },
          { status: 503 }
        );
      }

      return NextResponse.json(
        {
          error: "Image generation failed due to invalid request parameters.",
          provider_message: error.providerMessage,
        },
        { status: 400 }
      );
    }

    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
