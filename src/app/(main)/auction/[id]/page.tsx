"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Gavel, ArrowLeft, Timer, Loader2, TrendingUp } from "lucide-react";
import { GlassPanel } from "@/components/shared/GlassPanel";
import { NeonBadge } from "@/components/shared/NeonBadge";
import { formatNumber, getRelativeTime } from "@/lib/utils";

interface AuctionDetail {
  id: string;
  auction_type: string;
  starting_price: number;
  current_bid: number;
  status: string;
  end_time: string;
  seller_id: string;
  highest_bidder: string | null;
  nft_ownership: {
    nft_definitions: {
      name: string;
      image_url: string;
      rarity_color: string;
      description: string | null;
    };
  } | null;
}

interface Bid {
  id: string;
  bidder_id: string;
  amount: number;
  created_at: string;
  users: { display_name: string; username: string } | null;
}

export default function AuctionDetailPage() {
  const params = useParams();
  const [auction, setAuction] = useState<AuctionDetail | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [bidAmount, setBidAmount] = useState("");
  const [bidding, setBidding] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState("");
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserId(user.id);

      const { data: auctionData } = await supabase
        .from("auctions")
        .select(`
          id, auction_type, starting_price, current_bid, status, end_time, seller_id, highest_bidder,
          nft_ownership(nft_definitions(name, image_url, rarity_color, description))
        `)
        .eq("id", params.id)
        .single();

      if (auctionData) setAuction(auctionData as unknown as AuctionDetail);

      const { data: bidData } = await supabase
        .from("auction_bids")
        .select("id, bidder_id, amount, created_at, users(display_name, username)")
        .eq("auction_id", params.id)
        .order("amount", { ascending: false })
        .limit(20);

      if (bidData) setBids(bidData as unknown as Bid[]);
      setLoading(false);
    };
    fetchData();

    // Realtime for bids
    const channel = supabase
      .channel(`auction-${params.id}`)
      .on("postgres_changes", {
        event: "*",
        schema: "public",
        table: "auction_bids",
        filter: `auction_id=eq.${params.id}`,
      }, () => {
        fetchData();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [params.id]);

  // Timer
  useEffect(() => {
    if (!auction) return;
    const timer = setInterval(() => {
      const diff = new Date(auction.end_time).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft("Ended");
        clearInterval(timer);
        return;
      }
      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft(`${h}h ${m}m ${s}s`);
    }, 1000);
    return () => clearInterval(timer);
  }, [auction]);

  const handleBid = async () => {
    if (!userId || !bidAmount || !auction) return;
    const amount = parseInt(bidAmount);
    const minBid = (auction.current_bid || auction.starting_price) + 1;
    if (amount < minBid) return;

    setBidding(true);
    try {
      const res = await fetch("/api/auction/bid", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ auction_id: auction.id, amount }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Bid failed");
      }
    } catch (err) {
      console.error("Bid failed:", err);
    }
    setBidAmount("");
    setBidding(false);
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="h-64 bg-white/[0.03] rounded-2xl animate-pulse mb-6" />
        <div className="h-48 bg-white/[0.03] rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (!auction) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="text-hq-text-muted">Auction not found.</p>
        <Link href="/auction" className="text-hq-accent-violet hover:underline mt-2 inline-block">Back to Auctions</Link>
      </div>
    );
  }

  const nft = auction.nft_ownership?.nft_definitions;
  const minBid = (auction.current_bid || auction.starting_price) + 1;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 lg:py-12">
      <Link href="/auction" className="inline-flex items-center gap-1.5 text-sm text-hq-text-muted hover:text-hq-text-primary transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Auctions
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* NFT Image */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2">
          <GlassPanel className="overflow-hidden">
            <div className="aspect-square bg-hq-bg-tertiary">
              {nft?.image_url ? (
                <img src={nft.image_url} alt={nft.name || ""} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Gavel className="w-12 h-12 text-hq-accent-purple/30" />
                </div>
              )}
            </div>
            <div className="p-4">
              <h1 className="font-heading font-bold text-lg text-hq-text-primary">{nft?.name || "NFT Pack"}</h1>
              {nft?.description && <p className="text-xs text-hq-text-muted mt-1">{nft.description}</p>}
              {nft?.rarity_color && <NeonBadge variant="slate" size="sm" className="mt-2">{nft.rarity_color}</NeonBadge>}
            </div>
          </GlassPanel>
        </motion.div>

        {/* Bidding */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-3 space-y-4">
          <GlassPanel className="p-6">
            <div className="flex items-center justify-between mb-4">
              <NeonBadge variant={auction.status === "active" ? "success" : "slate"} size="lg">
                {auction.status === "active" ? "LIVE AUCTION" : "ENDED"}
              </NeonBadge>
              <div className="flex items-center gap-1.5 text-hq-text-primary text-sm font-medium">
                <Timer className="w-4 h-4 text-hq-accent-glow" />
                {timeLeft}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-xs text-hq-text-muted uppercase">Starting Price</p>
                <p className="font-heading font-bold text-lg text-hq-text-primary">{formatNumber(auction.starting_price)} ⚡</p>
              </div>
              <div>
                <p className="text-xs text-hq-text-muted uppercase">Current Bid</p>
                <p className="font-heading font-bold text-lg gradient-text-gold">{formatNumber(auction.current_bid || auction.starting_price)} ⚡</p>
              </div>
            </div>

            {auction.status === "active" && userId && (
              <div className="flex gap-3">
                <input
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  placeholder={`Min bid: ${minBid} ⚡`}
                  min={minBid}
                  className="flex-1 px-4 py-3 rounded-lg bg-hq-bg-tertiary border border-white/[0.08] text-hq-text-primary text-sm focus:outline-none focus:border-hq-gold/50 transition-all"
                />
                <button
                  onClick={handleBid}
                  disabled={bidding || !bidAmount || parseInt(bidAmount) < minBid}
                  className="btn-primary px-6 flex items-center gap-2 disabled:opacity-50"
                >
                  {bidding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Gavel className="w-4 h-4" />}
                  Place Bid
                </button>
              </div>
            )}

            {auction.status === "active" && !userId && (
              <Link href="/login" className="btn-primary w-full text-center block py-3">
                Login to Bid
              </Link>
            )}
          </GlassPanel>

          {/* Bid History */}
          <GlassPanel className="p-5">
            <h2 className="font-heading font-semibold text-hq-text-primary mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-hq-accent-glow" /> Bid History ({bids.length})
            </h2>
            {bids.length === 0 ? (
              <p className="text-sm text-hq-text-muted text-center py-4">No bids yet. Be the first!</p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {bids.map((bid, i) => (
                  <div key={bid.id} className={`flex items-center justify-between px-3 py-2 rounded-lg ${i === 0 ? "bg-hq-gold/5 border border-hq-gold/20" : "hover:bg-white/[0.02]"}`}>
                    <div className="flex items-center gap-2">
                      {i === 0 && <span className="text-xs">🏆</span>}
                      <span className="text-sm text-hq-text-primary">{bid.users?.display_name || "Anonymous"}</span>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-semibold ${i === 0 ? "gradient-text-gold" : "text-hq-text-secondary"}`}>
                        {formatNumber(bid.amount)} ⚡
                      </p>
                      <p className="text-[10px] text-hq-text-muted">{getRelativeTime(bid.created_at)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </GlassPanel>
        </motion.div>
      </div>
    </div>
  );
}
