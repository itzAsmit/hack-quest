"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Zap, Image as ImageIcon, Trophy, UserPlus, ArrowUpDown, Coins } from "lucide-react";
import { useRealtime } from "@/hooks/useRealtime";

type Activity = Record<string, unknown> & {
  id: string;
  activity_type: string;
  message: string;
  created_at: string;
};

const activityIcons: Record<string, React.ReactNode> = {
  nft_mint: <ImageIcon className="w-3.5 h-3.5 text-hq-accent-violet" />,
  rank_change: <Trophy className="w-3.5 h-3.5 text-hq-gold" />,
  event_join: <UserPlus className="w-3.5 h-3.5 text-hq-success" />,
  deposit: <Coins className="w-3.5 h-3.5 text-hq-gold" />,
  withdraw: <ArrowUpDown className="w-3.5 h-3.5 text-hq-accent-glow" />,
  auction_bid: <Zap className="w-3.5 h-3.5 text-hq-accent-purple" />,
};

export function ActivityTicker() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const fetchActivities = async () => {
      const { data } = await supabase
        .from("activity_feed")
        .select("id, activity_type, message, created_at")
        .eq("is_public", true)
        .order("created_at", { ascending: false })
        .limit(20);

      if (data && data.length > 0) {
        setActivities(data);
      } else {
        // Placeholder activities when empty
        setActivities([
          { id: "1", activity_type: "nft_mint", message: "A new challenger has entered the arena!", created_at: new Date().toISOString() },
          { id: "2", activity_type: "rank_change", message: "The leaderboard is heating up 🔥", created_at: new Date().toISOString() },
          { id: "3", activity_type: "event_join", message: "A hackathon is about to begin!", created_at: new Date().toISOString() },
          { id: "4", activity_type: "auction_bid", message: "Rare NFTs are being auctioned right now!", created_at: new Date().toISOString() },
          { id: "5", activity_type: "deposit", message: "Players are stacking Hacks ⚡", created_at: new Date().toISOString() },
        ]);
      }
    };
    fetchActivities();
  }, [supabase]);

  useRealtime<Activity>({
    table: "activity_feed",
    event: "INSERT",
    onInsert: (payload) => {
      setActivities((prev) => [payload, ...prev].slice(0, 20));
    },
  });

  if (activities.length === 0) return null;

  // Duplicate for seamless scroll
  const tickerItems = [...activities, ...activities];

  return (
    <section className="py-6 border-y border-white/[0.04] bg-hq-bg-secondary/30 overflow-hidden">
      <div className="relative">
        <div className="flex animate-ticker gap-8 whitespace-nowrap">
          {tickerItems.map((activity, i) => (
            <div
              key={`${activity.id}-${i}`}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.02] border border-white/[0.04]"
            >
              {activityIcons[activity.activity_type] || <Zap className="w-3.5 h-3.5 text-hq-text-muted" />}
              <span className="text-xs text-hq-text-secondary font-medium">
                {activity.message}
              </span>
            </div>
          ))}
        </div>

        {/* Edge fades */}
        <div className="absolute top-0 left-0 bottom-0 w-24 bg-gradient-to-r from-hq-bg-primary to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 right-0 bottom-0 w-24 bg-gradient-to-l from-hq-bg-primary to-transparent z-10 pointer-events-none" />
      </div>
    </section>
  );
}
