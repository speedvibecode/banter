import Link from "next/link";
import { notFound } from "next/navigation";

import { ReportModal } from "@/components/ReportModal";
import { VoteBar } from "@/components/VoteBar";
import { VoteSlider } from "@/components/VoteSlider";
import { auth } from "@/lib/auth";
import { calculateSplit } from "@/lib/pollLogic";
import { getPoll, resolvePoll } from "@/services/pollService";

export const dynamic = "force-dynamic";

type PollPageProps = {
  params: {
    id: string;
  };
};

export default async function PollPage({ params }: PollPageProps) {
  const { id } = params;
  const session = await auth();
  let poll = await getPoll(id);

  if (!poll) {
    notFound();
  }

  if (poll.status === "ACTIVE" && poll.endTime <= new Date()) {
    await resolvePoll(poll.id);
    poll = await getPoll(id);
  }

  if (!poll) {
    notFound();
  }

  if (poll.status !== "ACTIVE") {
    return (
      <main className="space-y-6">
        <section className="shell-panel grid gap-5 px-6 py-8 sm:px-8">
          <p className="kicker">Closed signal</p>
          <h1 className="font-[var(--font-space)] text-4xl font-bold uppercase tracking-[-0.05em] text-white sm:text-5xl">
            {poll.title}
          </h1>
          <p className="max-w-2xl text-base leading-7 text-[color:var(--muted)]">
            This poll has already resolved. The route logic is unchanged and now redirects users
            toward the existing result page.
          </p>
          <div>
            <Link href={`/result/${poll.id}`} className="primary-cta">
              View Result
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const split = calculateSplit(poll.totalA, poll.totalB);

  return (
    <main className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_320px]">
        <div className="shell-panel grid gap-6 px-6 py-8 sm:px-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="neon-chip status-purple">{poll.category}</span>
            <span className="neon-chip status-green">Active poll</span>
          </div>
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_220px]">
            <div>
              <h1 className="max-w-4xl font-[var(--font-space)] text-4xl font-bold uppercase tracking-[-0.06em] text-white sm:text-6xl">
                {poll.title}
              </h1>
              {poll.description ? (
                <p className="mt-5 max-w-3xl text-base leading-7 text-[color:var(--muted)]">
                  {poll.description}
                </p>
              ) : null}
            </div>
            <div className="section-panel px-5 py-5">
              <p className="muted-kicker">Votes in arena</p>
              <p className="mt-3 font-[var(--font-space)] text-5xl font-bold text-[color:var(--primary)]">
                {poll.voteCount}
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="bg-surface-low px-5 py-5">
              <p className="kicker">Option A</p>
              <p className="mt-3 text-xl font-semibold uppercase tracking-[0.08em] text-white">
                {poll.optionA}
              </p>
            </div>
            <div className="bg-surface-low px-5 py-5">
              <p className="kicker">Option B</p>
              <p className="mt-3 text-xl font-semibold uppercase tracking-[0.08em] text-white">
                {poll.optionB}
              </p>
            </div>
          </div>
        </div>

        <aside className="section-panel grid gap-5 p-5">
          <div>
            <p className="kicker">Live split</p>
            <div className="mt-4">
              <VoteBar aPercent={split.aPercent} bPercent={split.bPercent} className="h-3" />
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              <div className="bg-surface-low px-4 py-4">
                <p className="muted-kicker">Vector 01</p>
                <p className="mt-2 text-3xl font-bold text-[color:var(--primary)]">
                  {split.aPercent}%
                </p>
                <p className="mt-1 text-sm uppercase tracking-[0.14em] text-[color:var(--muted)]">
                  {poll.optionA}
                </p>
              </div>
              <div className="bg-surface-low px-4 py-4">
                <p className="muted-kicker">Vector 02</p>
                <p className="mt-2 text-3xl font-bold text-[color:var(--secondary)]">
                  {split.bPercent}%
                </p>
                <p className="mt-1 text-sm uppercase tracking-[0.14em] text-[color:var(--muted)]">
                  {poll.optionB}
                </p>
              </div>
            </div>
          </div>
        </aside>
      </section>

      {session?.user ? (
        <VoteSlider pollId={poll.id} optionA={poll.optionA} optionB={poll.optionB} />
      ) : (
        <section className="shell-panel grid gap-4 px-6 py-6 sm:px-8">
          <p className="kicker">Access required</p>
          <p className="text-lg font-semibold uppercase tracking-[0.08em] text-white">
            Login to vote
          </p>
          <p className="max-w-2xl text-base leading-7 text-[color:var(--muted)]">
            You need an account to submit Banter Points on this poll. The vote path itself is
            unchanged.
          </p>
          <div>
            <Link href={`/login?callbackUrl=/poll/${poll.id}`} className="primary-cta">
              Login to vote
            </Link>
          </div>
        </section>
      )}

      {session?.user ? (
        <ReportModal pollId={poll.id} />
      ) : (
        <Link href={`/login?callbackUrl=/poll/${poll.id}`} className="ghost-cta">
          Login to report
        </Link>
      )}
    </main>
  );
}
