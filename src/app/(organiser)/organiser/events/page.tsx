"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Calendar, Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { GlassPanel } from "@/components/shared/GlassPanel";
import { NeonBadge } from "@/components/shared/NeonBadge";

interface Event {
  id: string;
  name: string;
  status: string;
  start_date: string;
  end_date: string;
  max_participants: number | null;
}

export default function OrganiserEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "", description: "", status: "upcoming", start_date: "", end_date: "",
    max_participants: "", tags: "", prize_info: "", is_team_event: false,
  });
  const supabase = createClient();

  const fetchEvents = async () => {
    const { data } = await supabase.from("events").select("*").order("created_at", { ascending: false });
    if (data) setEvents(data);
    setLoading(false);
  };

  useEffect(() => { fetchEvents(); }, []);

  const resetForm = () => {
    setForm({ name: "", description: "", status: "upcoming", start_date: "", end_date: "", max_participants: "", tags: "", prize_info: "", is_team_event: false });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (event: Event) => {
    setForm({
      name: event.name,
      description: "",
      status: event.status,
      start_date: event.start_date?.split("T")[0] || "",
      end_date: event.end_date?.split("T")[0] || "",
      max_participants: event.max_participants?.toString() || "",
      tags: "", prize_info: "", is_team_event: false,
    });
    setEditingId(event.id);
    setShowForm(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      name: form.name,
      description: form.description || null,
      status: form.status,
      start_date: form.start_date,
      end_date: form.end_date,
      max_participants: form.max_participants ? parseInt(form.max_participants) : null,
      tags: form.tags ? form.tags.split(",").map(t => t.trim()) : [],
      prize_info: form.prize_info || null,
      is_team_event: form.is_team_event,
    };

    if (editingId) {
      await supabase.from("events").update(payload).eq("id", editingId);
    } else {
      await supabase.from("events").insert(payload);
    }

    resetForm();
    setSaving(false);
    fetchEvents();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this event?")) return;
    await supabase.from("events").delete().eq("id", id);
    fetchEvents();
  };

  const inputClass = "w-full px-3 py-2.5 rounded-lg bg-hq-bg-tertiary border border-white/[0.08] text-hq-text-primary placeholder:text-hq-text-muted text-sm focus:outline-none focus:border-hq-accent-purple/50 transition-all";

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-bold text-2xl text-hq-text-primary">Manage Events</h1>
          <p className="text-sm text-hq-text-muted mt-1">Create and manage hackathon events</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="btn-primary flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" /> New Event
        </button>
      </motion.div>

      {/* Create/Edit Form */}
      {showForm && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
          <GlassPanel className="p-6">
            <h2 className="font-heading font-semibold text-lg text-hq-text-primary mb-4">
              {editingId ? "Edit Event" : "New Event"}
            </h2>
            <div className="grid gap-4">
              <div>
                <label className="block text-xs font-medium text-hq-text-secondary mb-1">Name *</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} placeholder="Event name" />
              </div>
              <div>
                <label className="block text-xs font-medium text-hq-text-secondary mb-1">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className={inputClass} placeholder="About this event..." />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-hq-text-secondary mb-1">Status</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={inputClass}>
                    <option value="upcoming">Upcoming</option>
                    <option value="running">Running</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-hq-text-secondary mb-1">Start Date</label>
                  <input type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-hq-text-secondary mb-1">End Date</label>
                  <input type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} className={inputClass} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-hq-text-secondary mb-1">Max Participants</label>
                  <input type="number" value={form.max_participants} onChange={(e) => setForm({ ...form, max_participants: e.target.value })} className={inputClass} placeholder="Unlimited" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-hq-text-secondary mb-1">Tags (comma separated)</label>
                  <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className={inputClass} placeholder="web3, ai, ..." />
                </div>
                <div>
                  <label className="block text-xs font-medium text-hq-text-secondary mb-1">Prize Info</label>
                  <input value={form.prize_info} onChange={(e) => setForm({ ...form, prize_info: e.target.value })} className={inputClass} placeholder="$5000" />
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm text-hq-text-secondary cursor-pointer">
                <input type="checkbox" checked={form.is_team_event} onChange={(e) => setForm({ ...form, is_team_event: e.target.checked })} className="accent-hq-accent-purple" />
                Team Event
              </label>
              <div className="flex items-center gap-3">
                <button onClick={handleSave} disabled={saving || !form.name} className="btn-primary text-sm flex items-center gap-2 disabled:opacity-50">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {editingId ? "Update Event" : "Create Event"}
                </button>
                <button onClick={resetForm} className="btn-outline text-sm">Cancel</button>
              </div>
            </div>
          </GlassPanel>
        </motion.div>
      )}

      {/* Event List */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 bg-white/[0.03] rounded-xl animate-pulse" />
          ))}
        </div>
      ) : events.length === 0 ? (
        <GlassPanel className="p-12 text-center">
          <Calendar className="w-10 h-10 mx-auto mb-2 text-hq-text-muted opacity-50" />
          <p className="text-hq-text-muted">No events yet. Create your first event!</p>
        </GlassPanel>
      ) : (
        <div className="space-y-2">
          {events.map((event) => (
            <GlassPanel key={event.id} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <NeonBadge variant={event.status === "running" ? "success" : event.status === "upcoming" ? "purple" : "slate"} size="sm">
                  {event.status}
                </NeonBadge>
                <div>
                  <h3 className="text-sm font-semibold text-hq-text-primary">{event.name}</h3>
                  <p className="text-xs text-hq-text-muted">
                    {new Date(event.start_date).toLocaleDateString()} — {new Date(event.end_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => handleEdit(event)} className="p-2 rounded-lg hover:bg-white/[0.06] text-hq-text-muted hover:text-hq-text-primary transition-colors">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(event.id)} className="p-2 rounded-lg hover:bg-hq-danger/10 text-hq-text-muted hover:text-hq-danger transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </GlassPanel>
          ))}
        </div>
      )}
    </div>
  );
}
