import { Trophy } from "lucide-react";

import { VoteBar } from "@/components/VoteBar";
import { calculateSplit } from "@/lib/pollLogic";

type ResultCardProps = {
  title: string;
  optionA: string;
  optionB: string;
  totalA: number;
  totalB: number;
  winner: "A" | "B";
  voteCount: number;
};

export function ResultCard({
  title,
  optionA,
  optionB,
  totalA,
  totalB,
  winner,
  voteCount
}: ResultCardProps) {
  const split = calculateSplit(totalA, totalB);
  const winnerLabel = winner === "A" ? optionA : optionB;

  return (
    <div className="shell-panel grid gap-8 p-6 sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-3">
          <span className="neon-chip status-green">
            <Trophy className="h-3.5 w-3.5" />
            Banter Verdict
          </span>
          <h1 className="max-w-4xl font-[var(--font-space)] text-4xl font-bold uppercase tracking-[-0.06em] text-white sm:text-5xl">
            {title}
          </h1>
        </div>
        <div className="section-panel min-w-[160px] px-5 py-5 text-right">
          <p className="muted-kicker">Total votes</p>
          <p className="mt-3 font-[var(--font-space)] text-4xl font-bold text-[color:var(--primary)]">
            {voteCount}
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="bg-surface-low px-5 py-5">
          <p className="muted-kicker">Winning side</p>
          <p className="mt-3 text-2xl font-semibold uppercase tracking-[0.08em] text-[color:var(--primary)]">
            {winnerLabel}
          </p>
        </div>
        <div className="bg-surface-low px-5 py-5">
          <p className="muted-kicker">Verdict split</p>
          <div className="mt-4">
            <VoteBar aPercent={split.aPercent} bPercent={split.bPercent} className="h-3" />
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="section-panel px-5 py-5">
          <p className="kicker">Option A</p>
          <p className="mt-3 text-3xl font-bold text-white">{split.aPercent}%</p>
          <p className="mt-2 text-sm uppercase tracking-[0.16em] text-[color:var(--muted)]">
            {optionA}
          </p>
        </div>
        <div className="section-panel px-5 py-5">
          <p className="kicker">Option B</p>
          <p className="mt-3 text-3xl font-bold text-white">{split.bPercent}%</p>
          <p className="mt-2 text-sm uppercase tracking-[0.16em] text-[color:var(--muted)]">
            {optionB}
          </p>
        </div>
      </div>
    </div>
  );
}
