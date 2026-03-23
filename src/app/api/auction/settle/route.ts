import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { auction_id } = await request.json();

    if (!auction_id) {
      return NextResponse.json({ error: "auction_id is required" }, { status: 400 });
    }

    // Get auction
    const { data: auction } = await supabase
      .from("auctions")
      .select("*")
      .eq("id", auction_id)
      .single();

    if (!auction) {
      return NextResponse.json({ error: "Auction not found" }, { status: 404 });
    }

    if (auction.status !== "active") {
      return NextResponse.json({ error: "Auction is already settled" }, { status: 400 });
    }

    if (new Date(auction.end_time) > new Date()) {
      return NextResponse.json({ error: "Auction has not ended yet" }, { status: 400 });
    }

    // Mark auction as ended
    await supabase
      .from("auctions")
      .update({ status: "ended" })
      .eq("id", auction_id);

    if (!auction.highest_bidder || auction.current_bid === 0) {
      // No bids — return NFT to seller
      if (auction.nft_ownership_id) {
        await supabase
          .from("nft_ownership")
          .update({ is_listed: false })
          .eq("id", auction.nft_ownership_id);
      }
      return NextResponse.json({ success: true, message: "No bids. NFT returned to seller." });
    }

    // Transfer NFT ownership to winner
    if (auction.nft_ownership_id) {
      await supabase
        .from("nft_ownership")
        .update({
          owner_id: auction.highest_bidder,
          is_listed: false,
          acquired_via: "auction",
          acquired_at: new Date().toISOString(),
        })
        .eq("id", auction.nft_ownership_id);
    }

    // Credit seller with Hacks
    const { data: seller } = await supabase
      .from("users")
      .select("hacks_balance, nft_count")
      .eq("id", auction.seller_id)
      .single();

    if (seller) {
      await supabase
        .from("users")
        .update({
          hacks_balance: seller.hacks_balance + auction.current_bid,
          nft_count: Math.max(0, seller.nft_count - 1),
        })
        .eq("id", auction.seller_id);

      await supabase.from("hacks_transactions").insert({
        user_id: auction.seller_id,
        tx_type: "nft_sale",
        amount: auction.current_bid,
        currency: "HACKS",
        description: `NFT sold at auction for ${auction.current_bid} ⚡`,
      });
    }

    // Update buyer NFT count
    const { data: buyer } = await supabase
      .from("users")
      .select("nft_count")
      .eq("id", auction.highest_bidder)
      .single();

    if (buyer) {
      await supabase
        .from("users")
        .update({ nft_count: buyer.nft_count + 1 })
        .eq("id", auction.highest_bidder);
    }

    // Activity feed
    await supabase.from("activity_feed").insert([
      {
        user_id: auction.seller_id,
        activity_type: "nft_sale",
        message: `NFT sold at auction for ${auction.current_bid} ⚡`,
        metadata: { auction_id, amount: auction.current_bid },
        is_public: true,
      },
      {
        user_id: auction.highest_bidder,
        activity_type: "nft_purchase",
        message: `Won NFT at auction for ${auction.current_bid} ⚡`,
        metadata: { auction_id, amount: auction.current_bid },
        is_public: true,
      },
    ]);

    return NextResponse.json({ success: true, winner: auction.highest_bidder, amount: auction.current_bid });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
