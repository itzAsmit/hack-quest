"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Image as ImageIcon, Plus, Trash2, Loader2 } from "lucide-react";
import { GlassPanel } from "@/components/shared/GlassPanel";
import { NeonBadge } from "@/components/shared/NeonBadge";

type AspectRatio = "1:1" | "16:9" | "9:16" | "4:5" | "5:4" | "3:2" | "2:3" | "21:9" | "9:21";
type StylePreset =
  | ""
  | "3d-model"
  | "analog-film"
  | "anime"
  | "cinematic"
  | "comic-book"
  | "digital-art"
  | "enhance"
  | "fantasy-art"
  | "isometric"
  | "line-art"
  | "low-poly"
  | "modeling-compound"
  | "neon-punk"
  | "origami"
  | "photographic"
  | "pixel-art"
  | "tile-texture";

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
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "", description: "", image_url: "", nft_type: "basic",
    rarity_color: "common", xp_cost: "", total_supply: "1",
    prompt: "",
    negative_prompt: "",
    aspect_ratio: "1:1" as AspectRatio,
    style_preset: "" as StylePreset,
    output_format: "png" as "png" | "jpeg" | "webp",
  });
  const supabase = createClient();

  const fetchNFTs = async () => {
    const { data } = await supabase.from("nft_definitions").select("*").order("created_at", { ascending: false });
    if (data) setNfts(data);
    setLoading(false);
  };

  useEffect(() => { fetchNFTs(); }, []);

  const handleSave = async () => {
    setError("");
    setSaving(true);
    try {
      const res = await fetch("/api/nft/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          description: form.description || undefined,
          image_url: form.image_url || undefined,
          nft_type: form.nft_type,
          rarity_color: form.rarity_color,
          xp_cost: form.xp_cost ? parseInt(form.xp_cost, 10) : null,
          total_supply: parseInt(form.total_supply, 10) || 1,
          prompt: form.prompt || undefined,
          negative_prompt: form.negative_prompt || undefined,
          aspect_ratio: form.aspect_ratio,
          style_preset: form.style_preset || undefined,
          output_format: form.output_format,
        }),
      });

      const result = (await res.json()) as { error?: string };

      if (!res.ok) {
        throw new Error(result.error || "Failed to create NFT");
      }

      setForm({
        name: "",
        description: "",
        image_url: "",
        nft_type: "basic",
        rarity_color: "common",
        xp_cost: "",
        total_supply: "1",
        prompt: "",
        negative_prompt: "",
        aspect_ratio: "1:1",
        style_preset: "",
        output_format: "png",
      });
      setShowForm(false);
      await fetchNFTs();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create NFT";
      setError(message);
    } finally {
      setSaving(false);
    }
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
              {error && (
                <div className="text-sm text-hq-danger bg-hq-danger/10 rounded-lg px-3 py-2 border border-hq-danger/20">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-hq-text-secondary mb-1">Name *</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} placeholder="NFT name" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-hq-text-secondary mb-1">Image URL (optional override)</label>
                  <input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className={inputClass} placeholder="https://..." />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-xs font-medium text-hq-text-secondary mb-1">AI Prompt *</label>
                  <textarea
                    value={form.prompt}
                    onChange={(e) => setForm({ ...form, prompt: e.target.value })}
                    rows={2}
                    className={inputClass}
                    placeholder="Ancient cyber relic, glowing runes, collectible game card art"
                  />
                  <p className="mt-1 text-[11px] text-hq-text-muted">Used only if Image URL is empty.</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-hq-text-secondary mb-1">Negative Prompt</label>
                  <input
                    value={form.negative_prompt}
                    onChange={(e) => setForm({ ...form, negative_prompt: e.target.value })}
                    className={inputClass}
                    placeholder="blurry, watermark, text artifacts"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-hq-text-secondary mb-1">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className={inputClass} />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-hq-text-secondary mb-1">Aspect Ratio</label>
                  <select value={form.aspect_ratio} onChange={(e) => setForm({ ...form, aspect_ratio: e.target.value as AspectRatio })} className={inputClass}>
                    <option value="1:1">1:1</option>
                    <option value="16:9">16:9</option>
                    <option value="9:16">9:16</option>
                    <option value="4:5">4:5</option>
                    <option value="5:4">5:4</option>
                    <option value="3:2">3:2</option>
                    <option value="2:3">2:3</option>
                    <option value="21:9">21:9</option>
                    <option value="9:21">9:21</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-hq-text-secondary mb-1">Style Preset</label>
                  <select value={form.style_preset} onChange={(e) => setForm({ ...form, style_preset: e.target.value as StylePreset })} className={inputClass}>
                    <option value="">None</option>
                    <option value="3d-model">3D Model</option>
                    <option value="analog-film">Analog Film</option>
                    <option value="anime">Anime</option>
                    <option value="cinematic">Cinematic</option>
                    <option value="comic-book">Comic Book</option>
                    <option value="digital-art">Digital Art</option>
                    <option value="enhance">Enhance</option>
                    <option value="fantasy-art">Fantasy Art</option>
                    <option value="isometric">Isometric</option>
                    <option value="line-art">Line Art</option>
                    <option value="low-poly">Low Poly</option>
                    <option value="modeling-compound">Modeling Compound</option>
                    <option value="neon-punk">Neon Punk</option>
                    <option value="origami">Origami</option>
                    <option value="photographic">Photographic</option>
                    <option value="pixel-art">Pixel Art</option>
                    <option value="tile-texture">Tile Texture</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-hq-text-secondary mb-1">Output Format</label>
                  <select value={form.output_format} onChange={(e) => setForm({ ...form, output_format: e.target.value as "png" | "jpeg" | "webp" })} className={inputClass}>
                    <option value="png">PNG</option>
                    <option value="jpeg">JPEG</option>
                    <option value="webp">WEBP</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleSave}
                  disabled={saving || !form.name || (!form.image_url && !form.prompt)}
                  className="btn-primary text-sm flex items-center gap-2 disabled:opacity-50"
                >
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
