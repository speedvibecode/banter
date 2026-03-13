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
      <main className="mx-auto max-w-3xl space-y-6">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6">
          <p className="text-sm uppercase tracking-[0.25em] text-green-400">Closed</p>
          <h1 className="mt-2 text-3xl font-bold">{poll.title}</h1>
          <p className="mt-3 text-zinc-400">This poll has reached a verdict.</p>
          <Link
            href={`/result/${poll.id}`}
            className="mt-6 inline-flex rounded-lg bg-blue-500 px-4 py-2 font-semibold text-white"
          >
            View result
          </Link>
        </div>
      </main>
    );
  }

  const split = calculateSplit(poll.totalA, poll.totalB);

  return (
    <main className="mx-auto max-w-3xl space-y-6">
      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6">
        <p className="text-sm uppercase tracking-[0.25em] text-blue-400">{poll.category}</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">{poll.title}</h1>
        {poll.description ? <p className="mt-4 text-zinc-300">{poll.description}</p> : null}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
            <p className="text-sm text-blue-300">Option A</p>
            <p className="mt-2 text-xl font-semibold text-white">{poll.optionA}</p>
          </div>
          <div className="rounded-xl border border-orange-500/20 bg-orange-500/5 p-4">
            <p className="text-sm text-orange-300">Option B</p>
            <p className="mt-2 text-xl font-semibold text-white">{poll.optionB}</p>
          </div>
        </div>
      </section>

      {session?.user ? (
        <VoteSlider pollId={poll.id} optionA={poll.optionA} optionB={poll.optionB} />
      ) : (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6 text-zinc-300">
          <p className="text-lg font-semibold text-white">Login required to vote</p>
          <p className="mt-2 text-zinc-400">
            You need an account to submit Banter Points on this poll.
          </p>
          <Link
            href={`/login?callbackUrl=/poll/${poll.id}`}
            className="mt-4 inline-flex rounded-lg bg-blue-500 px-4 py-2 font-semibold text-white"
          >
            Login to vote
          </Link>
        </div>
      )}

      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Live split</h2>
          <span className="text-sm text-zinc-400">{poll.voteCount} votes</span>
        </div>
        <div className="mt-4">
          <VoteBar aPercent={split.aPercent} bPercent={split.bPercent} />
        </div>
        <div className="mt-3 flex justify-between text-sm text-zinc-400">
          <span>
            {poll.optionA}: {split.aPercent}%
          </span>
          <span>
            {poll.optionB}: {split.bPercent}%
          </span>
        </div>
      </section>

      {session?.user ? (
        <ReportModal pollId={poll.id} />
      ) : (
        <Link
          href={`/login?callbackUrl=/poll/${poll.id}`}
          className="inline-flex rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300"
        >
          Login to report
        </Link>
      )}
    </main>
  );
}
