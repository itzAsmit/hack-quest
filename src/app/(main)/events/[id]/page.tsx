"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Calendar, Users, Clock, Trophy, ArrowLeft, Zap, UserPlus, Loader2 } from "lucide-react";
import { NeonBadge } from "@/components/shared/NeonBadge";
import { GlassPanel } from "@/components/shared/GlassPanel";
import { formatNumber } from "@/lib/utils";
import Link from "next/link";

interface EventDetail {
  id: string;
  name: string;
  description: string | null;
  banner_image: string | null;
  status: string;
  start_date: string;
  end_date: string;
  tags: string[];
  max_participants: number | null;
  prize_info: string | null;
  is_team_event: boolean;
}

interface Participant {
  user_id: string;
  xp_earned: number;
  users: {
    username: string;
    display_name: string;
    avatar_url: string | null;
  };
}

export default function EventDetailPage() {
  const params = useParams();
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [joined, setJoined] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchEventData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserId(user.id);

      const { data: eventData } = await supabase
        .from("events")
        .select("*")
        .eq("id", params.id)
        .single();

      if (eventData) setEvent(eventData);

      // Fetch participants
      const { data: partData } = await supabase
        .from("event_participants")
        .select("user_id, xp_earned, users(username, display_name, avatar_url)")
        .eq("event_id", params.id)
        .order("xp_earned", { ascending: false });

      if (partData) {
        setParticipants(partData as unknown as Participant[]);
        if (user) {
          setJoined(partData.some((p: any) => p.user_id === user.id));
        }
      }
      setLoading(false);
    };
    fetchEventData();
  }, [params.id]);

  const handleJoin = async () => {
    if (!userId) return;
    setJoining(true);
    try {
      const res = await fetch("/api/events/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event_id: params.id }),
      });
      if (res.ok) {
        setJoined(true);
        // Refresh participants
        const { data } = await supabase
          .from("event_participants")
          .select("user_id, xp_earned, users(username, display_name, avatar_url)")
          .eq("event_id", params.id)
          .order("xp_earned", { ascending: false });
        if (data) setParticipants(data as unknown as Participant[]);
      }
    } catch (err) {
      console.error("Failed to join event:", err);
    }
    setJoining(false);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="h-64 bg-white/[0.03] rounded-2xl animate-pulse mb-8" />
        <div className="h-8 w-1/3 bg-white/[0.03] rounded animate-pulse mb-4" />
        <div className="h-32 bg-white/[0.03] rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="text-hq-text-muted">Event not found.</p>
        <Link href="/events" className="text-hq-accent-violet hover:underline mt-2 inline-block">
          Back to Events
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 lg:py-12">
      <Link href="/events" className="inline-flex items-center gap-1.5 text-sm text-hq-text-muted hover:text-hq-text-primary transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to Events
      </Link>

      {/* Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative h-56 sm:h-72 rounded-2xl overflow-hidden mb-8"
      >
        {event.banner_image ? (
          <img src={event.banner_image} alt={event.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-hq-accent-purple/20 to-hq-bg-tertiary flex items-center justify-center">
            <Calendar className="w-16 h-16 text-hq-accent-purple/30" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-hq-bg-primary via-hq-bg-primary/40 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6">
          <NeonBadge variant={event.status === "running" ? "success" : event.status === "upcoming" ? "purple" : "slate"} className="mb-3">
            {event.status === "running" && <span className="w-1.5 h-1.5 bg-hq-success rounded-full animate-pulse" />}
            {event.status.toUpperCase()}
          </NeonBadge>
          <h1 className="font-heading font-bold text-2xl sm:text-3xl text-hq-text-primary">{event.name}</h1>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {event.description && (
            <GlassPanel className="p-6">
              <h2 className="font-heading font-semibold text-lg text-hq-text-primary mb-3">About</h2>
              <p className="text-sm text-hq-text-secondary leading-relaxed">{event.description}</p>
            </GlassPanel>
          )}

          {/* Leaderboard */}
          {event.status === "completed" && participants.length > 0 && (
            <GlassPanel className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="w-5 h-5 text-hq-gold" />
                <h2 className="font-heading font-semibold text-lg text-hq-text-primary">Leaderboard</h2>
              </div>
              <div className="space-y-2">
                {participants.map((p, i) => (
                  <div key={p.user_id} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/[0.03]">
                    <span className="text-sm font-medium text-hq-text-muted w-6 text-center">{i + 1}</span>
                    <div className="w-7 h-7 rounded-full overflow-hidden bg-hq-accent-purple/30 flex-shrink-0">
                      {p.users.avatar_url ? (
                        <img src={p.users.avatar_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs font-bold text-white">
                          {p.users.display_name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <span className="text-sm text-hq-text-primary flex-1">{p.users.display_name}</span>
                    <span className="text-sm font-medium gradient-text-gold">{formatNumber(p.xp_earned)} XP</span>
                  </div>
                ))}
              </div>
            </GlassPanel>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <GlassPanel className="p-5">
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-hq-text-secondary">
                <Clock className="w-4 h-4 text-hq-text-muted" />
                <span>{new Date(event.start_date).toLocaleDateString()} — {new Date(event.end_date).toLocaleDateString()}</span>
              </div>
              {event.max_participants && (
                <div className="flex items-center gap-2 text-hq-text-secondary">
                  <Users className="w-4 h-4 text-hq-text-muted" />
                  <span>{participants.length} / {event.max_participants} joined</span>
                </div>
              )}
              {event.prize_info && (
                <div className="flex items-center gap-2 text-hq-text-secondary">
                  <Zap className="w-4 h-4 text-hq-gold" />
                  <span>{event.prize_info}</span>
                </div>
              )}
              {event.is_team_event && (
                <NeonBadge variant="purple" size="sm">Team Event</NeonBadge>
              )}
            </div>

            {event.status !== "completed" && (
              <div className="mt-5 pt-4 border-t border-white/[0.06]">
                {userId ? (
                  joined ? (
                    <div className="text-sm text-hq-success text-center font-medium">✅ You&apos;ve joined this event</div>
                  ) : (
                    <button onClick={handleJoin} disabled={joining} className="btn-primary w-full flex items-center justify-center gap-2">
                      {joining ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                      {joining ? "Joining..." : "Join Event"}
                    </button>
                  )
                ) : (
                  <Link href="/login" className="btn-primary w-full flex items-center justify-center gap-2">
                    Login to Join
                  </Link>
                )}
              </div>
            )}
          </GlassPanel>

          {/* Quests link */}
          {joined && (
            <Link
              href={`/events/${params.id}/quests`}
              className="block glass-panel-hover p-4 text-center group"
            >
              <div className="flex items-center justify-center gap-2 text-sm font-medium text-hq-accent-glow group-hover:text-hq-accent-violet transition-colors">
                <span className="text-lg">🎯</span>
                View Quests
              </div>
              <p className="text-[10px] text-hq-text-muted mt-1">Complete quests to earn XP</p>
            </Link>
          )}

          {event.tags && event.tags.length > 0 && (
            <GlassPanel className="p-5">
              <h3 className="text-xs font-medium text-hq-text-muted uppercase tracking-wider mb-3">Tags</h3>
              <div className="flex flex-wrap gap-1.5">
                {event.tags.map((tag) => (
                  <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-white/[0.04] text-hq-text-secondary border border-white/[0.06]">
                    {tag}
                  </span>
                ))}
              </div>
            </GlassPanel>
          )}
        </div>
      </div>
    </div>
  );
}
