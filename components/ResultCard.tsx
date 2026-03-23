import type { ReactNode } from "react";
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
  locked?: boolean;
  lockOverlay?: ReactNode;
};

export function ResultCard({
  title,
  optionA,
  optionB,
  totalA,
  totalB,
  winner,
  voteCount,
  locked = false,
  lockOverlay
}: ResultCardProps) {
  const split = calculateSplit(totalA, totalB);
  const winnerLabel = winner === "A" ? optionA : optionB;

  return (
    <div className="shell-panel relative overflow-hidden p-5 sm:p-8">
      <div className={locked ? "pointer-events-none select-none blur-xl" : undefined} aria-hidden={locked}>
        <div className="grid gap-6 sm:gap-8">
          <div className="grid gap-4 sm:flex sm:flex-wrap sm:items-start sm:justify-between">
            <div className="space-y-3">
              <span className="neon-chip status-green">
                <Trophy className="h-3.5 w-3.5" />
                Final Result
              </span>
              <h1 className="max-w-4xl font-[var(--font-space)] text-3xl font-bold uppercase tracking-[-0.06em] text-[color:var(--text)] sm:text-5xl">
                {title}
              </h1>
            </div>
            <div className="section-panel w-full px-4 py-4 text-left sm:min-w-[160px] sm:w-auto sm:px-5 sm:py-5 sm:text-right">
              <p className="muted-kicker">Total votes</p>
              <p className="mt-3 font-[var(--font-space)] text-3xl font-bold text-[color:var(--primary)] sm:text-4xl">
                {voteCount}
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="bg-surface-low px-4 py-4 sm:px-5 sm:py-5">
              <p className="muted-kicker">Top choice</p>
              <p className="mt-3 text-xl font-semibold uppercase tracking-[0.08em] text-[color:var(--primary)] sm:text-2xl">
                {winnerLabel}
              </p>
            </div>
            <div className="bg-surface-low px-4 py-4 sm:px-5 sm:py-5">
              <p className="muted-kicker">Vote split</p>
              <div className="mt-4">
                <VoteBar aPercent={split.aPercent} bPercent={split.bPercent} className="h-3" />
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="section-panel px-4 py-4 sm:px-5 sm:py-5">
              <p className="kicker">Option A</p>
              <p className="mt-3 text-2xl font-bold text-[color:var(--text)] sm:text-3xl">{split.aPercent}%</p>
              <p className="mt-2 text-sm uppercase tracking-[0.16em] text-[color:var(--muted)]">
                {optionA}
              </p>
            </div>
            <div className="section-panel px-4 py-4 sm:px-5 sm:py-5">
              <p className="kicker">Option B</p>
              <p className="mt-3 text-2xl font-bold text-[color:var(--text)] sm:text-3xl">{split.bPercent}%</p>
              <p className="mt-2 text-sm uppercase tracking-[0.16em] text-[color:var(--muted)]">
                {optionB}
              </p>
            </div>
          </div>
        </div>
      </div>

      {locked ? (
        <div className="absolute inset-0 flex items-center justify-center bg-[color:var(--surface-overlay)]/60 px-6 text-center backdrop-blur-sm">
          <div className="shell-panel grid max-w-md gap-4 px-6 py-7">
            {lockOverlay}
          </div>
        </div>
      ) : null}
    </div>
  );
}
