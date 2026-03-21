import Link from "next/link";
import { Activity, Sparkles, Zap } from "lucide-react";

import { HomeFeed } from "@/components/HomeFeed";
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

  const liveVotes = activePolls.reduce((sum, poll) => sum + poll.voteCount, 0);

  return (
    <main className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_320px]">
        <div className="shell-panel overflow-hidden">
          <div className="grid gap-6 px-5 py-5 sm:px-8 sm:py-7">
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
                <h1 className="font-[var(--font-space)] text-4xl font-bold uppercase leading-[0.92] tracking-[-0.06em] text-white sm:text-6xl xl:text-7xl">
                  Where arguments end and signal wins.
                </h1>
                <p className="max-w-2xl text-base leading-7 text-[color:var(--muted)] sm:text-lg">
                  Earn Reputation by Settling Arguments!
                </p>

                <div className="flex flex-wrap gap-3">
                  <Link href="/create" className="primary-cta">
                    Launch Argument
                  </Link>
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

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                <div className="section-panel px-4 py-5">
                  <p className="muted-kicker">Active arguments</p>
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
                  <p className="muted-kicker">Resolved arguments</p>
                  <p className="data-value mt-3 font-[var(--font-space)] text-4xl">
                    {recentPolls.length}
                  </p>
                </div>
                <div className="section-panel px-4 py-5">
                  <p className="muted-kicker">Live participation</p>
                  <p className="data-value mt-3 font-[var(--font-space)] text-4xl">
                    {liveVotes}
                  </p>
                </div>
              </div>
            </div>
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
        </aside>
      </section>

      <HomeFeed activePolls={activePolls} recentPolls={recentPolls} />
    </main>
  );
}
