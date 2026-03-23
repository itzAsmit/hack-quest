"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Search, ChevronRight, Trash2 } from "lucide-react";
import { GlassPanel } from "@/components/shared/GlassPanel";
import { NeonBadge } from "@/components/shared/NeonBadge";
import { formatNumber } from "@/lib/utils";
import Link from "next/link";

interface Player {
  id: string;
  username: string;
  display_name: string;
  email: string;
  avatar_url: string | null;
  total_xp: number;
  nft_count: number;
  player_level: number;
  role: string;
  created_at: string;
}

export default function OrganiserPlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const supabase = createClient();

  useEffect(() => {
    const fetchPlayers = async () => {
      const { data } = await supabase
        .from("users")
        .select("*")
        .order("total_xp", { ascending: false });
      if (data) setPlayers(data as Player[]);
      setLoading(false);
    };
    fetchPlayers();
  }, []);

  const filtered = players.filter(
    (p) =>
      p.username?.toLowerCase().includes(search.toLowerCase()) ||
      p.display_name?.toLowerCase().includes(search.toLowerCase()) ||
      p.email?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this player? This cannot be undone.")) return;
    await supabase.from("users").delete().eq("id", id);
    setPlayers((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-heading font-bold text-2xl text-hq-text-primary">Players</h1>
        <p className="text-sm text-hq-text-muted mt-1">{players.length} registered players</p>
      </motion.div>

      {/* Search */}
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-hq-text-muted" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search players..."
          className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-hq-bg-tertiary border border-white/[0.08] text-hq-text-primary placeholder:text-hq-text-muted text-sm focus:outline-none focus:border-hq-accent-purple/50 transition-all"
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-14 bg-white/[0.03] rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <GlassPanel className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left text-[10px] font-medium text-hq-text-muted uppercase tracking-wider px-4 py-3">Player</th>
                  <th className="text-left text-[10px] font-medium text-hq-text-muted uppercase tracking-wider px-4 py-3">Email</th>
                  <th className="text-right text-[10px] font-medium text-hq-text-muted uppercase tracking-wider px-4 py-3">Level</th>
                  <th className="text-right text-[10px] font-medium text-hq-text-muted uppercase tracking-wider px-4 py-3">XP</th>
                  <th className="text-right text-[10px] font-medium text-hq-text-muted uppercase tracking-wider px-4 py-3">NFTs</th>
                  <th className="text-right text-[10px] font-medium text-hq-text-muted uppercase tracking-wider px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((player) => (
                  <tr key={player.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-hq-accent-purple/30 flex-shrink-0">
                          {player.avatar_url ? (
                            <img src={player.avatar_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs font-bold text-white">
                              {player.display_name?.charAt(0) || "?"}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-hq-text-primary">{player.display_name}</p>
                          <p className="text-xs text-hq-text-muted">@{player.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-hq-text-secondary">{player.email}</td>
                    <td className="px-4 py-3 text-right">
                      <NeonBadge variant="purple" size="sm">Lv.{player.player_level}</NeonBadge>
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-medium gradient-text-gold">
                      {formatNumber(player.total_xp)}
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-hq-text-secondary">
                      {player.nft_count}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/organiser/players/${player.id}`} className="p-1.5 rounded-lg hover:bg-white/[0.06] text-hq-text-muted hover:text-hq-text-primary transition-colors">
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                        <button onClick={() => handleDelete(player.id)} className="p-1.5 rounded-lg hover:bg-hq-danger/10 text-hq-text-muted hover:text-hq-danger transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="p-8 text-center text-sm text-hq-text-muted">No players found.</div>
          )}
        </GlassPanel>
      )}
    </div>
  );
}
