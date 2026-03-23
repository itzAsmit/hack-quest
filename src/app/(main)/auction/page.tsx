"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Gavel, Timer, AlertCircle } from "lucide-react";
import { GlassPanel } from "@/components/shared/GlassPanel";
import { NeonBadge } from "@/components/shared/NeonBadge";
import { formatNumber } from "@/lib/utils";
import Link from "next/link";

interface Auction {
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
    };
  } | null;
}

export default function AuctionPage() {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"active" | "ended">("active");
  const [userId, setUserId] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserId(user.id);

      const { data } = await supabase
        .from("auctions")
        .select(`
          id, auction_type, starting_price, current_bid, status, end_time, seller_id, highest_bidder,
          nft_ownership(nft_definitions(name, image_url, rarity_color))
        `)
        .eq("status", tab === "active" ? "active" : "ended")
        .order("end_time", { ascending: tab === "active" });

      if (data) setAuctions(data as unknown as Auction[]);
      setLoading(false);
    };
    fetchData();

    // Realtime subscription for active auctions
    const channel = supabase
      .channel("auction-updates")
      .on("postgres_changes", {
        event: "*",
        schema: "public",
        table: "auctions",
      }, () => {
        fetchData();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [tab]);

  const getTimeRemaining = (endTime: string) => {
    const diff = new Date(endTime).getTime() - Date.now();
    if (diff <= 0) return "Ended";
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Gavel className="w-5 h-5 text-hq-accent-glow" />
          <span className="text-sm font-medium text-hq-accent-glow uppercase tracking-wider">
            Marketplace
          </span>
        </div>
        <h1 className="font-heading font-bold text-3xl sm:text-4xl text-hq-text-primary">
          Auction House
        </h1>
        <p className="text-hq-text-secondary mt-1">
          Bid on premium NFTs and rare packs with Hacks.
        </p>
      </motion.div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-hq-bg-secondary/50 rounded-lg p-1 border border-white/[0.06] w-fit mb-8">
        {(["active", "ended"] as const).map((t) => (
          <button
            key={t}
            onClick={() => { setTab(t); setLoading(true); }}
            className={`px-5 py-2 rounded-md text-sm font-medium transition-all ${
              tab === t
                ? "bg-hq-accent-purple text-white shadow-neon-purple"
                : "text-hq-text-secondary hover:text-hq-text-primary hover:bg-white/[0.04]"
            }`}
          >
            {t === "active" ? "Active" : "History"}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-56 bg-white/[0.03] rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : auctions.length === 0 ? (
        <div className="text-center py-20">
          <Gavel className="w-12 h-12 mx-auto mb-3 text-hq-text-muted opacity-50" />
          <p className="text-hq-text-muted">
            {tab === "active" ? "No active auctions right now." : "No auction history yet."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {auctions.map((auction, i) => {
            const nft = auction.nft_ownership?.nft_definitions;
            return (
              <motion.div
                key={auction.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link href={`/auction/${auction.id}`} className="block glass-panel-hover overflow-hidden group">
                  <div className="relative h-36 bg-hq-bg-tertiary overflow-hidden">
                    {nft?.image_url ? (
                      <img src={nft.image_url} alt={nft.name || ""} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Gavel className="w-8 h-8 text-hq-accent-purple/30" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <NeonBadge variant={auction.status === "active" ? "success" : "slate"} size="sm">
                        {auction.status === "active" ? "LIVE" : "ENDED"}
                      </NeonBadge>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-heading font-semibold text-sm text-hq-text-primary group-hover:text-hq-accent-glow transition-colors line-clamp-1">
                      {nft?.name || "NFT Pack"}
                    </h3>
                    <div className="flex items-center justify-between mt-3">
                      <div>
                        <p className="text-[10px] text-hq-text-muted uppercase">Current Bid</p>
                        <p className="text-sm font-semibold gradient-text-gold">
                          {formatNumber(auction.current_bid || auction.starting_price)} ⚡
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-hq-text-muted uppercase">Time Left</p>
                        <p className="text-sm font-medium text-hq-text-primary flex items-center gap-1">
                          <Timer className="w-3 h-3" />
                          {getTimeRemaining(auction.end_time)}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Guest prompt */}
      {!userId && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <GlassPanel className="p-6 text-center max-w-md mx-auto">
            <AlertCircle className="w-8 h-8 text-hq-accent-violet mx-auto mb-3" />
            <p className="text-sm text-hq-text-secondary mb-4">
              Login to participate in auctions and place bids.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Link href="/login" className="btn-primary text-sm">
                Login
              </Link>
              <Link href="/register" className="btn-outline text-sm">
                Register
              </Link>
            </div>
          </GlassPanel>
        </motion.div>
      )}
    </div>
  );
}
