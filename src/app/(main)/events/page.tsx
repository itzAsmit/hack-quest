"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Calendar, Users, Clock, Search, Zap } from "lucide-react";
import { NeonBadge } from "@/components/shared/NeonBadge";
import { GlassPanel } from "@/components/shared/GlassPanel";

interface Event {
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
}

const FILTERS = ["all", "running", "upcoming", "completed"] as const;

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("all");
  const [search, setSearch] = useState("");
  const supabase = createClient();

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      let query = supabase
        .from("events")
        .select("*")
        .order("start_date", { ascending: false });

      if (filter !== "all") {
        query = query.eq("status", filter);
      }

      const { data } = await query;
      if (data) setEvents(data);
      setLoading(false);
    };
    fetchEvents();
  }, [filter]);

  const filtered = events.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "running":
        return { variant: "success" as const, label: "LIVE" };
      case "upcoming":
        return { variant: "purple" as const, label: "UPCOMING" };
      case "completed":
        return { variant: "slate" as const, label: "COMPLETED" };
      default:
        return { variant: "slate" as const, label: status.toUpperCase() };
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="w-5 h-5 text-hq-accent-glow" />
          <span className="text-sm font-medium text-hq-accent-glow uppercase tracking-wider">
            Compete
          </span>
        </div>
        <h1 className="font-heading font-bold text-3xl sm:text-4xl text-hq-text-primary">
          Events
        </h1>
        <p className="text-hq-text-secondary mt-1">
          Join hackathons, earn XP, and climb the leaderboard.
        </p>
      </motion.div>

      {/* Filters + Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-1 bg-hq-bg-secondary/50 rounded-lg p-1 border border-white/[0.06]">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                filter === f
                  ? "bg-hq-accent-purple text-white shadow-neon-purple"
                  : "text-hq-text-secondary hover:text-hq-text-primary hover:bg-white/[0.04]"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-hq-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search events..."
            className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-hq-bg-tertiary border border-white/[0.08] text-hq-text-primary placeholder:text-hq-text-muted text-sm focus:outline-none focus:border-hq-accent-purple/50 transition-all"
          />
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-72 bg-white/[0.03] rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <Calendar className="w-12 h-12 mx-auto mb-3 text-hq-text-muted opacity-50" />
          <p className="text-hq-text-muted">No events found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((event, i) => {
            const statusConfig = getStatusConfig(event.status);
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link href={`/events/${event.id}`} className="group block glass-panel-hover overflow-hidden h-full">
                  <div className="relative h-40 bg-gradient-to-br from-hq-accent-purple/20 to-hq-bg-tertiary overflow-hidden">
                    {event.banner_image ? (
                      <img src={event.banner_image} alt={event.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Calendar className="w-10 h-10 text-hq-accent-purple/30" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <NeonBadge variant={statusConfig.variant} size="sm">
                        {event.status === "running" && <span className="w-1.5 h-1.5 bg-hq-success rounded-full animate-pulse" />}
                        {statusConfig.label}
                      </NeonBadge>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-hq-bg-primary/90 via-transparent to-transparent" />
                  </div>
                  <div className="p-5">
                    <h3 className="font-heading font-semibold text-lg text-hq-text-primary group-hover:text-hq-accent-glow transition-colors line-clamp-1">
                      {event.name}
                    </h3>
                    {event.description && (
                      <p className="text-sm text-hq-text-muted mt-1 line-clamp-2">{event.description}</p>
                    )}
                    <div className="flex items-center gap-4 mt-4 text-xs text-hq-text-muted">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(event.start_date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      {event.prize_info && (
                        <span className="flex items-center gap-1">
                          <Zap className="w-3.5 h-3.5 text-hq-gold" />
                          {event.prize_info}
                        </span>
                      )}
                    </div>
                    {event.tags && event.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {event.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.04] text-hq-text-muted border border-white/[0.06]">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
