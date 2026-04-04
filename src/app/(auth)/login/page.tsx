"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff, LogIn, ArrowLeft, Loader2 } from "lucide-react";
import { GlassPanel } from "@/components/shared/GlassPanel";

const UNIVERSAL_PLAYER_EMAIL = "player@gmail.com";
const UNIVERSAL_PLAYER_PASSWORD = "1234";

export default function LoginPage() {
  const [identifier, setIdentifier] = useState(UNIVERSAL_PLAYER_EMAIL);
  const [password, setPassword] = useState(UNIVERSAL_PLAYER_PASSWORD);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: UNIVERSAL_PLAYER_EMAIL,
        password: UNIVERSAL_PLAYER_PASSWORD,
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("An unexpected error occurred.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-hq-bg-primary flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-hq-accent-purple/6 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] bg-hq-accent-violet/4 rounded-full blur-[100px]" />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Back to home */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-hq-text-muted hover:text-hq-text-primary transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <GlassPanel className="p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 bg-gradient-to-br from-hq-accent-purple to-hq-accent-violet rounded-xl transform rotate-45" />
                <div className="absolute inset-[3px] bg-hq-bg-primary rounded-[9px] transform rotate-45" />
                <span className="absolute inset-0 flex items-center justify-center text-hq-accent-glow font-heading font-bold text-lg">
                  H
                </span>
              </div>
              <span className="font-heading font-bold text-2xl tracking-tight">
                <span className="text-hq-text-primary">HACK</span>
                <span className="gradient-text">QUEST</span>
              </span>
            </Link>
            <h1 className="font-heading font-semibold text-xl text-hq-text-primary">
              Welcome Back, Player
            </h1>
            <p className="text-sm text-hq-text-muted mt-1">
              Sign in to continue your journey
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Identifier */}
            <div>
              <label className="block text-sm font-medium text-hq-text-secondary mb-1.5">
                Universal Player Email
              </label>
              <input
                type="email"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                readOnly
                placeholder="player@gmail.com"
                className="w-full px-4 py-3 rounded-lg bg-hq-bg-tertiary border border-white/[0.08] text-hq-text-primary placeholder:text-hq-text-muted text-sm focus:outline-none focus:border-hq-accent-purple/50 focus:ring-1 focus:ring-hq-accent-purple/30 transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-hq-text-secondary mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  readOnly
                  placeholder="1234"
                  className="w-full px-4 py-3 pr-10 rounded-lg bg-hq-bg-tertiary border border-white/[0.08] text-hq-text-primary placeholder:text-hq-text-muted text-sm focus:outline-none focus:border-hq-accent-purple/50 focus:ring-1 focus:ring-hq-accent-purple/30 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-hq-text-muted hover:text-hq-text-secondary transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-hq-danger bg-hq-danger/10 rounded-lg px-3 py-2 border border-hq-danger/20"
              >
                {error}
              </motion.p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <LogIn className="w-4 h-4" />
              )}
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Register link */}
          <p className="text-center text-sm text-hq-text-muted mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-hq-accent-violet hover:text-hq-accent-glow transition-colors font-medium">
              Register here
            </Link>
          </p>
        </GlassPanel>
      </motion.div>
    </div>
  );
}
