"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Shield, Plus, Trash2, Loader2, Users } from "lucide-react";
import { GlassPanel } from "@/components/shared/GlassPanel";

interface Team {
  id: string;
  name: string;
  description: string | null;
  members?: number;
}

export default function OrganiserTeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const supabase = createClient();

  const fetchTeams = async () => {
    const { data } = await supabase.from("teams").select("*").order("name");
    if (data) {
      // Count members per team
      const enriched = await Promise.all(
        data.map(async (team) => {
          const { count } = await supabase
            .from("users")
            .select("id", { count: "exact", head: true })
            .eq("team_id", team.id);
          return { ...team, members: count || 0 };
        })
      );
      setTeams(enriched);
    }
    setLoading(false);
  };

  useEffect(() => { fetchTeams(); }, []);

  const handleCreate = async () => {
    if (!newName.trim()) return;
    setSaving(true);
    await supabase.from("teams").insert({ name: newName, description: newDescription || null });
    setNewName("");
    setNewDescription("");
    setShowForm(false);
    setSaving(false);
    fetchTeams();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this team?")) return;
    await supabase.from("teams").delete().eq("id", id);
    fetchTeams();
  };

  const inputClass = "w-full px-3 py-2.5 rounded-lg bg-hq-bg-tertiary border border-white/[0.08] text-hq-text-primary placeholder:text-hq-text-muted text-sm focus:outline-none focus:border-hq-accent-purple/50 transition-all";

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-bold text-2xl text-hq-text-primary">Teams</h1>
          <p className="text-sm text-hq-text-muted mt-1">Manage platform teams</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" /> New Team
        </button>
      </motion.div>

      {showForm && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <GlassPanel className="p-5">
            <div className="grid gap-3">
              <input value={newName} onChange={(e) => setNewName(e.target.value)} className={inputClass} placeholder="Team name" />
              <input value={newDescription} onChange={(e) => setNewDescription(e.target.value)} className={inputClass} placeholder="Description (optional)" />
              <div className="flex gap-3">
                <button onClick={handleCreate} disabled={saving || !newName} className="btn-primary text-sm flex items-center gap-1.5 disabled:opacity-50">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null} Create
                </button>
                <button onClick={() => setShowForm(false)} className="btn-outline text-sm">Cancel</button>
              </div>
            </div>
          </GlassPanel>
        </motion.div>
      )}

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-16 bg-white/[0.03] rounded-xl animate-pulse" />)}
        </div>
      ) : teams.length === 0 ? (
        <GlassPanel className="p-12 text-center">
          <Shield className="w-10 h-10 mx-auto mb-2 text-hq-text-muted opacity-50" />
          <p className="text-hq-text-muted">No teams yet. Create your first team!</p>
        </GlassPanel>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teams.map((team) => (
            <GlassPanel key={team.id} hover className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-heading font-semibold text-hq-text-primary">{team.name}</h3>
                  {team.description && (
                    <p className="text-xs text-hq-text-muted mt-1">{team.description}</p>
                  )}
                  <div className="flex items-center gap-1 mt-3 text-xs text-hq-text-secondary">
                    <Users className="w-3.5 h-3.5" />
                    {team.members} member{team.members !== 1 ? "s" : ""}
                  </div>
                </div>
                <button onClick={() => handleDelete(team.id)} className="p-1.5 rounded-lg hover:bg-hq-danger/10 text-hq-text-muted hover:text-hq-danger transition-colors">
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
