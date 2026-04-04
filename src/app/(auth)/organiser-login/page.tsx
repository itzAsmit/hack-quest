"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff, Shield, ArrowLeft, Loader2 } from "lucide-react";
import { GlassPanel } from "@/components/shared/GlassPanel";

const UNIVERSAL_ORGANISER_EMAIL = "organiser@gmail.com";
const UNIVERSAL_ORGANISER_PASSWORD = "12345";

export default function OrganiserLoginPage() {
  const [email, setEmail] = useState(UNIVERSAL_ORGANISER_EMAIL);
  const [password, setPassword] = useState(UNIVERSAL_ORGANISER_PASSWORD);
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
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: UNIVERSAL_ORGANISER_EMAIL,
        password: UNIVERSAL_ORGANISER_PASSWORD,
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      // Verify organiser role using the user from the sign-in response
      const user = authData?.user;
      if (user) {
        const { data: orgData } = await supabase
          .from("organisers")
          .select("id")
          .eq("id", user.id)
          .single();

        if (!orgData) {
          await supabase.auth.signOut();
          setError("This account does not have organiser privileges.");
          setLoading(false);
          return;
        }
      } else {
        setError("Login failed. Please try again.");
        setLoading(false);
        return;
      }

      router.push("/organiser");
      router.refresh();
    } catch {
      setError("An unexpected error occurred.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-hq-bg-primary flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-hq-gold/4 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-hq-accent-purple/5 rounded-full blur-[100px]" />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md relative z-10"
      >
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-hq-text-muted hover:text-hq-text-primary transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <GlassPanel className="p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-hq-gold/10 border border-hq-gold/20 mb-4">
              <Shield className="w-7 h-7 text-hq-gold" />
            </div>
            <h1 className="font-heading font-semibold text-xl text-hq-text-primary">
              Organiser Login
            </h1>
            <p className="text-sm text-hq-text-muted mt-1">
              Access the organiser dashboard
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-hq-text-secondary mb-1.5">
                Universal Organiser Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                readOnly
                placeholder="organiser@gmail.com"
                className="w-full px-4 py-3 rounded-lg bg-hq-bg-tertiary border border-white/[0.08] text-hq-text-primary placeholder:text-hq-text-muted text-sm focus:outline-none focus:border-hq-gold/50 focus:ring-1 focus:ring-hq-gold/30 transition-all"
              />
            </div>

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
                  placeholder="12345"
                  className="w-full px-4 py-3 pr-10 rounded-lg bg-hq-bg-tertiary border border-white/[0.08] text-hq-text-primary placeholder:text-hq-text-muted text-sm focus:outline-none focus:border-hq-gold/50 focus:ring-1 focus:ring-hq-gold/30 transition-all"
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

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-hq-danger bg-hq-danger/10 rounded-lg px-3 py-2 border border-hq-danger/20"
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 flex items-center justify-center gap-2 rounded-lg font-semibold text-sm text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: "linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)",
              }}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Shield className="w-4 h-4" />
              )}
              {loading ? "Signing in..." : "Sign In as Organiser"}
            </button>
          </form>

          <p className="text-center text-xs text-hq-text-muted mt-6">
            Organiser accounts are created by administrators.
            <br />
            Contact your admin if you need access.
          </p>
        </GlassPanel>
      </motion.div>
    </div>
  );
}
