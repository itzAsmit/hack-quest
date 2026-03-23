import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { nft_ownership_id, nft_pack_id, auction_type, starting_price, duration_hours = 24 } = await request.json();

    if (!auction_type || !starting_price || starting_price <= 0) {
      return NextResponse.json({ error: "auction_type and positive starting_price required" }, { status: 400 });
    }

    if (auction_type === "single_premium" && !nft_ownership_id) {
      return NextResponse.json({ error: "nft_ownership_id required for single premium auction" }, { status: 400 });
    }

    if (auction_type === "basic_pack" && !nft_pack_id) {
      return NextResponse.json({ error: "nft_pack_id required for basic pack auction" }, { status: 400 });
    }

    // Verify ownership
    if (nft_ownership_id) {
      const { data: nft } = await supabase
        .from("nft_ownership")
        .select("id, owner_id, is_listed")
        .eq("id", nft_ownership_id)
        .eq("owner_id", user.id)
        .single();

      if (!nft) {
        return NextResponse.json({ error: "NFT not found or not owned by you" }, { status: 404 });
      }
      if (nft.is_listed) {
        return NextResponse.json({ error: "NFT is already listed" }, { status: 400 });
      }

      // Mark as listed
      await supabase
        .from("nft_ownership")
        .update({ is_listed: true })
        .eq("id", nft_ownership_id);
    }

    if (nft_pack_id) {
      const { data: pack } = await supabase
        .from("nft_packs")
        .select("id, owner_id, is_tradable")
        .eq("id", nft_pack_id)
        .eq("owner_id", user.id)
        .single();

      if (!pack) {
        return NextResponse.json({ error: "Pack not found or not owned by you" }, { status: 404 });
      }
      if (!pack.is_tradable) {
        return NextResponse.json({ error: "Pack is not tradable" }, { status: 400 });
      }
    }

    const end_time = new Date(Date.now() + duration_hours * 60 * 60 * 1000).toISOString();

    const { data: auction, error: auctionError } = await supabase
      .from("auctions")
      .insert({
        seller_id: user.id,
        nft_ownership_id: nft_ownership_id || null,
        nft_pack_id: nft_pack_id || null,
        auction_type,
        starting_price,
        current_bid: 0,
        status: "active",
        end_time,
      })
      .select("id")
      .single();

    if (auctionError) {
      return NextResponse.json({ error: auctionError.message }, { status: 500 });
    }

    // Activity feed
    await supabase.from("activity_feed").insert({
      user_id: user.id,
      activity_type: "auction_create",
      message: `Listed an NFT for auction starting at ${starting_price} ⚡`,
      metadata: { auction_id: auction.id, starting_price },
      is_public: true,
    });

    return NextResponse.json({ success: true, auction_id: auction.id });
  } catch (err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
