"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Calendar, Users, Clock, ArrowRight, Zap } from "lucide-react";
import { NeonBadge } from "@/components/shared/NeonBadge";

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
}

export function EventsTeaser() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchEvents = async () => {
      const { data } = await supabase
        .from("events")
        .select("id, name, description, banner_image, status, start_date, end_date, tags, max_participants")
        .order("start_date", { ascending: false })
        .limit(3);

      if (data) setEvents(data);
      setLoading(false);
    };
    fetchEvents();
  }, []);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "running":
        return { variant: "success" as const, label: "LIVE", pulse: true };
      case "upcoming":
        return { variant: "purple" as const, label: "UPCOMING", pulse: false };
      case "completed":
        return { variant: "slate" as const, label: "COMPLETED", pulse: false };
      default:
        return { variant: "slate" as const, label: status.toUpperCase(), pulse: false };
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <section className="py-16 lg:py-24 px-4 sm:px-6 relative">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-10"
        >
          <div>
            <div className="inline-flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-hq-accent-glow" />
              <span className="text-sm font-medium text-hq-accent-glow uppercase tracking-wider">
                Upcoming & Live
              </span>
            </div>
            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-hq-text-primary">
              Featured Events
            </h2>
          </div>
          <Link
            href="/events"
            className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-hq-accent-violet hover:text-hq-accent-glow transition-colors group"
          >
            View All
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </motion.div>

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-72 bg-white/[0.03] rounded-2xl animate-pulse" />
            ))}
          </div>
        )}

        {/* Event cards */}
        {!loading && events.length === 0 && (
          <div className="text-center py-16 text-hq-text-muted">
            <Calendar className="w-10 h-10 mx-auto mb-3 opacity-50" />
            <p>No events yet. Stay tuned!</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {events.map((event, index) => {
            const statusConfig = getStatusConfig(event.status);
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  href={`/events/${event.id}`}
                  className="group block glass-panel-hover overflow-hidden"
                >
                  {/* Banner */}
                  <div className="relative h-40 bg-gradient-to-br from-hq-accent-purple/20 to-hq-bg-tertiary overflow-hidden">
                    {event.banner_image ? (
                      <img
                        src={event.banner_image}
                        alt={event.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Calendar className="w-10 h-10 text-hq-accent-purple/30" />
                      </div>
                    )}
                    {/* Status badge */}
                    <div className="absolute top-3 right-3">
                      <NeonBadge variant={statusConfig.variant} size="sm" pulse={statusConfig.pulse}>
                        {statusConfig.pulse && (
                          <span className="w-1.5 h-1.5 bg-hq-success rounded-full animate-pulse" />
                        )}
                        {statusConfig.label}
                      </NeonBadge>
                    </div>
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-hq-bg-primary/90 via-transparent to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="font-heading font-semibold text-lg text-hq-text-primary group-hover:text-hq-accent-glow transition-colors line-clamp-1">
                      {event.name}
                    </h3>
                    {event.description && (
                      <p className="text-sm text-hq-text-muted mt-1 line-clamp-2">
                        {event.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 mt-4 text-xs text-hq-text-muted">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {formatDate(event.start_date)}
                      </span>
                      {event.max_participants && (
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" />
                          {event.max_participants} spots
                        </span>
                      )}
                    </div>
                    {/* Tags */}
                    {event.tags && event.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {event.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.04] text-hq-text-muted border border-white/[0.06]"
                          >
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

        <Link
          href="/events"
          className="sm:hidden flex items-center justify-center gap-1.5 mt-6 text-sm font-medium text-hq-accent-violet hover:text-hq-accent-glow transition-colors"
        >
          View All Events
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
