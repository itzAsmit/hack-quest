"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff, UserPlus, ArrowLeft, Loader2, Upload, X } from "lucide-react";
import { GlassPanel } from "@/components/shared/GlassPanel";

interface Team {
  id: string;
  name: string;
}

export default function RegisterPage() {
  const [form, setForm] = useState({
    display_name: "",
    username: "",
    email: "",
    password: "",
    phone: "",
    college_name: "",
    date_of_birth: "",
    linkedin_url: "",
    instagram_handle: "",
    twitter_handle: "",
    team_id: "",
    custom_team_name: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [teams, setTeams] = useState<Team[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  // Fetch teams
  useEffect(() => {
    const fetchTeams = async () => {
      const { data } = await supabase
        .from("teams")
        .select("id, name")
        .order("name");
      if (data) setTeams(data);
    };
    fetchTeams();
  }, []);

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1. Sign up with Supabase Auth (pass metadata so the trigger can use it)
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            username: form.username,
            display_name: form.display_name,
          },
        },
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      if (!authData.user) {
        setError("Registration failed. Please try again.");
        setLoading(false);
        return;
      }

      // 2. Upload avatar if provided
      let avatar_url: string | null = null;
      if (avatarFile) {
        const fileExt = avatarFile.name.split(".").pop();
        const filePath = `${authData.user.id}/avatar.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(filePath, avatarFile, { upsert: true });

        if (!uploadError) {
          const { data: urlData } = supabase.storage
            .from("avatars")
            .getPublicUrl(filePath);
          avatar_url = urlData.publicUrl;
        }
      }

      // 3. Update the user profile (trigger already created the row)
      const { error: profileError } = await supabase
        .from("users")
        .update({
          username: form.username,
          display_name: form.display_name,
          phone: form.phone || null,
          avatar_url,
          college_name: form.college_name || null,
          date_of_birth: form.date_of_birth || null,
          linkedin_url: form.linkedin_url || null,
          instagram_handle: form.instagram_handle || null,
          twitter_handle: form.twitter_handle || null,
          team_id: form.team_id && form.team_id !== "others" ? form.team_id : null,
          custom_team_name: form.team_id === "others" ? form.custom_team_name : null,
        })
        .eq("id", authData.user.id);

      if (profileError) {
        setError(profileError.message);
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
    <div className="min-h-screen bg-hq-bg-primary flex items-center justify-center p-4 py-12 relative overflow-hidden">
      {/* Background */}
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-hq-accent-purple/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] bg-hq-accent-violet/4 rounded-full blur-[100px]" />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-lg relative z-10"
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
              Create Your Account
            </h1>
            <p className="text-sm text-hq-text-muted mt-1">
              Join the quest. Your journey starts here.
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            {/* Avatar upload */}
            <div className="flex justify-center mb-4">
              <label className="relative group cursor-pointer">
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-dashed border-white/20 hover:border-hq-accent-purple/50 transition-colors flex items-center justify-center bg-hq-bg-tertiary">
                  {avatarPreview ? (
                    <>
                      <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setAvatarFile(null);
                          setAvatarPreview("");
                        }}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-hq-danger rounded-full flex items-center justify-center"
                      >
                        <X className="w-3 h-3 text-white" />
                      </button>
                    </>
                  ) : (
                    <Upload className="w-6 h-6 text-hq-text-muted group-hover:text-hq-accent-violet transition-colors" />
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
                <span className="block text-center text-[10px] text-hq-text-muted mt-1">
                  Profile Photo
                </span>
              </label>
            </div>

            {/* Row: Display Name + Username */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-hq-text-secondary mb-1">
                  Display Name *
                </label>
                <input
                  type="text"
                  required
                  value={form.display_name}
                  onChange={(e) => updateField("display_name", e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-3 py-2.5 rounded-lg bg-hq-bg-tertiary border border-white/[0.08] text-hq-text-primary placeholder:text-hq-text-muted text-sm focus:outline-none focus:border-hq-accent-purple/50 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-hq-text-secondary mb-1">
                  Username *
                </label>
                <input
                  type="text"
                  required
                  value={form.username}
                  onChange={(e) => updateField("username", e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                  placeholder="johndoe"
                  className="w-full px-3 py-2.5 rounded-lg bg-hq-bg-tertiary border border-white/[0.08] text-hq-text-primary placeholder:text-hq-text-muted text-sm focus:outline-none focus:border-hq-accent-purple/50 transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-hq-text-secondary mb-1">
                Email *
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                placeholder="john@example.com"
                className="w-full px-3 py-2.5 rounded-lg bg-hq-bg-tertiary border border-white/[0.08] text-hq-text-primary placeholder:text-hq-text-muted text-sm focus:outline-none focus:border-hq-accent-purple/50 transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-hq-text-secondary mb-1">
                Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  value={form.password}
                  onChange={(e) => updateField("password", e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full px-3 py-2.5 pr-10 rounded-lg bg-hq-bg-tertiary border border-white/[0.08] text-hq-text-primary placeholder:text-hq-text-muted text-sm focus:outline-none focus:border-hq-accent-purple/50 transition-all"
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

            {/* Row: Phone + DOB */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-hq-text-secondary mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  placeholder="+91 9876543210"
                  className="w-full px-3 py-2.5 rounded-lg bg-hq-bg-tertiary border border-white/[0.08] text-hq-text-primary placeholder:text-hq-text-muted text-sm focus:outline-none focus:border-hq-accent-purple/50 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-hq-text-secondary mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={form.date_of_birth}
                  onChange={(e) => updateField("date_of_birth", e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg bg-hq-bg-tertiary border border-white/[0.08] text-hq-text-primary text-sm focus:outline-none focus:border-hq-accent-purple/50 transition-all"
                />
              </div>
            </div>

            {/* College */}
            <div>
              <label className="block text-xs font-medium text-hq-text-secondary mb-1">
                College / University
              </label>
              <input
                type="text"
                value={form.college_name}
                onChange={(e) => updateField("college_name", e.target.value)}
                placeholder="MIT, Stanford, etc."
                className="w-full px-3 py-2.5 rounded-lg bg-hq-bg-tertiary border border-white/[0.08] text-hq-text-primary placeholder:text-hq-text-muted text-sm focus:outline-none focus:border-hq-accent-purple/50 transition-all"
              />
            </div>

            {/* Team */}
            <div>
              <label className="block text-xs font-medium text-hq-text-secondary mb-1">
                Team
              </label>
              <select
                value={form.team_id}
                onChange={(e) => updateField("team_id", e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg bg-hq-bg-tertiary border border-white/[0.08] text-hq-text-primary text-sm focus:outline-none focus:border-hq-accent-purple/50 transition-all"
              >
                <option value="">Select a team (optional)</option>
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
                <option value="others">Others (specify below)</option>
              </select>
            </div>

            {form.team_id === "others" && (
              <div>
                <label className="block text-xs font-medium text-hq-text-secondary mb-1">
                  Custom Team Name
                </label>
                <input
                  type="text"
                  value={form.custom_team_name}
                  onChange={(e) => updateField("custom_team_name", e.target.value)}
                  placeholder="Your team name"
                  className="w-full px-3 py-2.5 rounded-lg bg-hq-bg-tertiary border border-white/[0.08] text-hq-text-primary placeholder:text-hq-text-muted text-sm focus:outline-none focus:border-hq-accent-purple/50 transition-all"
                />
              </div>
            )}

            {/* Socials */}
            <div className="pt-2">
              <p className="text-xs font-medium text-hq-text-muted mb-3 uppercase tracking-wider">
                Social Links (Optional)
              </p>
              <div className="space-y-3">
                <input
                  type="url"
                  value={form.linkedin_url}
                  onChange={(e) => updateField("linkedin_url", e.target.value)}
                  placeholder="LinkedIn URL"
                  className="w-full px-3 py-2.5 rounded-lg bg-hq-bg-tertiary border border-white/[0.08] text-hq-text-primary placeholder:text-hq-text-muted text-sm focus:outline-none focus:border-hq-accent-purple/50 transition-all"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={form.instagram_handle}
                    onChange={(e) => updateField("instagram_handle", e.target.value)}
                    placeholder="@instagram"
                    className="w-full px-3 py-2.5 rounded-lg bg-hq-bg-tertiary border border-white/[0.08] text-hq-text-primary placeholder:text-hq-text-muted text-sm focus:outline-none focus:border-hq-accent-purple/50 transition-all"
                  />
                  <input
                    type="text"
                    value={form.twitter_handle}
                    onChange={(e) => updateField("twitter_handle", e.target.value)}
                    placeholder="@twitter / X"
                    className="w-full px-3 py-2.5 rounded-lg bg-hq-bg-tertiary border border-white/[0.08] text-hq-text-primary placeholder:text-hq-text-muted text-sm focus:outline-none focus:border-hq-accent-purple/50 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Error */}
            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-hq-danger bg-hq-danger/10 rounded-lg px-3 py-2 border border-hq-danger/20"
              >
                {error}
              </motion.p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <UserPlus className="w-4 h-4" />
              )}
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-hq-text-muted mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-hq-accent-violet hover:text-hq-accent-glow transition-colors font-medium">
              Sign in
            </Link>
          </p>
        </GlassPanel>
      </motion.div>
    </div>
  );
}
