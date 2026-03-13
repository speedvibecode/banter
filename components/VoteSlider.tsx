"use client";

import { useState } from "react";

import { MAX_VOTE_POINTS } from "@/lib/constants";

type VoteSliderProps = {
  pollId: string;
  optionA: string;
  optionB: string;
};

export function VoteSlider({ pollId, optionA, optionB }: VoteSliderProps) {
  const [aPoints, setAPoints] = useState(50);
  const [bPoints, setBPoints] = useState(50);
  const [status, setStatus] = useState<string | null>(null);
  const remaining = MAX_VOTE_POINTS - (aPoints + bPoints);

  function updateA(next: number) {
    const cappedB = Math.min(bPoints, MAX_VOTE_POINTS - next);
    setAPoints(next);
    setBPoints(cappedB);
  }

  function updateB(next: number) {
    const cappedA = Math.min(aPoints, MAX_VOTE_POINTS - next);
    setBPoints(next);
    setAPoints(cappedA);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Submitting vote...");

    const response = await fetch("/api/polls/vote", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        pollId,
        aPoints,
        bPoints
      })
    });

    const result = (await response.json()) as { error?: string };

    if (!response.ok) {
      setStatus(result.error ?? "Vote failed.");
      return;
    }

    setStatus("Vote submitted. Refresh to see the updated totals.");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5"
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm text-zinc-300">
          <span>{optionA}</span>
          <span className="font-semibold text-blue-400">{aPoints}</span>
        </div>
        <input
          type="range"
          min="0"
          max={MAX_VOTE_POINTS}
          value={aPoints}
          onChange={(event) => updateA(Number(event.target.value))}
          className="h-3 w-full cursor-pointer accent-blue-500"
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm text-zinc-300">
          <span>{optionB}</span>
          <span className="font-semibold text-orange-400">{bPoints}</span>
        </div>
        <input
          type="range"
          min="0"
          max={MAX_VOTE_POINTS}
          value={bPoints}
          onChange={(event) => updateB(Number(event.target.value))}
          className="h-3 w-full cursor-pointer accent-orange-500"
        />
      </div>

      <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3">
        <span className="text-sm text-zinc-300">Points remaining</span>
        <span
          className={`text-lg font-bold ${
            remaining === 0 ? "text-green-400" : "text-zinc-100"
          }`}
        >
          {remaining}
        </span>
      </div>

      <button
        type="submit"
        className="w-full rounded-lg bg-blue-500 px-4 py-3 font-semibold text-white transition hover:bg-blue-600"
      >
        Submit Vote
      </button>

      {status ? <p className="text-sm text-zinc-400">{status}</p> : null}
    </form>
  );
}
