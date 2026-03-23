"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import {
  ArrowLeft, Zap, Star, Image as ImageIcon, Trophy, MapPin,
  Linkedin, Instagram, Twitter, Calendar, User
} from "lucide-react";
import { GlassPanel } from "@/components/shared/GlassPanel";
import { NeonBadge } from "@/components/shared/NeonBadge";
import { AnimatedCounter } from "@/components/shared/AnimatedCounter";
import { formatNumber, calculateLevel, xpProgressPercent } from "@/lib/utils";

interface PlayerProfile {
  id: string;
  username: string;
  display_name: string;
  email: string;
  avatar_url: string | null;
  total_xp: number;
  cumulative_xp: number;
  hacks_balance: number;
  nft_count: number;
  player_level: number;
  rank_position: number | null;
  college_name: string | null;
  linkedin_url: string | null;
  instagram_handle: string | null;
  twitter_handle: string | null;
  created_at: string;
}

interface OwnedNFT {
  id: string;
  nft_definitions: {
    name: string;
    image_url: string;
    rarity_color: string;
    nft_type: string;
  };
}

export default function PlayerProfilePage() {
  const params = useParams();
  const [player, setPlayer] = useState<PlayerProfile | null>(null);
  const [nfts, setNfts] = useState<OwnedNFT[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("users")
        .select("*")
        .eq("id", params.id)
        .single();
      if (data) setPlayer(data as PlayerProfile);

      const { data: nftData } = await supabase
        .from("nft_ownership")
        .select("id, nft_definitions(name, image_url, rarity_color, nft_type)")
        .eq("owner_id", params.id)
        .limit(12);
      if (nftData) setNfts(nftData as unknown as OwnedNFT[]);

      setLoading(false);
    };
    fetch();
  }, [params.id]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="h-48 bg-white/[0.03] rounded-2xl animate-pulse mb-6" />
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-white/[0.03] rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!player) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <User className="w-10 h-10 mx-auto mb-3 text-hq-text-muted opacity-50" />
        <p className="text-hq-text-muted mb-3">Player not found.</p>
        <Link href="/leaderboard" className="text-hq-accent-violet hover:underline">Browse Leaderboard</Link>
      </div>
    );
  }

  const level = calculateLevel(player.total_xp);
  const xpProgress = xpProgressPercent(player.total_xp);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 lg:py-12">
      <Link href="/leaderboard" className="inline-flex items-center gap-1.5 text-sm text-hq-text-muted hover:text-hq-text-primary transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Leaderboard
      </Link>

      {/* Profile Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <GlassPanel className="p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-hq-accent-purple/5 rounded-full blur-[80px]" />
          <div className="relative flex items-center gap-5">
            <div className="w-20 h-20 rounded-full overflow-hidden ring-2 ring-hq-accent-purple/40 flex-shrink-0">
              {player.avatar_url ? (
                <img src={player.avatar_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-hq-accent-purple/30 flex items-center justify-center text-2xl font-bold text-white">
                  {player.display_name.charAt(0)}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="font-heading font-bold text-2xl text-hq-text-primary">{player.display_name}</h1>
              <p className="text-sm text-hq-text-muted">@{player.username}</p>
              <div className="flex items-center flex-wrap gap-2 mt-2">
                <NeonBadge variant="purple" size="md">Level {level}</NeonBadge>
                {player.rank_position && (
                  <NeonBadge variant="gold" size="md">
                    <Trophy className="w-3 h-3" /> Rank #{player.rank_position}
                  </NeonBadge>
                )}
                {player.college_name && (
                  <span className="inline-flex items-center gap-1 text-xs text-hq-text-muted">
                    <MapPin className="w-3 h-3" /> {player.college_name}
                  </span>
                )}
              </div>
              {/* Socials */}
              <div className="flex items-center gap-3 mt-3">
                {player.linkedin_url && (
                  <a href={player.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-hq-text-muted hover:text-blue-400 transition-colors">
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
                {player.instagram_handle && (
                  <a href={`https://instagram.com/${player.instagram_handle.replace("@", "")}`} target="_blank" rel="noopener noreferrer" className="text-hq-text-muted hover:text-pink-400 transition-colors">
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
                {player.twitter_handle && (
                  <a href={`https://twitter.com/${player.twitter_handle.replace("@", "")}`} target="_blank" rel="noopener noreferrer" className="text-hq-text-muted hover:text-sky-400 transition-colors">
                    <Twitter className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </GlassPanel>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {[
          { label: "Total XP", value: player.total_xp, icon: Zap, color: "text-hq-gold" },
          { label: "Level", value: level, icon: Star, color: "text-hq-accent-glow" },
          { label: "NFTs", value: player.nft_count, icon: ImageIcon, color: "text-hq-accent-violet" },
          { label: "Joined", value: new Date(player.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" }), icon: Calendar, color: "text-hq-text-secondary", isText: true },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }}>
            <GlassPanel className="p-4 text-center">
              <stat.icon className={`w-5 h-5 mx-auto mb-1.5 ${stat.color}`} />
              <p className={`font-heading font-bold text-lg ${stat.color}`}>
                {"isText" in stat ? stat.value : <AnimatedCounter value={stat.value as number} />}
              </p>
              <p className="text-[10px] text-hq-text-muted uppercase tracking-wider">{stat.label}</p>
            </GlassPanel>
          </motion.div>
        ))}
      </div>

      {/* XP Progress */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-6">
        <GlassPanel className="p-5">
          <div className="flex items-center justify-between text-xs text-hq-text-muted mb-2">
            <span>Level {level}</span>
            <span>Level {level + 1}</span>
          </div>
          <div className="h-2.5 bg-hq-bg-tertiary rounded-full overflow-hidden border border-white/[0.06]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${xpProgress}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-hq-accent-purple via-hq-accent-violet to-hq-gold"
            />
          </div>
          <p className="text-xs text-hq-text-muted mt-1.5">
            {formatNumber(player.total_xp % 1000)} / 1,000 XP to next level
          </p>
        </GlassPanel>
      </motion.div>

      {/* NFT Collection */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-6">
        <h2 className="font-heading font-semibold text-lg text-hq-text-primary mb-3 flex items-center gap-2">
          <ImageIcon className="w-4.5 h-4.5 text-hq-accent-violet" />
          NFT Collection ({nfts.length})
        </h2>
        {nfts.length === 0 ? (
          <GlassPanel className="p-6 text-center">
            <p className="text-sm text-hq-text-muted">No NFTs to display yet.</p>
          </GlassPanel>
        ) : (
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {nfts.map((nft) => (
              <GlassPanel key={nft.id} className="overflow-hidden">
                <div className="aspect-square bg-hq-bg-tertiary">
                  <img src={nft.nft_definitions.image_url} alt={nft.nft_definitions.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-2">
                  <p className="text-[10px] font-medium text-hq-text-primary truncate">{nft.nft_definitions.name}</p>
                  <NeonBadge variant={nft.nft_definitions.nft_type === "premium" ? "gold" : "slate"} size="sm" className="mt-1">
                    {nft.nft_definitions.rarity_color}
                  </NeonBadge>
                </div>
              </GlassPanel>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
