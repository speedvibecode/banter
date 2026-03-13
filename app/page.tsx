import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { PollCard } from "@/components/PollCard";
import { listActivePolls, listRecentPolls } from "@/services/pollService";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [activePolls, recentPolls] = await Promise.all([
    listActivePolls(),
    listRecentPolls()
  ]);

  return (
    <main className="space-y-10">
      <section className="rounded-[32px] border border-zinc-800 bg-zinc-950/85 px-6 py-10 shadow-glow">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-blue-400">
            Crowd judgment engine
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Where arguments end.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-zinc-300">
            Post the debate. Let the crowd decide. Every poll gets one final verdict.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/create"
              className="rounded-lg bg-blue-500 px-5 py-3 font-semibold text-white transition hover:bg-blue-600"
            >
              Create Poll
            </Link>
            <a
              href="#feed"
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 px-5 py-3 text-zinc-200 transition hover:border-zinc-500"
            >
              View Arguments
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      <section id="feed" className="grid gap-8 lg:grid-cols-[1.4fr,1fr]">
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Active Polls</h2>
            <span className="text-sm text-zinc-400">{activePolls.length} live now</span>
          </div>
          <div className="space-y-4">
            {activePolls.length > 0 ? (
              activePolls.map((poll) => (
                <PollCard key={poll.id} poll={poll} />
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-zinc-800 p-8 text-zinc-400">
                No active polls yet. Start the first argument.
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Recent Verdicts</h2>
            <span className="text-sm text-zinc-400">{recentPolls.length} closed</span>
          </div>
          <div className="space-y-4">
            {recentPolls.length > 0 ? (
              recentPolls.map((poll) => (
                <PollCard key={poll.id} poll={poll} />
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-zinc-800 p-8 text-zinc-400">
                Closed polls will appear here after resolution.
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
