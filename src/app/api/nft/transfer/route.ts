import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { nft_ownership_id, receiver_id } = await request.json();

    if (!nft_ownership_id || !receiver_id) {
      return NextResponse.json({ error: "nft_ownership_id and receiver_id required" }, { status: 400 });
    }

    if (receiver_id === user.id) {
      return NextResponse.json({ error: "Cannot transfer to yourself" }, { status: 400 });
    }

    // Verify ownership
    const { data: nft } = await supabase
      .from("nft_ownership")
      .select("id, owner_id, is_listed, nft_def_id")
      .eq("id", nft_ownership_id)
      .eq("owner_id", user.id)
      .single();

    if (!nft) {
      return NextResponse.json({ error: "NFT not found or not owned by you" }, { status: 404 });
    }

    if (nft.is_listed) {
      return NextResponse.json({ error: "Cannot transfer. NFT is currently listed on auction" }, { status: 400 });
    }

    // Verify receiver exists
    const { data: receiver } = await supabase
      .from("users")
      .select("id, nft_count")
      .eq("id", receiver_id)
      .single();

    if (!receiver) {
      return NextResponse.json({ error: "Receiver not found" }, { status: 404 });
    }

    // Transfer ownership
    await supabase
      .from("nft_ownership")
      .update({
        owner_id: receiver_id,
        acquired_via: "trade",
        acquired_at: new Date().toISOString(),
      })
      .eq("id", nft_ownership_id);

    // Update NFT counts
    const { data: senderData } = await supabase
      .from("users")
      .select("nft_count")
      .eq("id", user.id)
      .single();

    if (senderData) {
      await supabase
        .from("users")
        .update({ nft_count: Math.max(0, senderData.nft_count - 1) })
        .eq("id", user.id);
    }

    await supabase
      .from("users")
      .update({ nft_count: receiver.nft_count + 1 })
      .eq("id", receiver_id);

    // Create trade record
    await supabase.from("trades").insert({
      sender_id: user.id,
      receiver_id,
      nft_ownership_id,
      status: "completed",
      completed_at: new Date().toISOString(),
    });

    // Activity feed
    const { data: nftDef } = await supabase
      .from("nft_definitions")
      .select("name")
      .eq("id", nft.nft_def_id)
      .single();

    await supabase.from("activity_feed").insert([
      {
        user_id: user.id,
        activity_type: "nft_trade",
        message: `Sent "${nftDef?.name || "NFT"}" to another player`,
        metadata: { nft_ownership_id, receiver_id },
        is_public: true,
      },
      {
        user_id: receiver_id,
        activity_type: "nft_trade",
        message: `Received "${nftDef?.name || "NFT"}" from a trade`,
        metadata: { nft_ownership_id, sender_id: user.id },
        is_public: true,
      },
    ]);

    return NextResponse.json({ success: true });
  } catch (_err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
