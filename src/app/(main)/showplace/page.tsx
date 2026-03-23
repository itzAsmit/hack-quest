"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Image as ImageIcon, Sparkles, Lock, Check, Loader2 } from "lucide-react";
import { NeonBadge } from "@/components/shared/NeonBadge";
import { GlassPanel } from "@/components/shared/GlassPanel";
import { formatNumber } from "@/lib/utils";

interface NFTDefinition {
  id: string;
  name: string;
  description: string | null;
  image_url: string;
  nft_type: string;
  rarity_color: string;
  xp_cost: number | null;
  total_supply: number;
  minted_count: number;
}

interface OwnedNFT {
  nft_def_id: string;
  owner_id: string;
  users: { username: string; display_name: string } | null;
}

const RARITY_FILTER = ["All", "common", "rare", "epic", "legendary", "mythic"] as const;
const TYPE_FILTER = ["All", "basic", "premium"] as const;

const rarityBorderColors: Record<string, string> = {
  common: "border-hq-rarity-common/40 hover:border-hq-rarity-common/70",
  rare: "border-hq-rarity-rare/40 hover:border-hq-rarity-rare/70",
  epic: "border-hq-rarity-epic/40 hover:border-hq-rarity-epic/70",
  legendary: "border-hq-rarity-legendary/40 hover:border-hq-rarity-legendary/70",
  mythic: "border-hq-rarity-mythic/40 hover:border-hq-rarity-mythic/70",
};

const rarityGlowColors: Record<string, string> = {
  common: "shadow-[0_0_12px_rgba(148,163,184,0.15)]",
  rare: "shadow-[0_0_12px_rgba(59,130,246,0.2)]",
  epic: "shadow-[0_0_12px_rgba(168,85,247,0.2)]",
  legendary: "shadow-[0_0_15px_rgba(245,158,11,0.25)]",
  mythic: "shadow-[0_0_15px_rgba(239,68,68,0.25)]",
};

export default function ShowplacePage() {
  const [nfts, setNfts] = useState<NFTDefinition[]>([]);
  const [owned, setOwned] = useState<OwnedNFT[]>([]);
  const [loading, setLoading] = useState(true);
  const [rarityFilter, setRarityFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [userId, setUserId] = useState<string | null>(null);
  const [claimingId, setClaimingId] = useState<string | null>(null);
  const [userXp, setUserXp] = useState(0);
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        const { data: userData } = await supabase
          .from("users")
          .select("total_xp")
          .eq("id", user.id)
          .single();
        if (userData) setUserXp(userData.total_xp);
      }

      const { data: nftData } = await supabase
        .from("nft_definitions")
        .select("*")
        .order("created_at", { ascending: false });

      if (nftData) setNfts(nftData);

      const { data: ownedData } = await supabase
        .from("nft_ownership")
        .select("nft_def_id, owner_id, users(username, display_name)");

      if (ownedData) setOwned(ownedData as unknown as OwnedNFT[]);
      setLoading(false);
    };
    fetchData();
  }, []);

  const filtered = nfts.filter((nft) => {
    if (rarityFilter !== "All" && nft.rarity_color !== rarityFilter) return false;
    if (typeFilter !== "All" && nft.nft_type !== typeFilter) return false;
    return true;
  });

  const getOwner = (nftDefId: string) => {
    return owned.find((o) => o.nft_def_id === nftDefId);
  };

  const handleClaim = async (nft: NFTDefinition) => {
    if (!userId || !nft.xp_cost) return;
    if (userXp < nft.xp_cost) return;
    setClaimingId(nft.id);

    try {
      const res = await fetch("/api/nft/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nft_def_id: nft.id }),
      });

      if (res.ok) {
        setUserXp((prev) => prev - nft.xp_cost!);
        setOwned((prev) => [...prev, { nft_def_id: nft.id, owner_id: userId, users: null }]);
      } else {
        const data = await res.json();
        console.error("Claim failed:", data.error);
      }
    } catch (err) {
      console.error("Claim failed:", err);
    }
    setClaimingId(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-hq-accent-glow" />
          <span className="text-sm font-medium text-hq-accent-glow uppercase tracking-wider">
            Collection
          </span>
        </div>
        <h1 className="font-heading font-bold text-3xl sm:text-4xl text-hq-text-primary">
          NFT Showplace
        </h1>
        <p className="text-hq-text-secondary mt-1">
          Browse and claim NFTs with your earned XP.
        </p>
        {userId && (
          <p className="text-sm mt-2">
            Your XP: <span className="gradient-text-gold font-semibold">{formatNumber(userXp)}</span>
          </p>
        )}
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar filters */}
        <div className="lg:w-56 flex-shrink-0">
          <GlassPanel className="p-4 sticky top-24">
            <h3 className="text-xs font-medium text-hq-text-muted uppercase tracking-wider mb-3">
              Rarity
            </h3>
            <div className="space-y-1 mb-5">
              {RARITY_FILTER.map((r) => (
                <button
                  key={r}
                  onClick={() => setRarityFilter(r)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                    rarityFilter === r
                      ? "bg-hq-accent-purple/15 text-hq-accent-glow"
                      : "text-hq-text-secondary hover:bg-white/[0.04] hover:text-hq-text-primary"
                  }`}
                >
                  {r === "All" ? "All" : r.charAt(0).toUpperCase() + r.slice(1)}
                </button>
              ))}
            </div>
            <h3 className="text-xs font-medium text-hq-text-muted uppercase tracking-wider mb-3">
              Type
            </h3>
            <div className="space-y-1">
              {TYPE_FILTER.map((t) => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                    typeFilter === t
                      ? "bg-hq-accent-purple/15 text-hq-accent-glow"
                      : "text-hq-text-secondary hover:bg-white/[0.04] hover:text-hq-text-primary"
                  }`}
                >
                  {t === "All" ? "All" : t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </GlassPanel>
        </div>

        {/* Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-64 bg-white/[0.03] rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <ImageIcon className="w-12 h-12 mx-auto mb-3 text-hq-text-muted opacity-50" />
              <p className="text-hq-text-muted">No NFTs found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((nft, i) => {
                const owner = getOwner(nft.id);
                const isOwnedByMe = owner?.owner_id === userId;
                const isOwnedByOther = owner && !isOwnedByMe;
                const canClaim = !owner && nft.nft_type === "basic" && nft.xp_cost && userId;
                const hasEnoughXp = nft.xp_cost ? userXp >= nft.xp_cost : false;

                return (
                  <motion.div
                    key={nft.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className={`glass-panel-hover overflow-hidden border-2 transition-all ${
                      rarityBorderColors[nft.rarity_color] || "border-white/10"
                    } ${rarityGlowColors[nft.rarity_color] || ""}`}
                  >
                    <div className="relative h-40 bg-hq-bg-tertiary overflow-hidden">
                      <img src={nft.image_url} alt={nft.name} className="w-full h-full object-cover" />
                      <div className="absolute top-2 left-2">
                        <NeonBadge variant={nft.nft_type === "premium" ? "gold" : "purple"} size="sm">
                          {nft.nft_type.toUpperCase()}
                        </NeonBadge>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-heading font-semibold text-sm text-hq-text-primary">{nft.name}</h3>
                      {nft.description && (
                        <p className="text-xs text-hq-text-muted mt-1 line-clamp-2">{nft.description}</p>
                      )}
                      <div className="mt-3">
                        {isOwnedByMe && (
                          <div className="flex items-center gap-1.5 text-hq-success text-xs font-medium">
                            <Check className="w-3.5 h-3.5" />
                            Claimed by YOU
                          </div>
                        )}
                        {isOwnedByOther && (
                          <div className="flex items-center gap-1.5 text-hq-text-muted text-xs">
                            <Lock className="w-3.5 h-3.5" />
                            Claimed by {owner.users?.display_name || "someone"}
                          </div>
                        )}
                        {canClaim && (
                          <button
                            onClick={() => handleClaim(nft)}
                            disabled={!hasEnoughXp || claimingId === nft.id}
                            className={`w-full mt-1 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                              hasEnoughXp
                                ? "btn-primary"
                                : "bg-hq-bg-tertiary text-hq-text-muted border border-white/[0.06] cursor-not-allowed"
                            }`}
                          >
                            {claimingId === nft.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : hasEnoughXp ? (
                              <>Claim for {formatNumber(nft.xp_cost!)} XP</>
                            ) : (
                              <>Need {formatNumber(nft.xp_cost!)} XP</>
                            )}
                          </button>
                        )}
                        {nft.nft_type === "premium" && !owner && (
                          <div className="text-xs text-hq-gold mt-1 text-center">
                            Available at Auction
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
