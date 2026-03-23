"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Image as ImageIcon, Plus, Trash2, Loader2 } from "lucide-react";
import { GlassPanel } from "@/components/shared/GlassPanel";
import { NeonBadge } from "@/components/shared/NeonBadge";

interface NFTDef {
  id: string;
  name: string;
  image_url: string;
  nft_type: string;
  rarity_color: string;
  xp_cost: number | null;
  total_supply: number;
  minted_count: number;
}

export default function OrganiserNFTsPage() {
  const [nfts, setNfts] = useState<NFTDef[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "", description: "", image_url: "", nft_type: "basic",
    rarity_color: "common", xp_cost: "", total_supply: "1",
  });
  const supabase = createClient();

  const fetchNFTs = async () => {
    const { data } = await supabase.from("nft_definitions").select("*").order("created_at", { ascending: false });
    if (data) setNfts(data);
    setLoading(false);
  };

  useEffect(() => { fetchNFTs(); }, []);

  const handleSave = async () => {
    setSaving(true);
    await supabase.from("nft_definitions").insert({
      name: form.name,
      description: form.description || null,
      image_url: form.image_url,
      nft_type: form.nft_type,
      rarity_color: form.rarity_color,
      xp_cost: form.xp_cost ? parseInt(form.xp_cost) : null,
      total_supply: parseInt(form.total_supply) || 1,
    });
    setForm({ name: "", description: "", image_url: "", nft_type: "basic", rarity_color: "common", xp_cost: "", total_supply: "1" });
    setShowForm(false);
    setSaving(false);
    fetchNFTs();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this NFT definition?")) return;
    await supabase.from("nft_definitions").delete().eq("id", id);
    fetchNFTs();
  };

  const inputClass = "w-full px-3 py-2.5 rounded-lg bg-hq-bg-tertiary border border-white/[0.08] text-hq-text-primary placeholder:text-hq-text-muted text-sm focus:outline-none focus:border-hq-accent-purple/50 transition-all";

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-bold text-2xl text-hq-text-primary">Manage NFTs</h1>
          <p className="text-sm text-hq-text-muted mt-1">Create NFT definitions for the platform</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" /> New NFT
        </button>
      </motion.div>

      {showForm && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
          <GlassPanel className="p-6">
            <h2 className="font-heading font-semibold text-lg text-hq-text-primary mb-4">New NFT Definition</h2>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-hq-text-secondary mb-1">Name *</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} placeholder="NFT name" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-hq-text-secondary mb-1">Image URL *</label>
                  <input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className={inputClass} placeholder="https://..." />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-hq-text-secondary mb-1">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className={inputClass} />
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-medium text-hq-text-secondary mb-1">Type</label>
                  <select value={form.nft_type} onChange={(e) => setForm({ ...form, nft_type: e.target.value })} className={inputClass}>
                    <option value="basic">Basic</option>
                    <option value="premium">Premium</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-hq-text-secondary mb-1">Rarity</label>
                  <select value={form.rarity_color} onChange={(e) => setForm({ ...form, rarity_color: e.target.value })} className={inputClass}>
                    <option value="common">Common</option>
                    <option value="rare">Rare</option>
                    <option value="epic">Epic</option>
                    <option value="legendary">Legendary</option>
                    <option value="mythic">Mythic</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-hq-text-secondary mb-1">XP Cost (basic)</label>
                  <input type="number" value={form.xp_cost} onChange={(e) => setForm({ ...form, xp_cost: e.target.value })} className={inputClass} placeholder="500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-hq-text-secondary mb-1">Total Supply</label>
                  <input type="number" value={form.total_supply} onChange={(e) => setForm({ ...form, total_supply: e.target.value })} className={inputClass} />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={handleSave} disabled={saving || !form.name || !form.image_url} className="btn-primary text-sm flex items-center gap-2 disabled:opacity-50">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null} Create NFT
                </button>
                <button onClick={() => setShowForm(false)} className="btn-outline text-sm">Cancel</button>
              </div>
            </div>
          </GlassPanel>
        </motion.div>
      )}

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-48 bg-white/[0.03] rounded-2xl animate-pulse" />)}
        </div>
      ) : nfts.length === 0 ? (
        <GlassPanel className="p-12 text-center">
          <ImageIcon className="w-10 h-10 mx-auto mb-2 text-hq-text-muted opacity-50" />
          <p className="text-hq-text-muted">No NFTs defined yet.</p>
        </GlassPanel>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {nfts.map((nft) => (
            <GlassPanel key={nft.id} className="overflow-hidden">
              <div className="h-32 bg-hq-bg-tertiary overflow-hidden">
                <img src={nft.image_url} alt={nft.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-3">
                <h3 className="text-sm font-semibold text-hq-text-primary truncate">{nft.name}</h3>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <NeonBadge variant={nft.nft_type === "premium" ? "gold" : "purple"} size="sm">{nft.nft_type}</NeonBadge>
                  <NeonBadge variant="slate" size="sm">{nft.rarity_color}</NeonBadge>
                </div>
                <div className="flex items-center justify-between mt-2 text-xs text-hq-text-muted">
                  <span>{nft.minted_count}/{nft.total_supply} minted</span>
                  <button onClick={() => handleDelete(nft.id)} className="p-1 hover:text-hq-danger transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </GlassPanel>
          ))}
        </div>
      )}
    </div>
  );
}
