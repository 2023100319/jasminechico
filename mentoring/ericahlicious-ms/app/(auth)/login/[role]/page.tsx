"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Eye, EyeOff, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

const ROLE_CONFIG: Record<
  string,
  { label: string; color: string; bgGradient: string }
> = {
  owner: {
    label: "Owner",
    color: "from-yellow-500 to-amber-600",
    bgGradient: "from-yellow-500/20 to-amber-600/20",
  },
  admin: {
    label: "Admin / Management",
    color: "from-purple-500 to-violet-600",
    bgGradient: "from-purple-500/20 to-violet-600/20",
  },
  supervisor: {
    label: "Supervisor",
    color: "from-blue-500 to-cyan-600",
    bgGradient: "from-blue-500/20 to-cyan-600/20",
  },
};

const ROLE_DASHBOARDS: Record<string, string> = {
  owner: "/owner",
  admin: "/admin",
  supervisor: "/supervisor",
};

export default function LoginPage({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const { role } = use(params);
  const config = ROLE_CONFIG[role];
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect to role selection if role is invalid — must be in useEffect, not render path
  useEffect(() => {
    if (!config) {
      router.replace("/");
    }
  }, [config, router]);

  if (!config) {
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        username,
        password,
        role: role.toUpperCase(),
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid username or password. Please try again.");
      } else {
        router.push(ROLE_DASHBOARDS[role] || "/");
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      {/* Background glow */}
      <div className={`absolute inset-0 overflow-hidden pointer-events-none`}>
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br ${config.bgGradient} rounded-full blur-3xl opacity-40`} />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Back button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to role selection
        </Link>

        {/* Card */}
        <div className="bg-slate-800/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          {/* Logo */}
          <div className="text-center mb-8">
            <div
              className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${config.color} mb-4 shadow-2xl`}
            >
              <span className="text-2xl font-black text-white">E</span>
            </div>
            <h2 className="text-white text-xl font-bold">Welcome back</h2>
            <p className="text-slate-400 text-sm mt-1">
              Signing in as{" "}
              <span className="text-white font-medium">{config.label}</span>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            {/* Username */}
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                required
                className="w-full bg-slate-700/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                  className="w-full bg-slate-700/50 border border-white/10 rounded-xl px-4 py-3 pr-12 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <button
                type="button"
                className="text-slate-500 hover:text-slate-300 text-xs mt-2 transition-colors"
              >
                Forgot Password?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-gradient-to-r ${config.color} text-white font-semibold py-3 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed mt-2`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
