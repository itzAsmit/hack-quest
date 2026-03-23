"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Trophy, Zap, Image as ImageIcon, TrendingUp, Star } from "lucide-react";
import { GlassPanel } from "@/components/shared/GlassPanel";
import { AnimatedCounter } from "@/components/shared/AnimatedCounter";
import { NeonBadge } from "@/components/shared/NeonBadge";
import { formatNumber, calculateLevel, xpProgressPercent, getRelativeTime } from "@/lib/utils";

interface UserProfile {
  display_name: string;
  username: string;
  avatar_url: string | null;
  total_xp: number;
  cumulative_xp: number;
  hacks_balance: number;
  nft_count: number;
  player_level: number;
  rank_position: number | null;
}

interface Activity {
  id: string;
  activity_type: string;
  message: string;
  created_at: string;
}

export default function OverviewPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profileData } = await supabase
        .from("users")
        .select("display_name, username, avatar_url, total_xp, cumulative_xp, hacks_balance, nft_count, player_level, rank_position")
        .eq("id", user.id)
        .single();

      if (profileData) setProfile(profileData);

      const { data: activityData } = await supabase
        .from("activity_feed")
        .select("id, activity_type, message, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10);

      if (activityData) setActivities(activityData);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-white/[0.03] rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 bg-white/[0.03] rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!profile) return null;

  const level = calculateLevel(profile.total_xp);
  const xpProgress = xpProgressPercent(profile.total_xp);

  const stats = [
    { label: "Total XP", value: profile.total_xp, icon: Zap, color: "text-hq-gold", prefix: "", suffix: "" },
    { label: "Level", value: level, icon: Star, color: "text-hq-accent-glow", prefix: "", suffix: "" },
    { label: "NFTs Owned", value: profile.nft_count, icon: ImageIcon, color: "text-hq-accent-violet", prefix: "", suffix: "" },
    { label: "Hacks Balance", value: profile.hacks_balance, icon: TrendingUp, color: "text-hq-success", prefix: "", suffix: " ⚡" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-heading font-bold text-2xl text-hq-text-primary">
          Welcome back, {profile.display_name} 👋
        </h1>
        <p className="text-sm text-hq-text-muted mt-1">
          Here&apos;s your quest overview
        </p>
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <GlassPanel hover className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-hq-text-muted uppercase tracking-wider">
                  {stat.label}
                </span>
                <stat.icon className={`w-4.5 h-4.5 ${stat.color}`} />
              </div>
              <p className={`font-heading font-bold text-2xl ${stat.color}`}>
                <AnimatedCounter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
              </p>
            </GlassPanel>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* XP Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <GlassPanel className="p-6">
            <h2 className="font-heading font-semibold text-lg text-hq-text-primary mb-4">
              Level Progress
            </h2>
            <div className="flex items-center gap-4 mb-3">
              <NeonBadge variant="gold" size="lg">Level {level}</NeonBadge>
              {profile.rank_position && (
                <NeonBadge variant="purple" size="lg">
                  <Trophy className="w-3.5 h-3.5" />
                  Rank #{profile.rank_position}
                </NeonBadge>
              )}
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-hq-text-muted mb-2">
                <span>Level {level}</span>
                <span>Level {level + 1}</span>
              </div>
              <div className="h-3 bg-hq-bg-tertiary rounded-full overflow-hidden border border-white/[0.06]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${xpProgress}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full rounded-full bg-gradient-to-r from-hq-accent-purple via-hq-accent-violet to-hq-gold"
                />
              </div>
              <p className="text-xs text-hq-text-muted mt-2">
                {formatNumber(profile.total_xp % 1000)} / 1,000 XP to next level
              </p>
            </div>
          </GlassPanel>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <GlassPanel className="p-6 h-full">
            <h2 className="font-heading font-semibold text-lg text-hq-text-primary mb-4">
              Recent Activity
            </h2>
            {activities.length === 0 ? (
              <p className="text-sm text-hq-text-muted">No activity yet. Start competing!</p>
            ) : (
              <div className="space-y-3">
                {activities.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-hq-accent-purple mt-1.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm text-hq-text-secondary truncate">{activity.message}</p>
                      <p className="text-[10px] text-hq-text-muted">{getRelativeTime(activity.created_at)}</p>
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
