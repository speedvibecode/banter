"use client";

import { useEffect, useRef, useState } from "react";

import { MAX_VOTE_POINTS } from "@/lib/constants";

type VoteSliderProps = {
  pollId: string;
  optionA: string;
  optionB: string;
};

export function VoteSlider({ pollId, optionA, optionB }: VoteSliderProps) {
  const [aPoints, setAPoints] = useState(50);
  const [bPoints, setBPoints] = useState(50);
  const [activeFeedback, setActiveFeedback] = useState<"a" | "b" | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const lastHapticValue = useRef({ a: 50, b: 50 });
  const feedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const remaining = MAX_VOTE_POINTS - (aPoints + bPoints);

  useEffect(() => {
    return () => {
      if (feedbackTimeoutRef.current) {
        clearTimeout(feedbackTimeoutRef.current);
      }
    };
  }, []);

  function triggerSliderFeedback(key: "a" | "b", next: number) {
    if (lastHapticValue.current[key] === next) {
      return;
    }

    lastHapticValue.current[key] = next;
    setActiveFeedback(key);

    if (feedbackTimeoutRef.current) {
      clearTimeout(feedbackTimeoutRef.current);
    }

    feedbackTimeoutRef.current = setTimeout(() => {
      setActiveFeedback((current) => (current === key ? null : current));
    }, 180);

    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(8);
    }
  }

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

  function parsePoints(value: string) {
    const parsed = Number(value);

    if (Number.isNaN(parsed)) {
      return 0;
    }

    return Math.max(0, Math.min(MAX_VOTE_POINTS, parsed));
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
    <form onSubmit={handleSubmit} className="shell-panel grid gap-6 p-6 sm:p-8">
      <div className="grid gap-6">
        <div className="bg-surface-low p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="kicker">Option A</p>
              <p className="mt-2 text-lg font-semibold uppercase tracking-[0.08em] text-[color:var(--text)]">
                {optionA}
              </p>
            </div>
            <span className="font-[var(--font-space)] text-4xl font-bold text-[color:var(--primary)]">
              <span className={activeFeedback === "a" ? "vote-value-pulse inline-block" : "inline-block"}>
                {aPoints}
              </span>
            </span>
          </div>
          <div className="mt-4">
            <label className="space-y-2">
              <span className="muted-kicker">Type points</span>
              <input
                type="number"
                min="0"
                max={MAX_VOTE_POINTS}
                inputMode="numeric"
                value={aPoints}
                onChange={(event) => updateA(parsePoints(event.target.value))}
                className="terminal-field text-base font-medium"
              />
            </label>
          </div>
          <input
            type="range"
            min="0"
            max={MAX_VOTE_POINTS}
            value={aPoints}
            onChange={(event) => {
              const next = Number(event.target.value);
              triggerSliderFeedback("a", next);
              updateA(next);
            }}
            className="vote-range vote-range-a mt-5 h-2 w-full cursor-pointer accent-[color:var(--primary)]"
          />
        </div>

        <div className="bg-surface-low p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="kicker">Option B</p>
              <p className="mt-2 text-lg font-semibold uppercase tracking-[0.08em] text-[color:var(--text)]">
                {optionB}
              </p>
            </div>
            <span className="font-[var(--font-space)] text-4xl font-bold text-[color:var(--secondary)]">
              <span className={activeFeedback === "b" ? "vote-value-pulse inline-block" : "inline-block"}>
                {bPoints}
              </span>
            </span>
          </div>
          <div className="mt-4">
            <label className="space-y-2">
              <span className="muted-kicker">Type points</span>
              <input
                type="number"
                min="0"
                max={MAX_VOTE_POINTS}
                inputMode="numeric"
                value={bPoints}
                onChange={(event) => updateB(parsePoints(event.target.value))}
                className="terminal-field text-base font-medium"
              />
            </label>
          </div>
          <input
            type="range"
            min="0"
            max={MAX_VOTE_POINTS}
            value={bPoints}
            onChange={(event) => {
              const next = Number(event.target.value);
              triggerSliderFeedback("b", next);
              updateB(next);
            }}
            className="vote-range vote-range-b mt-5 h-2 w-full cursor-pointer accent-[color:var(--secondary)]"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
        <div className="section-panel px-5 py-5">
          <p className="muted-kicker">Points remaining</p>
          <p
            className={`mt-3 font-[var(--font-space)] text-5xl font-bold ${
              remaining === 0 ? "text-[color:var(--primary)]" : "text-[color:var(--text)]"
            }`}
          >
            {remaining}
          </p>
        </div>
        <button type="submit" className="primary-cta min-w-[220px]">
          Submit Vote
        </button>
      </div>

      {status ? (
        <p className="text-sm uppercase tracking-[0.18em] text-[color:var(--muted)]">{status}</p>
      ) : null}
    </form>
  );
}
