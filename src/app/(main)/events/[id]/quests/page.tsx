"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import {
  ArrowLeft, Target, CheckCircle, Circle, Clock, Zap,
  Trophy, Lock, Loader2
} from "lucide-react";
import { GlassPanel } from "@/components/shared/GlassPanel";
import { NeonBadge } from "@/components/shared/NeonBadge";
import { useToast } from "@/components/shared/Toast";
import { formatNumber } from "@/lib/utils";

interface Quest {
  id: string;
  event_id: string;
  title: string;
  description: string | null;
  xp_reward: number;
  quest_type: string;
  required_value: number;
  order_index: number;
  is_active: boolean;
}

interface QuestProgress {
  quest_id: string;
  user_id: string;
  current_value: number;
  is_completed: boolean;
  completed_at: string | null;
}

interface EventInfo {
  id: string;
  name: string;
  status: string;
}

export default function QuestsPage() {
  const params = useParams();
  const [event, setEvent] = useState<EventInfo | null>(null);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [progress, setProgress] = useState<QuestProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [isParticipant, setIsParticipant] = useState(false);
  const [claimingId, setClaimingId] = useState<string | null>(null);
  const supabase = createClient();
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserId(user.id);

      // Get event
      const { data: eventData } = await supabase
        .from("events")
        .select("id, name, status")
        .eq("id", params.id)
        .single();
      if (eventData) setEvent(eventData);

      // Get quests
      const { data: questData } = await supabase
        .from("quests")
        .select("*")
        .eq("event_id", params.id)
        .eq("is_active", true)
        .order("order_index", { ascending: true });
      if (questData) setQuests(questData);

      // Check participation
      if (user) {
        const { data: partData } = await supabase
          .from("event_participants")
          .select("id")
          .eq("event_id", params.id)
          .eq("user_id", user.id)
          .single();
        setIsParticipant(!!partData);

        // Get quest progress
        if (questData && questData.length > 0) {
          const { data: progressData } = await supabase
            .from("quest_progress")
            .select("*")
            .eq("user_id", user.id)
            .in("quest_id", questData.map(q => q.id));
          if (progressData) setProgress(progressData);
        }
      }

      setLoading(false);
    };
    fetchData();
  }, [params.id]);

  const getQuestProgress = (questId: string): QuestProgress | undefined => {
    return progress.find((p) => p.quest_id === questId);
  };

  const handleClaimReward = async (quest: Quest) => {
    if (!userId) return;
    setClaimingId(quest.id);

    try {
      const res = await fetch("/api/events/award-xp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          amount: quest.xp_reward,
          event_id: params.id,
          source: "quest_completion",
        }),
      });

      if (res.ok) {
        toast(`Earned ${quest.xp_reward} XP from "${quest.title}"!`, "success");
        // Mark as claimed locally
        setProgress((prev) =>
          prev.map((p) =>
            p.quest_id === quest.id
              ? { ...p, is_completed: true, completed_at: new Date().toISOString() }
              : p
          )
        );
      } else {
        toast("Failed to claim reward", "error");
      }
    } catch {
      toast("Failed to claim reward", "error");
    }

    setClaimingId(null);
  };

  const completedCount = progress.filter((p) => p.is_completed).length;
  const totalXp = quests.reduce((acc, q) => acc + q.xp_reward, 0);
  const earnedXp = quests
    .filter((q) => {
      const p = getQuestProgress(q.id);
      return p?.is_completed;
    })
    .reduce((acc, q) => acc + q.xp_reward, 0);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="h-8 w-1/3 bg-white/[0.03] rounded animate-pulse mb-8" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-white/[0.03] rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="text-hq-text-muted">Event not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 lg:py-12">
      <Link
        href={`/events/${params.id}`}
        className="inline-flex items-center gap-1.5 text-sm text-hq-text-muted hover:text-hq-text-primary transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back to {event.name}
      </Link>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Target className="w-5 h-5 text-hq-accent-glow" />
          <NeonBadge variant="purple">Quests</NeonBadge>
        </div>
        <h1 className="font-heading font-bold text-2xl sm:text-3xl text-hq-text-primary">
          {event.name} — Quests
        </h1>
      </motion.div>

      {/* Progress bar */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <GlassPanel className="p-5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-hq-gold" />
              <span className="text-sm font-medium text-hq-text-primary">Quest Progress</span>
            </div>
            <span className="text-xs text-hq-text-muted">
              {completedCount}/{quests.length} completed
            </span>
          </div>
          <div className="h-2.5 bg-hq-bg-tertiary rounded-full overflow-hidden border border-white/[0.06]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: quests.length ? `${(completedCount / quests.length) * 100}%` : "0%" }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-hq-accent-purple via-hq-accent-violet to-hq-gold"
            />
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-hq-text-muted">
            <span>{formatNumber(earnedXp)} XP earned</span>
            <span>{formatNumber(totalXp)} XP total</span>
          </div>
        </GlassPanel>
      </motion.div>

      {/* Quest list */}
      {!isParticipant && userId && (
        <GlassPanel className="p-6 text-center mb-6">
          <Lock className="w-8 h-8 mx-auto mb-2 text-hq-text-muted" />
          <p className="text-sm text-hq-text-muted">Join the event to start completing quests.</p>
          <Link href={`/events/${params.id}`} className="btn-primary mt-3 inline-block">
            Join Event
          </Link>
        </GlassPanel>
      )}

      <div className="space-y-3">
        {quests.map((quest, i) => {
          const qp = getQuestProgress(quest.id);
          const isCompleted = qp?.is_completed || false;
          const progressPct = qp ? Math.min((qp.current_value / quest.required_value) * 100, 100) : 0;

          return (
            <motion.div
              key={quest.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.05 }}
            >
              <GlassPanel className={`p-5 transition-all ${isCompleted ? "border-hq-success/20 bg-hq-success/[0.03]" : ""}`}>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-0.5">
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5 text-hq-success" />
                    ) : (
                      <Circle className="w-5 h-5 text-hq-text-muted" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`text-sm font-semibold ${isCompleted ? "text-hq-success line-through" : "text-hq-text-primary"}`}>
                        {quest.title}
                      </h3>
                      <NeonBadge variant={isCompleted ? "success" : "slate"} size="sm">
                        {quest.quest_type.replace(/_/g, " ")}
                      </NeonBadge>
                    </div>
                    {quest.description && (
                      <p className="text-xs text-hq-text-muted mb-2">{quest.description}</p>
                    )}

                    {/* Progress bar for incomplete */}
                    {!isCompleted && qp && (
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-[10px] text-hq-text-muted mb-1">
                          <span>Progress</span>
                          <span>{qp.current_value}/{quest.required_value}</span>
                        </div>
                        <div className="h-1.5 bg-hq-bg-tertiary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-hq-accent-purple rounded-full transition-all"
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <div className="flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-hq-gold" />
                      <span className="text-sm font-semibold gradient-text-gold">
                        {formatNumber(quest.xp_reward)}
                      </span>
                    </div>

                    {isCompleted && qp?.completed_at && (
                      <span className="text-[10px] text-hq-text-muted flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(qp.completed_at).toLocaleDateString()}
                      </span>
                    )}

                    {isParticipant && !isCompleted && qp && progressPct >= 100 && (
                      <button
                        onClick={() => handleClaimReward(quest)}
                        disabled={claimingId === quest.id}
                        className="btn-primary !px-3 !py-1.5 text-xs"
                      >
                        {claimingId === quest.id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          "Claim"
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </GlassPanel>
            </motion.div>
          );
        })}
      </div>

      {quests.length === 0 && (
        <GlassPanel className="p-12 text-center">
          <Target className="w-10 h-10 mx-auto mb-2 text-hq-text-muted opacity-50" />
          <p className="text-hq-text-muted">No quests available for this event yet.</p>
        </GlassPanel>
      )}
    </div>
  );
}
