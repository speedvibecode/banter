"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Flame, Sparkles, TrendingUp } from "lucide-react";

import { LoginForm } from "@/components/LoginForm";
import { SignupForm } from "@/components/SignupForm";
import type { PollCardData } from "@/lib/types";

type AuthLandingProps = {
  activePolls: PollCardData[];
  initialMode?: "login" | "signup";
  recentPolls: PollCardData[];
};

export function AuthLanding({
  activePolls,
  initialMode = "signup",
  recentPolls
}: AuthLandingProps) {
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const trendingPolls =
    activePolls.length > 0 ? activePolls.slice(0, 4) : recentPolls.slice(0, 4);
  const totalVotes = activePolls.reduce((sum, poll) => sum + poll.voteCount, 0);

  return (
    <main className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_420px]">
        <div className="grid gap-6">
          <section className="shell-panel overflow-hidden">
            <div className="grid gap-8 px-6 py-7 sm:px-8 sm:py-8">
              <div className="flex flex-wrap gap-3">
                <span className="neon-chip status-green">
                  <Sparkles className="h-3.5 w-3.5" />
                  Fresh debates
                </span>
                <span className="neon-chip status-purple">
                  <Flame className="h-3.5 w-3.5" />
                  Live reactions
                </span>
              </div>

              <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_260px]">
                <div className="space-y-5">
                  <p className="kicker">Welcome to Banter</p>
                  <h1 className="font-[var(--font-space)] text-4xl font-bold uppercase leading-[0.9] tracking-[-0.07em] text-[color:var(--text)] sm:text-6xl xl:text-7xl">
                    Post a question. Let people choose a side.
                  </h1>
                  <p className="max-w-2xl text-base leading-7 text-[color:var(--muted)] sm:text-lg">
                    Join the feed to throw out a take, pick a side, and watch the open and closed
                    conversations roll in.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                  <div className="section-panel px-4 py-5">
                    <p className="muted-kicker">Open polls</p>
                    <p className="data-value mt-3 font-[var(--font-space)] text-4xl">
                      {activePolls.length}
                    </p>
                  </div>
                  <div className="section-panel px-4 py-5">
                    <p className="muted-kicker">Live votes</p>
                    <p className="data-value mt-3 font-[var(--font-space)] text-4xl">
                      {totalVotes}
                    </p>
                  </div>
                  <div className="section-panel px-4 py-5">
                    <p className="muted-kicker">Closed posts</p>
                    <p className="data-value mt-3 font-[var(--font-space)] text-4xl">
                      {recentPolls.length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="shell-panel px-6 py-6 sm:px-8">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-[color:var(--secondary)]" />
              <p className="panel-title">Trending posts</p>
            </div>

            <div className="mt-5 grid gap-4">
              {trendingPolls.length > 0 ? (
                trendingPolls.map((poll) => (
                  <Link
                    key={poll.id}
                    href={poll.status === "CLOSED" ? `/result/${poll.id}` : `/poll/${poll.id}`}
                    className="section-panel grid gap-2 px-5 py-4 transition hover:bg-[color:var(--surface)]"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="muted-kicker">{poll.category}</p>
                      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
                        {poll.voteCount} votes
                      </span>
                    </div>
                    <p className="text-base font-semibold uppercase tracking-[0.05em] text-[color:var(--text)]">
                      {poll.title}
                    </p>
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--primary)]">
                      <span>{poll.status === "CLOSED" ? "See result" : "Join debate"}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </Link>
                ))
              ) : (
                <div className="section-panel px-6 py-10 text-sm uppercase tracking-[0.16em] text-[color:var(--muted)]">
                  New polls will appear here as soon as the first debate is live.
                </div>
              )}
            </div>
          </section>
        </div>

        <section id="auth" className="grid gap-4 self-start xl:sticky xl:top-0">
          <div className="shell-panel grid gap-5 px-6 py-7 sm:px-8">
            <div className="space-y-3">
              <p className="kicker">{mode === "signup" ? "Create account" : "Welcome back"}</p>
              <h2 className="font-[var(--font-space)] text-4xl font-bold uppercase leading-[0.92] tracking-[-0.06em] text-[color:var(--text)]">
                {mode === "signup" ? "Join the feed." : "Get back into the feed."}
              </h2>
              <p className="text-sm leading-6 text-[color:var(--muted)]">
                {mode === "signup"
                  ? "Create an account to post, vote, and drop straight into the live feed."
                  : "Sign in to pick up where you left off and jump right into the latest debates."}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 bg-[color:var(--ghost-bg)] p-2">
              <button
                type="button"
                onClick={() => setMode("signup")}
                className={`px-4 py-3 text-xs font-semibold uppercase tracking-[0.24em] transition ${
                  mode === "signup"
                    ? "bg-[color:var(--surface-high)] text-[color:var(--primary)]"
                    : "text-[color:var(--muted)] hover:bg-[color:var(--ghost-hover)] hover:text-[color:var(--text)]"
                }`}
              >
                Sign up
              </button>
              <button
                type="button"
                onClick={() => setMode("login")}
                className={`px-4 py-3 text-xs font-semibold uppercase tracking-[0.24em] transition ${
                  mode === "login"
                    ? "bg-[color:var(--surface-high)] text-[color:var(--primary)]"
                    : "text-[color:var(--muted)] hover:bg-[color:var(--ghost-hover)] hover:text-[color:var(--text)]"
                }`}
              >
                Login
              </button>
            </div>
          </div>

          {mode === "signup" ? <SignupForm /> : <LoginForm />}
        </section>
      </section>
    </main>
  );
}
