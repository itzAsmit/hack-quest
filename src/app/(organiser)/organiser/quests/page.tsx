"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import {
  Target, Plus, Trash2, Edit, Loader2, Save, X, Trophy, Zap
} from "lucide-react";
import { GlassPanel } from "@/components/shared/GlassPanel";
import { NeonBadge } from "@/components/shared/NeonBadge";
import { useToast } from "@/components/shared/Toast";

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
  events?: { name: string };
}

interface Event {
  id: string;
  name: string;
}

export default function OrganiserQuestsPage() {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    event_id: "",
    title: "",
    description: "",
    xp_reward: 100,
    quest_type: "manual",
    required_value: 1,
    order_index: 0,
  });
  const supabase = createClient();
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      const { data: questData } = await supabase
        .from("quests")
        .select("*, events(name)")
        .order("created_at", { ascending: false });
      if (questData) setQuests(questData as unknown as Quest[]);

      const { data: eventData } = await supabase
        .from("events")
        .select("id, name")
        .order("name");
      if (eventData) setEvents(eventData);

      setLoading(false);
    };
    fetchData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch("/api/quests/manage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create", ...form }),
      });

      if (res.ok) {
        toast("Quest created successfully!", "success");
        setShowForm(false);
        setForm({ event_id: "", title: "", description: "", xp_reward: 100, quest_type: "manual", required_value: 1, order_index: 0 });
        // Refresh
        const { data } = await supabase.from("quests").select("*, events(name)").order("created_at", { ascending: false });
        if (data) setQuests(data as unknown as Quest[]);
      } else {
        const data = await res.json();
        toast(data.error || "Failed to create quest", "error");
      }
    } catch {
      toast("Failed to create quest", "error");
    }
    setSaving(false);
  };

  const handleDelete = async (questId: string) => {
    try {
      const res = await fetch("/api/quests/manage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", quest_id: questId }),
      });
      if (res.ok) {
        setQuests((prev) => prev.filter((q) => q.id !== questId));
        toast("Quest deleted", "info");
      }
    } catch {
      toast("Failed to delete quest", "error");
    }
  };

  const inputClass = "w-full px-4 py-2.5 rounded-lg bg-hq-bg-tertiary border border-white/[0.08] text-hq-text-primary placeholder:text-hq-text-muted text-sm focus:outline-none focus:border-hq-accent-purple/50 transition-all";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-bold text-2xl text-hq-text-primary flex items-center gap-2">
            <Target className="w-6 h-6 text-hq-accent-glow" />
            Quests
          </h1>
          <p className="text-sm text-hq-text-muted mt-1">Create and manage event quests</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2">
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? "Cancel" : "New Quest"}
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <GlassPanel className="p-6">
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-hq-text-secondary mb-1.5">Event</label>
                  <select
                    value={form.event_id}
                    onChange={(e) => setForm({ ...form, event_id: e.target.value })}
                    className={inputClass}
                    required
                  >
                    <option value="">Select event</option>
                    {events.map((ev) => (
                      <option key={ev.id} value={ev.id}>{ev.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-hq-text-secondary mb-1.5">Quest Title</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className={inputClass}
                    placeholder="e.g. Submit your project"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-hq-text-secondary mb-1.5">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className={`${inputClass} h-20 resize-none`}
                  placeholder="Describe what the user needs to do..."
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-medium text-hq-text-secondary mb-1.5">XP Reward</label>
                  <input
                    type="number"
                    min="1"
                    value={form.xp_reward}
                    onChange={(e) => setForm({ ...form, xp_reward: parseInt(e.target.value) || 0 })}
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-hq-text-secondary mb-1.5">Type</label>
                  <select
                    value={form.quest_type}
                    onChange={(e) => setForm({ ...form, quest_type: e.target.value })}
                    className={inputClass}
                  >
                    <option value="manual">Manual</option>
                    <option value="submission">Submission</option>
                    <option value="attendance">Attendance</option>
                    <option value="code_push">Code Push</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-hq-text-secondary mb-1.5">Required Value</label>
                  <input
                    type="number"
                    min="1"
                    value={form.required_value}
                    onChange={(e) => setForm({ ...form, required_value: parseInt(e.target.value) || 1 })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-hq-text-secondary mb-1.5">Order</label>
                  <input
                    type="number"
                    min="0"
                    value={form.order_index}
                    onChange={(e) => setForm({ ...form, order_index: parseInt(e.target.value) || 0 })}
                    className={inputClass}
                  />
                </div>
              </div>

              <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {saving ? "Creating..." : "Create Quest"}
              </button>
            </form>
          </GlassPanel>
        </motion.div>
      )}

      {/* Quest list */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-white/[0.03] rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : quests.length === 0 ? (
        <GlassPanel className="p-12 text-center">
          <Target className="w-10 h-10 mx-auto mb-2 text-hq-text-muted opacity-50" />
          <p className="text-hq-text-muted">No quests created yet.</p>
        </GlassPanel>
      ) : (
        <div className="space-y-2">
          {quests.map((quest, i) => (
            <motion.div
              key={quest.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <GlassPanel className="p-4 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-hq-text-primary truncate">{quest.title}</h3>
                    <NeonBadge variant="slate" size="sm">{quest.quest_type}</NeonBadge>
                    {!quest.is_active && <NeonBadge variant="danger" size="sm">Inactive</NeonBadge>}
                  </div>
                  <p className="text-xs text-hq-text-muted truncate">
                    {quest.events?.name || "Unknown event"} · Requires: {quest.required_value}
                  </p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Zap className="w-3.5 h-3.5 text-hq-gold" />
                  <span className="text-sm font-semibold gradient-text-gold">{quest.xp_reward}</span>
                </div>
                <button
                  onClick={() => handleDelete(quest.id)}
                  className="p-2 rounded-lg hover:bg-hq-danger/10 text-hq-text-muted hover:text-hq-danger transition-colors flex-shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </GlassPanel>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
