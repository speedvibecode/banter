import Link from "next/link";
import { ArrowRight, Activity, BadgeDollarSign, Sparkles, Zap } from "lucide-react";

import { PollCard } from "@/components/PollCard";
import { auth } from "@/lib/auth";
import { listActivePolls, listRecentPolls } from "@/services/pollService";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [session, activePolls, recentPolls] = await Promise.all([
    auth(),
    listActivePolls(),
    listRecentPolls()
  ]);

  const heroPoll = activePolls[0] ?? recentPolls[0] ?? null;
  const liveVotes = activePolls.reduce((sum, poll) => sum + poll.voteCount, 0);

  return (
    <main className="space-y-8">
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_320px]">
        <div className="shell-panel overflow-hidden">
          <div className="grid gap-8 px-5 py-6 sm:px-8 sm:py-8">
            <div className="flex flex-wrap items-center gap-3">
              <span className="neon-chip status-green">
                <Activity className="h-3.5 w-3.5" />
                Live Arena
              </span>
              <span className="neon-chip status-purple">
                <Sparkles className="h-3.5 w-3.5" />
                Reputation synced
              </span>
            </div>

            <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_220px]">
              <div className="space-y-5">
                <p className="kicker">Crowd judgment engine</p>
                <h1 className="font-[var(--font-space)] text-5xl font-bold uppercase leading-[0.92] tracking-[-0.06em] text-white sm:text-6xl xl:text-7xl">
                  Where arguments end and signal wins.
                </h1>
                <p className="max-w-2xl text-base leading-7 text-[color:var(--muted)] sm:text-lg">
                  Banter keeps the full product logic intact while the interface moves into a
                  sharper command-center aesthetic: live polls, weighted voting, instant verdicts,
                  and reputation feedback in one arena.
                </p>

                <div className="flex flex-wrap gap-3">
                  <Link href="/create" className="primary-cta">
                    Launch Argument
                  </Link>
                  <a href="#feed" className="ghost-cta">
                    View Live Feed
                    <ArrowRight className="h-4 w-4" />
                  </a>
                  {!session?.user ? (
                    <>
                      <Link href="/login" className="ghost-cta">
                        Login
                      </Link>
                      <Link href="/signup" className="secondary-cta">
                        Create Account
                      </Link>
                    </>
                  ) : null}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                <div className="section-panel px-4 py-5">
                  <p className="muted-kicker">Active markets</p>
                  <p className="data-value mt-3 font-[var(--font-space)] text-4xl">
                    {activePolls.length}
                  </p>
                </div>
                <div className="section-panel px-4 py-5">
                  <p className="muted-kicker">Live votes</p>
                  <p className="data-value mt-3 font-[var(--font-space)] text-4xl">
                    {liveVotes}
                  </p>
                </div>
                <div className="section-panel px-4 py-5">
                  <p className="muted-kicker">Resolved loops</p>
                  <p className="data-value mt-3 font-[var(--font-space)] text-4xl">
                    {recentPolls.length}
                  </p>
                </div>
              </div>
            </div>

            {heroPoll ? (
              <div className="grid-panel flex flex-col gap-5 px-5 py-5 sm:px-6 sm:py-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-3">
                    <p className="muted-kicker">{heroPoll.category}</p>
                    <h2 className="max-w-3xl font-[var(--font-space)] text-3xl font-bold uppercase tracking-[-0.05em] text-white sm:text-4xl">
                      {heroPoll.title}
                    </h2>
                  </div>
                  <div className="section-panel min-w-[152px] px-4 py-4 text-right">
                    <p className="muted-kicker">Current pressure</p>
                    <p className="mt-3 font-[var(--font-space)] text-3xl font-bold text-[color:var(--primary)]">
                      {heroPoll.voteCount}
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-[0.26em] text-[color:var(--muted)]">
                      votes in motion
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <div className="section-panel px-4 py-4">
                    <p className="muted-kicker">Option A</p>
                    <p className="mt-2 text-lg font-semibold uppercase tracking-[0.08em] text-white">
                      {heroPoll.optionA}
                    </p>
                  </div>
                  <div className="section-panel px-4 py-4">
                    <p className="muted-kicker">Option B</p>
                    <p className="mt-2 text-lg font-semibold uppercase tracking-[0.08em] text-white">
                      {heroPoll.optionB}
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <aside className="grid gap-5">
          <div className="section-panel px-5 py-5">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-[color:var(--secondary)]" />
              <p className="panel-title">Hot Arguments</p>
            </div>
            <div className="mt-5 space-y-5">
              {(activePolls.slice(0, 3).length > 0 ? activePolls.slice(0, 3) : recentPolls.slice(0, 3)).map(
                (poll) => (
                  <Link key={poll.id} href={poll.status === "CLOSED" ? `/result/${poll.id}` : `/poll/${poll.id}`} className="block space-y-1">
                    <p className="muted-kicker">{poll.category}</p>
                    <p className="text-sm font-semibold uppercase tracking-[0.05em] text-white transition hover:text-[color:var(--primary)]">
                      {poll.title}
                    </p>
                  </Link>
                )
              )}
            </div>
          </div>

          <div className="section-panel px-5 py-5">
            <div className="flex items-center gap-2">
              <BadgeDollarSign className="h-4 w-4 text-[color:var(--primary)]" />
              <p className="panel-title">Arena Pulse</p>
            </div>
            <div className="mt-5 grid gap-4">
              <div className="grid-panel px-4 py-4">
                <p className="muted-kicker">Total live participation</p>
                <p className="mt-3 font-[var(--font-space)] text-4xl font-bold text-[color:var(--primary)]">
                  {liveVotes}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-surface-low px-4 py-4">
                  <p className="muted-kicker">Guests</p>
                  <p className="mt-2 text-2xl font-bold text-white">
                    {session?.user ? "0" : "1"}
                  </p>
                </div>
                <div className="bg-surface-low px-4 py-4">
                  <p className="muted-kicker">Session</p>
                  <p className="mt-2 text-2xl font-bold text-white">
                    {session?.user ? "Node" : "Guest"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </section>

      <section id="feed" className="grid gap-8 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        <div className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="kicker">Active feed</p>
              <h2 className="mt-2 font-[var(--font-space)] text-3xl font-bold uppercase tracking-[-0.05em] text-white">
                Live arguments
              </h2>
            </div>
            <span className="text-sm uppercase tracking-[0.22em] text-[color:var(--muted)]">
              {activePolls.length} open
            </span>
          </div>
          <div className="space-y-4">
            {activePolls.length > 0 ? (
              activePolls.map((poll) => <PollCard key={poll.id} poll={poll} />)
            ) : (
              <div className="section-panel px-6 py-10 text-sm uppercase tracking-[0.24em] text-[color:var(--muted)]">
                No active polls yet. Start the first argument.
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="kicker">Resolved feed</p>
              <h2 className="mt-2 font-[var(--font-space)] text-3xl font-bold uppercase tracking-[-0.05em] text-white">
                Recent verdicts
              </h2>
            </div>
            <span className="text-sm uppercase tracking-[0.22em] text-[color:var(--muted)]">
              {recentPolls.length} closed
            </span>
          </div>
          <div className="space-y-4">
            {recentPolls.length > 0 ? (
              recentPolls.map((poll) => <PollCard key={poll.id} poll={poll} />)
            ) : (
              <div className="section-panel px-6 py-10 text-sm uppercase tracking-[0.24em] text-[color:var(--muted)]">
                Closed polls will appear here after resolution.
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
