"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Trophy, Crown, Medal, ChevronUp, ChevronDown, Image as ImageIcon } from "lucide-react";
import { formatNumber } from "@/lib/utils";
import { GlassPanel } from "@/components/shared/GlassPanel";

interface LeaderboardPlayer {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
  total_xp: number;
  nft_count: number;
  rank_position: number;
}

export function LeaderboardWidget() {
  const [players, setPlayers] = useState<LeaderboardPlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const { data } = await supabase
        .from("users")
        .select("id, username, display_name, avatar_url, total_xp, nft_count, rank_position")
        .eq("role", "player")
        .eq("is_active", true)
        .order("nft_count", { ascending: false })
        .order("total_xp", { ascending: false })
        .limit(10);

      if (data) {
        setPlayers(data.map((p, i) => ({ ...p, rank_position: i + 1 })));
      }
      setLoading(false);
    };

    fetchLeaderboard();

    // Subscribe to realtime updates
    const channel = supabase
      .channel("leaderboard-changes")
      .on("postgres_changes", {
        event: "UPDATE",
        schema: "public",
        table: "users",
      }, () => {
        fetchLeaderboard();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-4 h-4 text-hq-gold" />;
    if (rank === 2) return <Medal className="w-4 h-4 text-slate-300" />;
    if (rank === 3) return <Medal className="w-4 h-4 text-amber-600" />;
    return null;
  };

  return (
    <section className="py-16 lg:py-24 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <Trophy className="w-5 h-5 text-hq-gold" />
            <span className="text-sm font-medium text-hq-gold uppercase tracking-wider">
              Live Rankings
            </span>
          </div>
          <h2 className="font-heading font-bold text-3xl sm:text-4xl text-hq-text-primary">
            Global Leaderboard
          </h2>
          <p className="text-hq-text-secondary mt-2 text-sm">
            Top players ranked by NFT count, then XP. Updated in real-time.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <GlassPanel className="overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-[50px_1fr_100px_100px] sm:grid-cols-[60px_1fr_120px_120px] px-4 sm:px-6 py-3 border-b border-white/[0.06] text-xs font-medium text-hq-text-muted uppercase tracking-wider">
              <span>Rank</span>
              <span>Player</span>
              <span className="text-right">NFTs</span>
              <span className="text-right">XP</span>
            </div>

            {/* Loading skeleton */}
            {loading && (
              <div className="p-4 space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-12 bg-white/[0.03] rounded-lg animate-pulse" />
                ))}
              </div>
            )}

            {/* Players */}
            {!loading && players.length === 0 && (
              <div className="p-10 text-center text-hq-text-muted text-sm">
                No players yet. Be the first to join!
              </div>
            )}

            <AnimatePresence>
              {players.map((player, index) => (
                <motion.div
                  key={player.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`grid grid-cols-[50px_1fr_100px_100px] sm:grid-cols-[60px_1fr_120px_120px] items-center px-4 sm:px-6 py-3 border-b border-white/[0.03] hover:bg-white/[0.03] transition-colors ${
                    index === 0 ? "bg-hq-gold/[0.03]" : ""
                  }`}
                >
                  {/* Rank */}
                  <div className="flex items-center gap-1">
                    {getRankIcon(player.rank_position) || (
                      <span className="text-sm font-medium text-hq-text-muted w-6 text-center">
                        {player.rank_position}
                      </span>
                    )}
                  </div>

                  {/* Player info */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0 border ${
                      index === 0
                        ? "border-hq-gold/50"
                        : index < 3
                        ? "border-hq-accent-purple/40"
                        : "border-white/10"
                    }`}>
                      {player.avatar_url ? (
                        <img
                          src={player.avatar_url}
                          alt={player.display_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-hq-accent-purple/60 to-hq-accent-violet/60 flex items-center justify-center text-white text-xs font-bold">
                          {player.display_name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-hq-text-primary truncate">
                        {player.display_name}
                      </p>
                      <p className="text-xs text-hq-text-muted truncate">
                        @{player.username}
                      </p>
                    </div>
                  </div>

                  {/* NFT count */}
                  <div className="text-right flex items-center justify-end gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-hq-accent-violet" />
                    <span className="text-sm font-medium text-hq-text-primary">
                      {player.nft_count}
                    </span>
                  </div>

                  {/* XP */}
                  <div className="text-right">
                    <span className="text-sm font-medium gradient-text-gold">
                      {formatNumber(player.total_xp)}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </GlassPanel>
        </motion.div>
      </div>
    </section>
  );
}
