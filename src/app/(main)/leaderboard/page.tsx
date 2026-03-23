"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Trophy, Medal, Crown, Search } from "lucide-react";
import { GlassPanel } from "@/components/shared/GlassPanel";
import { NeonBadge } from "@/components/shared/NeonBadge";
import { formatNumber } from "@/lib/utils";
import Link from "next/link";

interface LeaderboardPlayer {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
  total_xp: number;
  nft_count: number;
  player_level: number;
  college_name: string | null;
}

type SortField = "total_xp" | "nft_count" | "player_level";

export default function LeaderboardPage() {
  const [players, setPlayers] = useState<LeaderboardPlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortField>("total_xp");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setCurrentUserId(user.id);

      const { data } = await supabase
        .from("users")
        .select("id, username, display_name, avatar_url, total_xp, nft_count, player_level, college_name")
        .order(sortBy, { ascending: false })
        .limit(100);

      if (data) setPlayers(data);
      setLoading(false);
    };
    fetchData();
  }, [sortBy]);

  const filtered = search
    ? players.filter(
        (p) =>
          p.display_name.toLowerCase().includes(search.toLowerCase()) ||
          p.username.toLowerCase().includes(search.toLowerCase())
      )
    : players;

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-hq-gold" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-300" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-amber-600" />;
    return <span className="text-sm font-mono text-hq-text-muted w-5 text-center">{rank}</span>;
  };

  const getRankStyle = (rank: number) => {
    if (rank === 1) return "bg-hq-gold/5 border-hq-gold/20";
    if (rank === 2) return "bg-gray-400/5 border-gray-400/20";
    if (rank === 3) return "bg-amber-700/5 border-amber-700/20";
    return "";
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 lg:py-12">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
        <div className="inline-flex items-center gap-2 mb-3">
          <Trophy className="w-6 h-6 text-hq-gold" />
          <NeonBadge variant="gold" size="lg">Global Leaderboard</NeonBadge>
        </div>
        <h1 className="font-heading font-bold text-3xl text-hq-text-primary">Top Players</h1>
        <p className="text-sm text-hq-text-muted mt-2">Compete. Rise. Dominate.</p>
      </motion.div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-hq-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search players..."
            className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-hq-bg-tertiary border border-white/[0.08] text-hq-text-primary placeholder:text-hq-text-muted text-sm focus:outline-none focus:border-hq-accent-purple/50 transition-all"
          />
        </div>
        <div className="flex gap-2">
          {(["total_xp", "nft_count", "player_level"] as SortField[]).map((field) => (
            <button
              key={field}
              onClick={() => setSortBy(field)}
              className={`px-4 py-2.5 rounded-lg text-xs font-medium transition-all ${
                sortBy === field
                  ? "bg-hq-accent-purple/15 text-hq-accent-glow border border-hq-accent-purple/30"
                  : "bg-hq-bg-tertiary text-hq-text-muted hover:text-hq-text-primary border border-white/[0.06]"
              }`}
            >
              {field === "total_xp" ? "XP" : field === "nft_count" ? "NFTs" : "Level"}
            </button>
          ))}
        </div>
      </div>

      {/* Leaderboard */}
      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="h-16 bg-white/[0.03] rounded-xl animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <GlassPanel className="p-12 text-center">
          <Trophy className="w-10 h-10 mx-auto mb-2 text-hq-text-muted opacity-50" />
          <p className="text-hq-text-muted">No players found.</p>
        </GlassPanel>
      ) : (
        <div className="space-y-1.5">
          {filtered.map((player, i) => {
            const rank = i + 1;
            const isCurrentUser = player.id === currentUserId;
            return (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.02, duration: 0.3 }}
              >
                <Link href={`/player/${player.id}`}>
                  <GlassPanel
                    className={`px-4 py-3 flex items-center gap-4 transition-all hover:bg-white/[0.06] ${
                      getRankStyle(rank)
                    } ${isCurrentUser ? "ring-1 ring-hq-accent-purple/40" : ""}`}
                  >
                    {/* Rank */}
                    <div className="w-8 flex items-center justify-center flex-shrink-0">
                      {getRankIcon(rank)}
                    </div>

                    {/* Avatar */}
                    <div className={`w-10 h-10 rounded-full overflow-hidden flex-shrink-0 ${
                      rank <= 3 ? "ring-2 ring-hq-gold/40" : "ring-1 ring-white/10"
                    }`}>
                      {player.avatar_url ? (
                        <img src={player.avatar_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-hq-accent-purple/30 flex items-center justify-center text-sm font-bold text-white">
                          {player.display_name.charAt(0)}
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={`text-sm font-semibold truncate ${rank <= 3 ? "text-hq-text-primary" : "text-hq-text-secondary"}`}>
                          {player.display_name}
                        </p>
                        {isCurrentUser && <NeonBadge variant="purple" size="sm">You</NeonBadge>}
                      </div>
                      <p className="text-xs text-hq-text-muted">
                        @{player.username} {player.college_name && `· ${player.college_name}`}
                      </p>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-6 flex-shrink-0">
                      <div className="text-right">
                        <p className="text-xs text-hq-text-muted">Level</p>
                        <p className="text-sm font-semibold text-hq-accent-glow">{player.player_level}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-hq-text-muted">NFTs</p>
                        <p className="text-sm font-semibold text-hq-accent-violet">{player.nft_count}</p>
                      </div>
                      <div className="text-right min-w-[60px]">
                        <p className="text-xs text-hq-text-muted">XP</p>
                        <p className="text-sm font-bold gradient-text-gold">{formatNumber(player.total_xp)}</p>
                      </div>
                    </div>
                  </GlassPanel>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
