import Link from "next/link";
import { ArrowRight, Clock3, CheckCircle2 } from "lucide-react";

import { CountdownTimer } from "@/components/CountdownTimer";
import { VoteBar } from "@/components/VoteBar";
import { calculateSplit } from "@/lib/pollLogic";
import type { PollCardData } from "@/lib/types";

type PollCardProps = {
  poll: PollCardData;
};

export function PollCard({ poll }: PollCardProps) {
  const split = calculateSplit(poll.totalA, poll.totalB);
  const href = poll.status === "CLOSED" ? `/result/${poll.id}` : `/poll/${poll.id}`;

  return (
    <Link
      href={href}
      className="group block bg-[color:var(--surface-high)]/92 p-5 transition hover:bg-[color:var(--surface-high)]"
      style={{
        boxShadow:
          "inset 0 0 0 1px rgba(255,255,255,0.04), 0 10px 28px rgba(0,0,0,0.16)"
      }}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="neon-chip status-purple">{poll.category}</span>
            {poll.status === "ACTIVE" ? (
              <span className="neon-chip status-green">
                <Clock3 className="h-3.5 w-3.5" />
                Open
              </span>
            ) : (
              <span className="neon-chip status-green">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Closed
              </span>
            )}
          </div>
          <h3 className="max-w-3xl font-[var(--font-space)] text-xl font-bold uppercase tracking-[-0.05em] text-[color:var(--text)] sm:text-[2rem]">
            {poll.title}
          </h3>
        </div>

        <div className="section-panel w-full px-4 py-3 text-right sm:w-auto sm:min-w-[144px]">
          <p className="muted-kicker">{poll.status === "ACTIVE" ? "Vote count" : "Final count"}</p>
          <p className="mt-2 font-[var(--font-space)] text-3xl font-bold text-[color:var(--primary)]">
            {poll.voteCount}
          </p>
          <p className="mt-1 text-[0.62rem] uppercase tracking-[0.24em] text-[color:var(--muted)]">
            votes
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className="bg-surface-low px-4 py-4">
          <p className="muted-kicker">Option A</p>
          <p className="mt-2 text-base font-semibold uppercase tracking-[0.08em] text-[color:var(--text)]">
            {poll.optionA}
          </p>
        </div>
        <div className="bg-surface-low px-4 py-4">
          <p className="muted-kicker">Option B</p>
          <p className="mt-2 text-base font-semibold uppercase tracking-[0.08em] text-[color:var(--text)]">
            {poll.optionB}
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <div className="flex justify-between text-[0.68rem] font-semibold uppercase tracking-[0.24em]">
          <span className="text-[color:var(--primary)]">{split.aPercent}%</span>
          <span className="text-[color:var(--secondary)]">{split.bPercent}%</span>
        </div>
        <VoteBar aPercent={split.aPercent} bPercent={split.bPercent} />
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 bg-[color:var(--surface-overlay)] px-4 py-4 text-sm">
        <div className="space-y-1">
          <p className="text-[0.62rem] uppercase tracking-[0.28em] text-[color:var(--muted)]">
            Posted by
          </p>
          <p className="font-semibold uppercase tracking-[0.08em] text-[color:var(--text)]">
            {poll.creator.username}
            <span className="ml-2 text-[color:var(--muted)]">Rep {poll.creator.reputation}</span>
          </p>
        </div>

        <div className="flex items-center gap-4">
          <CountdownTimer endTime={poll.endTime} />
          <ArrowRight className="h-4 w-4 text-[color:var(--muted)] transition group-hover:translate-x-1 group-hover:text-[color:var(--text)]" />
        </div>
      </div>
    </Link>
  );
}
