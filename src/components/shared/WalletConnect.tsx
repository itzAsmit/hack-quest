"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wallet, ExternalLink, Copy, Check, ChevronDown, Unplug } from "lucide-react";
import { GlassPanel } from "@/components/shared/GlassPanel";
import { NeonBadge } from "@/components/shared/NeonBadge";
import { useToast } from "@/components/shared/Toast";
import type { WalletState, SupportedChain } from "@/lib/blockchain/config";
import { truncateAddress, blockchainConfig } from "@/lib/blockchain/config";

export function WalletConnect() {
  const [wallet, setWallet] = useState<WalletState>({
    connected: false,
    chain: null,
    address: null,
    balance: 0,
  });
  const [connecting, setConnecting] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const connectWallet = async (chain: SupportedChain) => {
    setConnecting(true);
    setShowDropdown(false);

    try {
      if (chain === "solana") {
        // Check for Phantom wallet
        const phantom = (window as any).solana;
        if (phantom?.isPhantom) {
          const resp = await phantom.connect();
          setWallet({
            connected: true,
            chain: "solana",
            address: resp.publicKey.toString(),
            balance: 0,
          });
          toast("Phantom wallet connected!", "success");
        } else {
          // Simulate connection for development
          const mockAddr = `${Math.random().toString(36).slice(2, 8)}...${Math.random().toString(36).slice(2, 8)}`;
          setWallet({
            connected: true,
            chain: "solana",
            address: mockAddr,
            balance: 1.5,
          });
          toast("Solana wallet connected (devnet simulation)", "info");
        }
      } else if (chain === "algorand") {
        // Check for Pera wallet
        const mockAddr = `${Math.random().toString(36).slice(2, 8).toUpperCase()}...${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
        setWallet({
          connected: true,
          chain: "algorand",
          address: mockAddr,
          balance: 10.0,
        });
        toast("Algorand wallet connected (testnet simulation)", "info");
      }
    } catch {
      toast("Failed to connect wallet", "error");
    }

    setConnecting(false);
  };

  const disconnect = () => {
    if (wallet.chain === "solana") {
      const phantom = (window as any).solana;
      if (phantom?.isPhantom) {
        phantom.disconnect();
      }
    }
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
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          disabled={connecting}
          className="btn-outline flex items-center gap-2 text-sm !px-4 !py-2"
        >
          <Wallet className="w-4 h-4" />
          {connecting ? "Connecting..." : "Connect Wallet"}
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showDropdown ? "rotate-180" : ""}`} />
        </button>

        <AnimatePresence>
          {showDropdown && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 w-52 glass-panel p-1.5 border border-white/10 z-50"
            >
              <button
                onClick={() => connectWallet("solana")}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-hq-text-secondary hover:text-hq-text-primary hover:bg-white/[0.06] transition-all"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-[10px] font-bold text-white">
                  S
                </div>
                Phantom (Solana)
              </button>
              <button
                onClick={() => connectWallet("algorand")}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-hq-text-secondary hover:text-hq-text-primary hover:bg-white/[0.06] transition-all"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-[10px] font-bold text-white">
                  A
                </div>
                Pera (Algorand)
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <GlassPanel className="px-4 py-3 flex items-center gap-3">
      <div className={`w-2 h-2 rounded-full ${wallet.chain === "solana" ? "bg-purple-400" : "bg-yellow-400"} animate-pulse`} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <NeonBadge variant={wallet.chain === "solana" ? "purple" : "gold"} size="sm">
            {wallet.chain === "solana" ? "SOL" : "ALGO"}
          </NeonBadge>
          <span className="text-sm font-mono text-hq-text-secondary truncate">
            {wallet.address ? truncateAddress(wallet.address) : ""}
          </span>
        </div>
        <p className="text-[10px] text-hq-text-muted mt-0.5">
          {wallet.balance.toFixed(4)} {wallet.chain === "solana" ? "SOL" : "ALGO"}
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
          href={
            wallet.chain === "solana"
              ? `${blockchainConfig.solana.explorerUrl}/address/${wallet.address}?cluster=${blockchainConfig.solana.network}`
              : `${blockchainConfig.algorand.explorerUrl}/address/${wallet.address}`
          }
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
