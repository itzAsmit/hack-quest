"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Activity } from "lucide-react";
import { GlassPanel } from "@/components/shared/GlassPanel";
import { getRelativeTime } from "@/lib/utils";

interface ActivityItem {
  id: string;
  activity_type: string;
  message: string;
  is_public: boolean;
  created_at: string;
  users: { username: string; display_name: string } | null;
}

export default function OrganiserActivityPage() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchActivities = async () => {
      const { data } = await supabase
        .from("activity_feed")
        .select("id, activity_type, message, is_public, created_at, users(username, display_name)")
        .order("created_at", { ascending: false })
        .limit(50);
      if (data) setActivities(data as unknown as ActivityItem[]);
      setLoading(false);
    };
    fetchActivities();

    // Realtime
    const channel = supabase
      .channel("admin-activity")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "activity_feed" }, (payload) => {
        setActivities((prev) => [payload.new as ActivityItem, ...prev].slice(0, 50));
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const typeColors: Record<string, string> = {
    nft_claim: "bg-hq-accent-purple",
    nft_trade: "bg-hq-accent-violet",
    event_join: "bg-hq-success",
    auction_bid: "bg-hq-gold",
    level_up: "bg-hq-rarity-epic",
    xp_earn: "bg-hq-accent-glow",
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-heading font-bold text-2xl text-hq-text-primary">Activity Log</h1>
        <p className="text-sm text-hq-text-muted mt-1">All platform activity in real-time</p>
      </motion.div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-14 bg-white/[0.03] rounded-xl animate-pulse" />
          ))}
        </div>
      ) : activities.length === 0 ? (
        <GlassPanel className="p-12 text-center">
          <Activity className="w-10 h-10 mx-auto mb-2 text-hq-text-muted opacity-50" />
          <p className="text-hq-text-muted">No activity yet.</p>
        </GlassPanel>
      ) : (
        <div className="space-y-1.5">
          {activities.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.02 }}
            >
              <GlassPanel className="px-4 py-3 flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${typeColors[item.activity_type] || "bg-hq-text-muted"}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-hq-text-primary truncate">{item.message}</p>
                  <p className="text-[10px] text-hq-text-muted">
                    {item.users?.display_name || "System"} · {getRelativeTime(item.created_at)}
                  </p>
                </div>
                <span className="text-[10px] text-hq-text-muted bg-white/[0.04] px-2 py-0.5 rounded-full flex-shrink-0">
                  {item.activity_type.replace(/_/g, " ")}
                </span>
              </GlassPanel>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
