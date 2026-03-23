"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Wallet as WalletIcon, ArrowDownRight, ArrowUpRight, Plus, Minus, Loader2 } from "lucide-react";
import { GlassPanel } from "@/components/shared/GlassPanel";
import { AnimatedCounter } from "@/components/shared/AnimatedCounter";
import { NeonBadge } from "@/components/shared/NeonBadge";
import { formatNumber, getRelativeTime } from "@/lib/utils";

interface Transaction {
  id: string;
  tx_type: string;
  amount: number;
  currency: string | null;
  description: string | null;
  created_at: string;
}

export default function WalletPage() {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [amount, setAmount] = useState("");
  const [processing, setProcessing] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);

      const { data: userData } = await supabase
        .from("users")
        .select("hacks_balance")
        .eq("id", user.id)
        .single();

      if (userData) setBalance(userData.hacks_balance);

      const { data: txData } = await supabase
        .from("hacks_transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20);

      if (txData) setTransactions(txData);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleTransaction = async (type: "deposit" | "withdraw") => {
    if (!userId || !amount) return;
    const numAmount = parseInt(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;
    if (type === "withdraw" && numAmount > balance) return;

    setProcessing(true);

    try {
      const res = await fetch(`/api/wallet/${type}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: numAmount }),
      });

      const data = await res.json();
      if (res.ok) {
        setBalance(data.new_balance);
        setAmount("");
        setShowDeposit(false);
        setShowWithdraw(false);

        // Refresh transactions
        const { data: txData } = await supabase
          .from("hacks_transactions")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(20);
        if (txData) setTransactions(txData);
      } else {
        alert(data.error || "Transaction failed");
      }
    } catch (err) {
      console.error("Transaction failed:", err);
    }

    setProcessing(false);
  };

  const txTypeConfig: Record<string, { color: string; icon: React.ReactNode }> = {
    deposit: { color: "text-hq-success", icon: <ArrowDownRight className="w-4 h-4 text-hq-success" /> },
    withdraw: { color: "text-hq-danger", icon: <ArrowUpRight className="w-4 h-4 text-hq-danger" /> },
    nft_purchase: { color: "text-hq-danger", icon: <ArrowUpRight className="w-4 h-4 text-hq-danger" /> },
    nft_sale: { color: "text-hq-success", icon: <ArrowDownRight className="w-4 h-4 text-hq-success" /> },
    auction_bid: { color: "text-hq-danger", icon: <ArrowUpRight className="w-4 h-4 text-hq-accent-violet" /> },
    auction_refund: { color: "text-hq-success", icon: <ArrowDownRight className="w-4 h-4 text-hq-success" /> },
    trade: { color: "text-hq-text-secondary", icon: <ArrowDownRight className="w-4 h-4 text-hq-text-muted" /> },
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-heading font-bold text-2xl text-hq-text-primary">Wallet</h1>
        <p className="text-sm text-hq-text-muted mt-1">Manage your Hacks balance</p>
      </motion.div>

      {/* Balance Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <GlassPanel className="p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-hq-accent-purple/5 rounded-full blur-[60px]" />
          <div className="relative">
            <p className="text-xs font-medium text-hq-text-muted uppercase tracking-wider mb-1">Total Balance</p>
            <p className="font-heading font-bold text-4xl text-hq-text-primary">
              <AnimatedCounter value={balance} suffix=" ⚡" />
            </p>
            <div className="flex items-center gap-3 mt-5">
              <button
                onClick={() => { setShowDeposit(!showDeposit); setShowWithdraw(false); }}
                className="btn-primary text-sm py-2.5 px-5 flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Add Money
              </button>
              <button
                onClick={() => { setShowWithdraw(!showWithdraw); setShowDeposit(false); }}
                className="btn-outline text-sm py-2.5 px-5 flex items-center gap-1.5"
              >
                <Minus className="w-4 h-4" /> Withdraw
              </button>
            </div>
          </div>
        </GlassPanel>
      </motion.div>

      {/* Deposit/Withdraw Modal */}
      {(showDeposit || showWithdraw) && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
          <GlassPanel className="p-5">
            <h3 className="font-heading font-semibold text-hq-text-primary mb-3">
              {showDeposit ? "Add Money" : "Withdraw"}
            </h3>
            <div className="flex gap-3">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount in Hacks"
                min="1"
                className="flex-1 px-4 py-2.5 rounded-lg bg-hq-bg-tertiary border border-white/[0.08] text-hq-text-primary text-sm focus:outline-none focus:border-hq-accent-purple/50 transition-all"
              />
              <button
                onClick={() => handleTransaction(showDeposit ? "deposit" : "withdraw")}
                disabled={processing || !amount}
                className="btn-primary text-sm px-5 flex items-center gap-1.5 disabled:opacity-50"
              >
                {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Confirm
              </button>
            </div>
            {showWithdraw && parseInt(amount) > balance && (
              <p className="text-xs text-hq-danger mt-2">Insufficient balance</p>
            )}
          </GlassPanel>
        </motion.div>
      )}

      {/* Transactions */}
      <div>
        <h2 className="font-heading font-semibold text-lg text-hq-text-primary mb-3">Transaction History</h2>
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-14 bg-white/[0.03] rounded-xl animate-pulse" />
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <GlassPanel className="p-8 text-center">
            <WalletIcon className="w-10 h-10 mx-auto mb-2 text-hq-text-muted opacity-50" />
            <p className="text-sm text-hq-text-muted">No transactions yet.</p>
          </GlassPanel>
        ) : (
          <div className="space-y-2">
            {transactions.map((tx) => {
              const config = txTypeConfig[tx.tx_type] || txTypeConfig.trade;
              return (
                <GlassPanel key={tx.id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-white/[0.04] flex items-center justify-center">
                      {config.icon}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-hq-text-primary">
                        {tx.description || tx.tx_type.replace(/_/g, " ")}
                      </p>
                      <p className="text-[10px] text-hq-text-muted">{getRelativeTime(tx.created_at)}</p>
                    </div>
                  </div>
                  <span className={`font-heading font-semibold text-sm ${tx.amount >= 0 ? "text-hq-success" : "text-hq-danger"}`}>
                    {tx.amount >= 0 ? "+" : ""}{formatNumber(tx.amount)} ⚡
                  </span>
                </GlassPanel>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
