import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { auction_id, amount } = await request.json();

    if (!auction_id || !amount || amount <= 0) {
      return NextResponse.json({ error: "auction_id and positive amount required" }, { status: 400 });
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
      return NextResponse.json({ error: "Auction is not active" }, { status: 400 });
    }

    if (new Date(auction.end_time) <= new Date()) {
      return NextResponse.json({ error: "Auction has ended" }, { status: 400 });
    }

    if (auction.seller_id === user.id) {
      return NextResponse.json({ error: "Cannot bid on your own auction" }, { status: 400 });
    }

    const minBid = Math.max(auction.starting_price, (auction.current_bid || 0) + 1);
    if (amount < minBid) {
      return NextResponse.json({ error: `Bid must be at least ${minBid} Hacks` }, { status: 400 });
    }

    // Check user balance
    const { data: userData } = await supabase
      .from("users")
      .select("hacks_balance")
      .eq("id", user.id)
      .single();

    if (!userData || userData.hacks_balance < amount) {
      return NextResponse.json({ error: "Insufficient Hacks balance" }, { status: 400 });
    }

    // Refund previous highest bidder
    if (auction.highest_bidder && auction.current_bid > 0) {
      const { data: prevBidder } = await supabase
        .from("users")
        .select("hacks_balance")
        .eq("id", auction.highest_bidder)
        .single();

      if (prevBidder) {
        await supabase
          .from("users")
          .update({ hacks_balance: prevBidder.hacks_balance + auction.current_bid })
          .eq("id", auction.highest_bidder);

        await supabase.from("hacks_transactions").insert({
          user_id: auction.highest_bidder,
          tx_type: "auction_refund",
          amount: auction.current_bid,
          currency: "HACKS",
          description: `Auction bid refund (outbid)`,
        });
      }
    }

    // Deduct from current bidder
    await supabase
      .from("users")
      .update({ hacks_balance: userData.hacks_balance - amount })
      .eq("id", user.id);

    // Record transaction
    await supabase.from("hacks_transactions").insert({
      user_id: user.id,
      tx_type: "auction_bid",
      amount: -amount,
      currency: "HACKS",
      description: `Bid on auction`,
    });

    // Insert bid
    await supabase.from("auction_bids").insert({
      auction_id,
      bidder_id: user.id,
      bid_amount: amount,
    });

    // Update auction
    await supabase
      .from("auctions")
      .update({
        current_bid: amount,
        highest_bidder: user.id,
      })
      .eq("id", auction_id);

    // Activity
    await supabase.from("activity_feed").insert({
      user_id: user.id,
      activity_type: "auction_bid",
      message: `Placed a bid of ${amount} ⚡ on an auction`,
      metadata: { auction_id, amount },
      is_public: true,
    });

    return NextResponse.json({ success: true });
  } catch (_err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
