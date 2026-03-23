import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { nft_def_id } = await request.json();

    if (!nft_def_id) {
      return NextResponse.json({ error: "nft_def_id is required" }, { status: 400 });
    }

    // Get NFT definition
    const { data: nftDef, error: nftError } = await supabase
      .from("nft_definitions")
      .select("*")
      .eq("id", nft_def_id)
      .single();

    if (nftError || !nftDef) {
      return NextResponse.json({ error: "NFT definition not found" }, { status: 404 });
    }

    if (nftDef.nft_type !== "basic") {
      return NextResponse.json({ error: "Only basic NFTs can be redeemed with XP" }, { status: 400 });
    }

    if (nftDef.minted_count >= nftDef.total_supply) {
      return NextResponse.json({ error: "NFT is out of stock" }, { status: 400 });
    }

    // Check if user already owns this NFT
    const { data: existing } = await supabase
      .from("nft_ownership")
      .select("id")
      .eq("nft_def_id", nft_def_id)
      .eq("owner_id", user.id)
      .single();

    if (existing) {
      return NextResponse.json({ error: "You already own this NFT" }, { status: 409 });
    }

    // Check user XP
    const { data: userData } = await supabase
      .from("users")
      .select("total_xp, nft_count")
      .eq("id", user.id)
      .single();

    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const xpCost = nftDef.xp_cost || 0;
    if (userData.total_xp < xpCost) {
      return NextResponse.json({ error: `Insufficient XP. Need ${xpCost}, have ${userData.total_xp}` }, { status: 400 });
    }

    // Deduct XP
    await supabase
      .from("users")
      .update({
        total_xp: userData.total_xp - xpCost,
        nft_count: userData.nft_count + 1,
        player_level: Math.floor((userData.total_xp - xpCost) / 1000) + 1,
      })
      .eq("id", user.id);

    // Create ownership
    const { data: ownership, error: ownershipError } = await supabase
      .from("nft_ownership")
      .insert({
        nft_def_id,
        owner_id: user.id,
        acquired_via: "redeem",
      })
      .select("id")
      .single();

    if (ownershipError) {
      // Rollback XP deduction
      await supabase
        .from("users")
        .update({
          total_xp: userData.total_xp,
          nft_count: userData.nft_count,
        })
        .eq("id", user.id);
      return NextResponse.json({ error: ownershipError.message }, { status: 500 });
    }

    // Increment minted count
    await supabase
      .from("nft_definitions")
      .update({ minted_count: nftDef.minted_count + 1 })
      .eq("id", nft_def_id);

    // Log XP deduction
    await supabase.from("xp_logs").insert({
      user_id: user.id,
      amount: -xpCost,
      source: "nft_redeem",
      source_id: ownership.id,
    });

    // Activity feed
    await supabase.from("activity_feed").insert({
      user_id: user.id,
      activity_type: "nft_claim",
      message: `Claimed "${nftDef.name}" for ${xpCost} XP`,
      metadata: { nft_def_id, nft_name: nftDef.name, xp_cost: xpCost },
      is_public: true,
    });

    return NextResponse.json({ success: true, ownership_id: ownership.id });
  } catch (err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
