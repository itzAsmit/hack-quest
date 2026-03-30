"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wallet, ExternalLink, Copy, Check, Unplug } from "lucide-react";
import { GlassPanel } from "@/components/shared/GlassPanel";
import { NeonBadge } from "@/components/shared/NeonBadge";
import { useToast } from "@/components/shared/Toast";
import type { WalletState } from "@/lib/blockchain/config";
import { truncateAddress, blockchainConfig } from "@/lib/blockchain/config";

export function WalletConnect() {
  const [wallet, setWallet] = useState<WalletState>({
    connected: false,
    chain: null,
    address: null,
    balance: 0,
  });
  const [connecting, setConnecting] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const connectWallet = async () => {
    setConnecting(true);

    try {
      // Simulated testnet wallet address (58-char Algorand-style base32).
      const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
      const mockAddr = Array.from({ length: 58 }, () => {
        const idx = Math.floor(Math.random() * alphabet.length);
        return alphabet[idx];
      }).join("");
      setWallet({
        connected: true,
        chain: "algorand",
        address: mockAddr,
        balance: 10.0,
      });
      toast("Algorand wallet connected (testnet simulation)", "info");
    } catch {
      toast("Failed to connect wallet", "error");
    }

    setConnecting(false);
  };

  const disconnect = () => {
    setWallet({ connected: false, chain: null, address: null, balance: 0 });
    toast("Wallet disconnected", "info");
  };

  const copyAddress = async () => {
    if (wallet.address) {
      await navigator.clipboard.writeText(wallet.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast("Address copied!", "success");
    }
  };

  if (!wallet.connected) {
    return (
      <button
        onClick={connectWallet}
        disabled={connecting}
        className="btn-outline flex items-center gap-2 text-sm !px-4 !py-2"
      >
        <Wallet className="w-4 h-4" />
        {connecting ? "Connecting..." : "Connect Wallet"}
        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-[8px] font-bold text-white ml-1">
          A
        </div>
      </button>
    );
  }

  return (
    <GlassPanel className="px-4 py-3 flex items-center gap-3">
      <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <NeonBadge variant="gold" size="sm">
            ALGO
          </NeonBadge>
          <span className="text-sm font-mono text-hq-text-secondary truncate">
            {wallet.address ? truncateAddress(wallet.address) : ""}
          </span>
        </div>
        <p className="text-[10px] text-hq-text-muted mt-0.5">
          {wallet.balance.toFixed(4)} ALGO
        </p>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={copyAddress}
          className="p-1.5 rounded-lg hover:bg-white/[0.06] text-hq-text-muted hover:text-hq-text-primary transition-colors"
          title="Copy address"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-hq-success" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
        <a
          href={`${blockchainConfig.algorand.explorerUrl}/address/${wallet.address}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1.5 rounded-lg hover:bg-white/[0.06] text-hq-text-muted hover:text-hq-text-primary transition-colors"
          title="View on explorer"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
        <button
          onClick={disconnect}
          className="p-1.5 rounded-lg hover:bg-hq-danger/10 text-hq-text-muted hover:text-hq-danger transition-colors"
          title="Disconnect"
        >
          <Unplug className="w-3.5 h-3.5" />
        </button>
      </div>
    </GlassPanel>
  );
}
