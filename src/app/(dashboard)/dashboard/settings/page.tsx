"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Settings, Loader2, Save, Trash2, Wallet } from "lucide-react";
import { GlassPanel } from "@/components/shared/GlassPanel";
import { WalletConnect } from "@/components/shared/WalletConnect";
import { useToast } from "@/components/shared/Toast";

export default function SettingsPage() {
  const [form, setForm] = useState({
    display_name: "",
    username: "",
    phone: "",
    college_name: "",
    linkedin_url: "",
    instagram_handle: "",
    twitter_handle: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const supabase = createClient();
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("users")
        .select("display_name, username, phone, college_name, linkedin_url, instagram_handle, twitter_handle")
        .eq("id", user.id)
        .single();

      if (data) {
        setForm({
          display_name: data.display_name || "",
          username: data.username || "",
          phone: data.phone || "",
          college_name: data.college_name || "",
          linkedin_url: data.linkedin_url || "",
          instagram_handle: data.instagram_handle || "",
          twitter_handle: data.twitter_handle || "",
        });
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("users").update({
      display_name: form.display_name,
      username: form.username,
      phone: form.phone || null,
      college_name: form.college_name || null,
      linkedin_url: form.linkedin_url || null,
      instagram_handle: form.instagram_handle || null,
      twitter_handle: form.twitter_handle || null,
    }).eq("id", user.id);

    setSaving(false);
    setSaved(true);
    toast("Profile updated successfully!", "success");
    setTimeout(() => setSaved(false), 2000);
  };

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-32 bg-white/[0.03] rounded animate-pulse" />
        <div className="h-96 bg-white/[0.03] rounded-2xl animate-pulse" />
      </div>
    );
  }

  const inputClass = "w-full px-4 py-2.5 rounded-lg bg-hq-bg-tertiary border border-white/[0.08] text-hq-text-primary placeholder:text-hq-text-muted text-sm focus:outline-none focus:border-hq-accent-purple/50 transition-all";

  return (
    <div className="space-y-6 max-w-2xl">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-heading font-bold text-2xl text-hq-text-primary">Settings</h1>
        <p className="text-sm text-hq-text-muted mt-1">Update your profile</p>
      </motion.div>

      <GlassPanel className="p-6">
        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-hq-text-secondary mb-1.5">Display Name</label>
              <input type="text" value={form.display_name} onChange={(e) => updateField("display_name", e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-medium text-hq-text-secondary mb-1.5">Username</label>
              <input type="text" value={form.username} onChange={(e) => updateField("username", e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))} className={inputClass} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-hq-text-secondary mb-1.5">Phone</label>
              <input type="tel" value={form.phone} onChange={(e) => updateField("phone", e.target.value)} placeholder="+91..." className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-medium text-hq-text-secondary mb-1.5">College</label>
              <input type="text" value={form.college_name} onChange={(e) => updateField("college_name", e.target.value)} className={inputClass} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-hq-text-secondary mb-1.5">LinkedIn URL</label>
            <input type="url" value={form.linkedin_url} onChange={(e) => updateField("linkedin_url", e.target.value)} className={inputClass} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-hq-text-secondary mb-1.5">Instagram</label>
              <input type="text" value={form.instagram_handle} onChange={(e) => updateField("instagram_handle", e.target.value)} placeholder="@handle" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-medium text-hq-text-secondary mb-1.5">Twitter / X</label>
              <input type="text" value={form.twitter_handle} onChange={(e) => updateField("twitter_handle", e.target.value)} placeholder="@handle" className={inputClass} />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2 disabled:opacity-50">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? "Saving..." : saved ? "Saved! ✓" : "Save Changes"}
            </button>
          </div>
        </form>
      </GlassPanel>

      {/* Blockchain Wallet */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h2 className="font-heading font-semibold text-lg text-hq-text-primary mb-3 flex items-center gap-2">
          <Wallet className="w-5 h-5 text-hq-accent-glow" />
          Blockchain Wallet
        </h2>
        <GlassPanel className="p-6">
          <p className="text-xs text-hq-text-muted mb-4">
            Connect your wallet to mint NFTs on-chain, view audit trails, and trade on the blockchain.
          </p>
          <WalletConnect />
        </GlassPanel>
      </motion.div>
    </div>
  );
}
