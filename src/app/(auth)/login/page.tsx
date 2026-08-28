"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Sparkles } from "lucide-react";
import AuroraBackground from "@/components/ui/AuroraBackground";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      redirect: true,
      email: form.email,
      password: form.password,
      callbackUrl: "/dashboard",
    });

    setLoading(false);

    if (res?.error) {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center overflow-hidden bg-[#070b18] px-5 py-28 relative">
      <AuroraBackground />

      <form
        onSubmit={handleSubmit}
        className="glass-panel glow-border relative w-full max-w-md space-y-6 rounded-3xl p-8 md:p-10"
      >
        <div className="text-center space-y-2">
          <div className="inline-flex p-2 bg-primary/10 rounded-lg text-primary mb-2">
            <Sparkles className="w-6 h-6" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-[.24em] text-violet-300">Welcome back</p>
          <h1 className="text-3xl font-semibold text-white">Build what&apos;s next.</h1>
          <p className="text-muted-foreground text-sm">Sign in to continue building your portfolio</p>
        </div>

        {error && <p className="text-destructive text-sm bg-destructive/10 p-2 rounded text-center">{error}</p>}

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-white outline-none transition-all placeholder:text-muted-foreground focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-white outline-none transition-all placeholder:text-muted-foreground focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 py-3 font-semibold text-white transition-all hover:scale-[1.01] hover:shadow-lg hover:shadow-violet-500/25"
        >
          {loading ? "Logging in..." : "Log In"}
        </button>

        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="flex-shrink-0 mx-4 text-muted-foreground text-sm">Or</span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

        <button
          type="button"
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="w-full flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-3 text-white transition-colors hover:bg-white/10 font-medium"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Continue with Google
        </button>

        <p className="text-center text-sm text-muted-foreground">
          Don’t have an account?{" "}
          <a href="/signup" className="text-primary hover:underline font-medium">
            Sign up
          </a>
        </p>
      </form>
    </div>
  );
}
