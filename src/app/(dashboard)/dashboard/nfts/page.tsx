"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Image as ImageIcon, ExternalLink, Gavel, ArrowRightLeft, Package } from "lucide-react";
import { GlassPanel } from "@/components/shared/GlassPanel";
import { NeonBadge } from "@/components/shared/NeonBadge";

interface OwnedNFT {
  id: string;
  acquired_via: string;
  acquired_at: string;
  on_chain_tx: string | null;
  is_listed: boolean;
  nft_definitions: {
    name: string;
    image_url: string;
    nft_type: string;
    rarity_color: string;
    description: string | null;
  };
}

const rarityBorder: Record<string, string> = {
  common: "border-hq-rarity-common/50",
  rare: "border-hq-rarity-rare/50",
  epic: "border-hq-rarity-epic/50",
  legendary: "border-hq-rarity-legendary/50",
  mythic: "border-hq-rarity-mythic/50",
};

export default function NFTsPage() {
  const [nfts, setNfts] = useState<OwnedNFT[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<OwnedNFT | null>(null);
  const supabase = createClient();
  const peraExplorerBase = (process.env.NEXT_PUBLIC_PERA_EXPLORER_BASE || "https://testnet.explorer.perawallet.app")
    .trim()
    .replace(/\/+$/, "");

  useEffect(() => {
    const fetchNFTs = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("nft_ownership")
        .select("id, acquired_via, acquired_at, on_chain_tx, is_listed, nft_definitions(name, image_url, nft_type, rarity_color, description)")
        .eq("owner_id", user.id)
        .order("acquired_at", { ascending: false });

      if (data) setNfts(data as unknown as OwnedNFT[]);
      setLoading(false);
    };
    fetchNFTs();
  }, []);

  // Count packs by rarity
  const rarityCounts: Record<string, number> = {};
  nfts.forEach((nft) => {
    if (nft.nft_definitions.nft_type === "basic") {
      const r = nft.nft_definitions.rarity_color;
      rarityCounts[r] = (rarityCounts[r] || 0) + 1;
    }
  });

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-heading font-bold text-2xl text-hq-text-primary">My NFTs</h1>
        <p className="text-sm text-hq-text-muted mt-1">
          Your collection of blockchain-backed NFTs
        </p>
      </motion.div>

      {/* Pack eligibility */}
      {Object.entries(rarityCounts).filter(([, c]) => c >= 1).length > 0 && (
        <GlassPanel className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Package className="w-4 h-4 text-hq-accent-glow" />
            <span className="text-sm font-medium text-hq-text-primary">Pack Progress</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {Object.entries(rarityCounts).map(([rarity, count]) => (
              <NeonBadge
                key={rarity}
                variant={count >= 3 ? "success" : "slate"}
                size="md"
              >
                {rarity}: {count}/3 {count >= 3 && "✨ Pack Ready!"}
              </NeonBadge>
            ))}
          </div>
        </GlassPanel>
      )}

      <div className="flex gap-6">
        {/* NFT Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-52 bg-white/[0.03] rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : nfts.length === 0 ? (
            <GlassPanel className="p-12 text-center">
              <ImageIcon className="w-12 h-12 mx-auto mb-3 text-hq-text-muted opacity-50" />
              <p className="text-hq-text-muted">No NFTs yet. Earn XP and claim them from the Showplace!</p>
            </GlassPanel>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {nfts.map((nft, i) => (
                <motion.div
                  key={nft.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => setSelected(nft)}
                  className={`glass-panel-hover overflow-hidden border-2 cursor-pointer transition-all ${
                    rarityBorder[nft.nft_definitions.rarity_color] || "border-white/10"
                  } ${selected?.id === nft.id ? "ring-2 ring-hq-accent-purple" : ""}`}
                >
                  <div className="h-32 bg-hq-bg-tertiary overflow-hidden">
                    <img src={nft.nft_definitions.image_url} alt={nft.nft_definitions.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-3">
                    <h3 className="text-xs font-semibold text-hq-text-primary truncate">{nft.nft_definitions.name}</h3>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <NeonBadge variant={nft.nft_definitions.nft_type === "premium" ? "gold" : "purple"} size="sm">
                        {nft.nft_definitions.nft_type}
                      </NeonBadge>
                      {nft.is_listed && <NeonBadge variant="success" size="sm">Listed</NeonBadge>}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Detail Side Panel */}
        {selected && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-72 flex-shrink-0 hidden lg:block"
          >
            <GlassPanel className="p-5 sticky top-24">
              <div className="h-40 rounded-xl overflow-hidden bg-hq-bg-tertiary mb-4">
                <img src={selected.nft_definitions.image_url} alt="" className="w-full h-full object-cover" />
              </div>
              <h3 className="font-heading font-semibold text-lg text-hq-text-primary">{selected.nft_definitions.name}</h3>
              {selected.nft_definitions.description && (
                <p className="text-xs text-hq-text-muted mt-1">{selected.nft_definitions.description}</p>
              )}
              <div className="flex items-center gap-2 mt-3">
                <NeonBadge variant={selected.nft_definitions.nft_type === "premium" ? "gold" : "purple"}>
                  {selected.nft_definitions.nft_type}
                </NeonBadge>
                <NeonBadge variant="slate">{selected.nft_definitions.rarity_color}</NeonBadge>
              </div>
              <p className="text-xs text-hq-text-muted mt-3">
                Acquired via: {selected.acquired_via} · {new Date(selected.acquired_at).toLocaleDateString()}
              </p>

              <div className="mt-4 space-y-2">
                <button className="btn-outline w-full text-xs py-2 flex items-center justify-center gap-1.5">
                  <ArrowRightLeft className="w-3.5 h-3.5" /> Trade
                </button>
                <button className="btn-outline w-full text-xs py-2 flex items-center justify-center gap-1.5">
                  <Gavel className="w-3.5 h-3.5" /> List on Auction
                </button>
                {selected.on_chain_tx && (
                  <a
                    href={`${peraExplorerBase}/tx/${encodeURIComponent(selected.on_chain_tx.trim())}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline w-full text-xs py-2 flex items-center justify-center gap-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> View on Algorand
                  </a>
                )}
              </div>

              <button
                onClick={() => setSelected(null)}
                className="w-full mt-3 text-xs text-hq-text-muted hover:text-hq-text-primary text-center py-1"
              >
                Close
              </button>
            </GlassPanel>
          </motion.div>
        )}
      </div>
    </div>
  );
}
