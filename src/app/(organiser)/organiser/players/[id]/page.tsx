"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, Zap, Star, Image as ImageIcon, Trophy, Loader2, Plus, Minus } from "lucide-react";
import { GlassPanel } from "@/components/shared/GlassPanel";
import { NeonBadge } from "@/components/shared/NeonBadge";
import { formatNumber } from "@/lib/utils";

interface PlayerDetail {
  id: string;
  username: string;
  display_name: string;
  email: string;
  avatar_url: string | null;
  total_xp: number;
  hacks_balance: number;
  nft_count: number;
  player_level: number;
  rank_position: number | null;
  college_name: string | null;
  phone: string | null;
  created_at: string;
}

export default function PlayerDetailPage() {
  const params = useParams();
  const [player, setPlayer] = useState<PlayerDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [xpAmount, setXpAmount] = useState("");
  const [granting, setGranting] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const fetchPlayer = async () => {
      const { data } = await supabase
        .from("users")
        .select("*")
        .eq("id", params.id)
        .single();
      if (data) setPlayer(data as PlayerDetail);
      setLoading(false);
    };
    fetchPlayer();
  }, [params.id]);

  const grantXP = async (add: boolean) => {
    if (!player || !xpAmount) return;
    const amount = parseInt(xpAmount);
    if (isNaN(amount) || amount <= 0) return;
    setGranting(true);

    const newXP = add ? player.total_xp + amount : Math.max(0, player.total_xp - amount);
    await supabase.from("users").update({ total_xp: newXP }).eq("id", player.id);
    setPlayer({ ...player, total_xp: newXP });
    setXpAmount("");
    setGranting(false);
  };

  if (loading) {
    return <div className="h-96 bg-white/[0.03] rounded-2xl animate-pulse" />;
  }

  if (!player) {
    return (
      <div className="text-center py-20">
        <p className="text-hq-text-muted">Player not found.</p>
        <Link href="/organiser/players" className="text-hq-accent-violet hover:underline mt-2 inline-block">Back to Players</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <Link href="/organiser/players" className="inline-flex items-center gap-1.5 text-sm text-hq-text-muted hover:text-hq-text-primary transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Players
      </Link>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <GlassPanel className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-hq-accent-purple/30 flex-shrink-0">
              {player.avatar_url ? (
                <img src={player.avatar_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xl font-bold text-white">
                  {player.display_name.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <h1 className="font-heading font-bold text-xl text-hq-text-primary">{player.display_name}</h1>
              <p className="text-sm text-hq-text-muted">@{player.username} · {player.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <NeonBadge variant="purple">Level {player.player_level}</NeonBadge>
                {player.rank_position && <NeonBadge variant="gold"><Trophy className="w-3 h-3" /> Rank #{player.rank_position}</NeonBadge>}
              </div>
            </div>
          </div>
        </GlassPanel>
      </motion.div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total XP", value: formatNumber(player.total_xp), icon: Zap, color: "text-hq-gold" },
          { label: "Level", value: player.player_level, icon: Star, color: "text-hq-accent-glow" },
          { label: "NFTs", value: player.nft_count, icon: ImageIcon, color: "text-hq-accent-violet" },
          { label: "Hacks", value: formatNumber(player.hacks_balance), icon: Trophy, color: "text-hq-success" },
        ].map((stat) => (
          <GlassPanel key={stat.label} className="p-4 text-center">
            <stat.icon className={`w-5 h-5 mx-auto mb-1 ${stat.color}`} />
            <p className={`font-heading font-bold text-lg ${stat.color}`}>{stat.value}</p>
            <p className="text-[10px] text-hq-text-muted uppercase">{stat.label}</p>
          </GlassPanel>
        ))}
      </div>

      {/* Grant/Deduct XP */}
      <GlassPanel className="p-5">
        <h2 className="font-heading font-semibold text-hq-text-primary mb-3">Manage XP</h2>
        <div className="flex items-center gap-3">
          <input
            type="number"
            value={xpAmount}
            onChange={(e) => setXpAmount(e.target.value)}
            placeholder="Amount"
            className="flex-1 px-4 py-2.5 rounded-lg bg-hq-bg-tertiary border border-white/[0.08] text-hq-text-primary text-sm focus:outline-none focus:border-hq-accent-purple/50 transition-all"
          />
          <button onClick={() => grantXP(true)} disabled={granting} className="btn-primary text-sm flex items-center gap-1.5 disabled:opacity-50">
            {granting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />} Grant XP
          </button>
          <button onClick={() => grantXP(false)} disabled={granting} className="btn-outline text-sm flex items-center gap-1.5 disabled:opacity-50">
            <Minus className="w-3.5 h-3.5" /> Deduct XP
          </button>
        </div>
      </GlassPanel>

      <GlassPanel className="p-5">
        <h2 className="font-heading font-semibold text-hq-text-primary mb-3">Details</h2>
        <div className="grid grid-cols-2 gap-3 text-sm">
          {[
            ["College", player.college_name || "—"],
            ["Phone", player.phone || "—"],
            ["Joined", new Date(player.created_at).toLocaleDateString()],
            ["User ID", player.id],
          ].map(([label, value]) => (
            <div key={label as string}>
              <p className="text-xs text-hq-text-muted">{label}</p>
              <p className="text-hq-text-secondary truncate">{value}</p>
            </div>
          ))}
        </div>
      </GlassPanel>
    </div>
  );
}
