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
    <div className="rounded-[28px] border border-zinc-800 bg-zinc-900/90 p-6 shadow-glow">
      <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-green-500/10 px-3 py-1 text-sm font-medium text-green-400">
        <Trophy className="h-4 w-4" />
        Banter Verdict
      </div>
      <h1 className="text-3xl font-bold tracking-tight text-white">{title}</h1>
      <p className="mt-6 text-sm uppercase tracking-[0.2em] text-zinc-500">
        Winning side
      </p>
      <p className="mt-2 text-2xl font-bold text-green-400">{winnerLabel}</p>
      <div className="mt-6">
        <VoteBar aPercent={split.aPercent} bPercent={split.bPercent} className="h-4" />
      </div>
      <div className="mt-4 flex justify-between text-sm text-zinc-300">
        <span>
          {optionA}: {split.aPercent}%
        </span>
        <span>
          {optionB}: {split.bPercent}%
        </span>
      </div>
      <p className="mt-6 text-sm text-zinc-400">
        Votes: {voteCount} • Banter has spoken.
      </p>
    </div>
  );
}
