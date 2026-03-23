"use client";

import { useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import type { RealtimeChannel, RealtimePostgresChangesPayload } from "@supabase/supabase-js";

type PostgresEvent = "INSERT" | "UPDATE" | "DELETE" | "*";

interface UseRealtimeOptions<T extends Record<string, unknown>> {
  table: string;
  schema?: string;
  event?: PostgresEvent;
  filter?: string;
  onInsert?: (payload: T) => void;
  onUpdate?: (payload: { old: T; new: T }) => void;
  onDelete?: (payload: T) => void;
  onChange?: (payload: RealtimePostgresChangesPayload<T>) => void;
  enabled?: boolean;
}

export function useRealtime<T extends Record<string, unknown>>({
  table,
  schema = "public",
  event = "*",
  filter,
  onInsert,
  onUpdate,
  onDelete,
  onChange,
  enabled = true,
}: UseRealtimeOptions<T>) {
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const supabase = createClient();
    const channelName = `realtime-${table}-${Date.now()}`;

    const channelConfig: Record<string, string> = {
      event,
      schema,
      table,
    };
    if (filter) channelConfig.filter = filter;

    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes" as any,
        channelConfig,
        (payload: RealtimePostgresChangesPayload<T>) => {
          onChange?.(payload);

          if (payload.eventType === "INSERT" && onInsert) {
            onInsert(payload.new as T);
          }
          if (payload.eventType === "UPDATE" && onUpdate) {
            onUpdate({
              old: payload.old as T,
              new: payload.new as T,
            });
          }
          if (payload.eventType === "DELETE" && onDelete) {
            onDelete(payload.old as T);
          }
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, schema, event, filter, enabled]);
}

/**
 * Subscribe to realtime broadcast events
 */
export function useBroadcast<T = unknown>({
  channel: channelName,
  event,
  onMessage,
  enabled = true,
}: {
  channel: string;
  event: string;
  onMessage: (payload: T) => void;
  enabled?: boolean;
}) {
  useEffect(() => {
    if (!enabled) return;

    const supabase = createClient();
    const channel = supabase
      .channel(channelName)
      .on("broadcast", { event }, (payload) => {
        onMessage(payload.payload as T);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [channelName, event, enabled]);
}
