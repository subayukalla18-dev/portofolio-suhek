"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-md">

        <div className="mb-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
            Admin Panel
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-white">
            Welcome back.
          </h1>

          <p className="mt-3 text-sm leading-6 text-white/45">
            Sign in to manage your portfolio content.
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          className="rounded-2xl border border-white/10 bg-[#080808]/80 p-6"
        >
          <div className="space-y-5">

            <div>
              <label
                htmlFor="email"
                className="mb-2 block font-mono text-[10px] uppercase tracking-[0.18em] text-white/40"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="admin@example.com"
                required
                autoComplete="email"
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-white/25 focus:bg-white/[0.05]"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block font-mono text-[10px] uppercase tracking-[0.18em] text-white/40"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-white/25 focus:bg-white/[0.05]"
              />
            </div>

            {error && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/[0.05] px-4 py-3">
                <p className="text-xs leading-5 text-red-400">
                  {error}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-white px-4 py-3 text-sm font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "SIGNING IN..." : "SIGN IN"}
            </button>

          </div>
        </form>

        <div className="mt-6 text-center">
          <a
            href="/"
            className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/30 transition hover:text-white/60"
          >
            ← Back to portfolio
          </a>
        </div>

      </div>
    </main>
  );
}