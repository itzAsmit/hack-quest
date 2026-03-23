"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Users, Calendar, Image as ImageIcon, Activity, TrendingUp } from "lucide-react";
import { GlassPanel } from "@/components/shared/GlassPanel";
import { AnimatedCounter } from "@/components/shared/AnimatedCounter";

export default function OrganiserOverviewPage() {
  const [stats, setStats] = useState({ users: 0, events: 0, nfts: 0, activities: 0 });
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchStats = async () => {
      const [usersRes, eventsRes, nftsRes, activityRes] = await Promise.all([
        supabase.from("users").select("id", { count: "exact", head: true }),
        supabase.from("events").select("id", { count: "exact", head: true }),
        supabase.from("nft_definitions").select("id", { count: "exact", head: true }),
        supabase.from("activity_feed").select("id", { count: "exact", head: true }),
      ]);

      setStats({
        users: usersRes.count || 0,
        events: eventsRes.count || 0,
        nfts: nftsRes.count || 0,
        activities: activityRes.count || 0,
      });
      setLoading(false);
    };
    fetchStats();
  }, []);

  const cards = [
    { label: "Total Players", value: stats.users, icon: Users, color: "text-hq-accent-glow" },
    { label: "Events", value: stats.events, icon: Calendar, color: "text-hq-accent-violet" },
    { label: "NFT Definitions", value: stats.nfts, icon: ImageIcon, color: "text-hq-gold" },
    { label: "Activity Feed", value: stats.activities, icon: Activity, color: "text-hq-success" },
  ];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp className="w-5 h-5 text-hq-gold" />
          <span className="text-xs font-medium text-hq-gold uppercase tracking-wider">Admin</span>
        </div>
        <h1 className="font-heading font-bold text-2xl text-hq-text-primary">Organiser Dashboard</h1>
        <p className="text-sm text-hq-text-muted mt-1">Platform overview</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <GlassPanel hover className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-hq-text-muted uppercase tracking-wider">{card.label}</span>
                <card.icon className={`w-4.5 h-4.5 ${card.color}`} />
              </div>
              <p className={`font-heading font-bold text-2xl ${card.color}`}>
                {loading ? "—" : <AnimatedCounter value={card.value} />}
              </p>
            </GlassPanel>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
