import Link from "next/link";
import { ArrowRight, Flame } from "lucide-react";

import { CountdownTimer } from "@/components/CountdownTimer";
import { VoteBar } from "@/components/VoteBar";
import { calculateSplit } from "@/lib/pollLogic";
import type { PollCardData } from "@/lib/types";

type PollCardProps = {
  poll: PollCardData;
};

export function PollCard({ poll }: PollCardProps) {
  const split = calculateSplit(poll.totalA, poll.totalB);

  return (
    <Link
      href={poll.status === "CLOSED" ? `/result/${poll.id}` : `/poll/${poll.id}`}
      className="group block rounded-2xl border border-zinc-800 bg-zinc-900/90 p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-zinc-700 hover:shadow-glow"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">
            {poll.category}
          </p>
          <h3 className="text-xl font-bold tracking-tight text-white">{poll.title}</h3>
        </div>
        {poll.status === "ACTIVE" ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-300">
            <Flame className="h-3.5 w-3.5 text-orange-400" />
            Live
          </span>
        ) : null}
      </div>

      <div className="space-y-3">
        <div className="flex justify-between text-sm font-medium text-zinc-200">
          <span>{poll.optionA}</span>
          <span>{poll.optionB}</span>
        </div>
        <VoteBar aPercent={split.aPercent} bPercent={split.bPercent} />
        <div className="flex justify-between text-sm text-zinc-400">
          <span>
            A {split.aPercent}% / B {split.bPercent}%
          </span>
          <span>{poll.voteCount} votes</span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-zinc-800 pt-4 text-sm">
        <span className="text-zinc-400">
          by {poll.creator.username} • Rep {poll.creator.reputation}
        </span>
        <div className="flex items-center gap-3 text-zinc-300">
          <CountdownTimer endTime={poll.endTime} />
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}
