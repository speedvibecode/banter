"use client";

import Link from "next/link";
import { useState } from "react";
import { Flame, Sparkles, TrendingUp } from "lucide-react";

import type { ProgressionSummary } from "@/lib/progression";

type ProgressionPanelProps = {
  compact?: boolean;
  progression: ProgressionSummary;
  showBadges?: boolean;
  showVotes?: boolean;
};

export function ProgressionPanel({
  compact = false,
  progression,
  showBadges = false,
  showVotes = false
}: ProgressionPanelProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
    <section className={`section-panel grid ${compact ? "gap-3 p-4" : "gap-4 p-5"}`}>
      <div className={compact ? "grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3" : "flex items-start justify-between gap-4"}>
        <div>
          <p className={compact ? "text-[0.52rem] font-semibold uppercase tracking-[0.26em] text-[color:var(--primary)]" : "kicker"}>Current title</p>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className={`mt-2 font-[var(--font-space)] font-bold uppercase tracking-[-0.05em] text-[color:var(--text)] transition hover:text-[color:var(--primary)] ${compact ? "text-[1.35rem]" : "text-3xl"}`}
          >
            {progression.title}
          </button>
        </div>
        <div className={compact ? "min-w-[92px]" : "text-right"}>
          <p className={compact ? "text-[0.5rem] font-semibold uppercase tracking-[0.22em] text-[color:var(--muted)]" : "muted-kicker"}>Reputation</p>
          <p className={`mt-2 font-bold text-[color:var(--primary)] ${compact ? "text-[1.35rem]" : "text-3xl"}`}>
            {progression.reputation}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <div className={`flex items-center justify-between gap-3 uppercase text-[color:var(--muted)] ${compact ? "text-[0.58rem] tracking-[0.14em]" : "text-[0.68rem] tracking-[0.18em]"}`}>
          <span>Progress</span>
          <span>
            {progression.nextTitle && progression.nextTitleMinReputation
              ? `${progression.nextTitle} at ${progression.nextTitleMinReputation}`
              : "Top title reached"}
          </span>
        </div>
        <div className={`overflow-hidden bg-[color:var(--surface-overlay)] ${compact ? "h-2" : "h-3"}`}>
          <div
            className="h-full bg-[linear-gradient(90deg,var(--primary),var(--secondary))] transition-[width] duration-300"
            style={{ width: `${Math.round(progression.progress * 100)}%` }}
          />
        </div>
      </div>

      <div className={`grid gap-3 ${showVotes && !compact ? "sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-2"}`}>
        <div className={`bg-surface-low ${compact ? "px-3 py-3" : "px-4 py-4"}`}>
          <p className="muted-kicker">Streak</p>
          <p className={`mt-2 flex items-center gap-2 font-bold text-[color:var(--text)] ${compact ? "text-lg" : "text-2xl"}`}>
            <Flame className={`${compact ? "h-4 w-4" : "h-5 w-5"} text-[color:var(--secondary)]`} />
            {progression.currentStreak} day{progression.currentStreak === 1 ? "" : "s"}
          </p>
        </div>

        {showVotes ? (
          <div className={`bg-surface-low ${compact ? "px-3 py-3" : "px-4 py-4"}`}>
            <p className="muted-kicker">Total votes</p>
            <p className={`mt-2 flex items-center gap-2 font-bold text-[color:var(--text)] ${compact ? "text-lg" : "text-2xl"}`}>
              <TrendingUp className={`${compact ? "h-4 w-4" : "h-5 w-5"} text-[color:var(--primary)]`} />
              {progression.totalVotes}
            </p>
          </div>
        ) : null}

        <div className={`bg-surface-low ${compact ? "px-3 py-3" : "px-4 py-4"}`}>
          <p className="muted-kicker">Next step</p>
          <p className={`mt-2 flex items-center gap-2 font-bold text-[color:var(--text)] ${compact ? "text-lg" : "text-2xl"}`}>
            <Sparkles className={`${compact ? "h-4 w-4" : "h-5 w-5"} text-[color:var(--primary)]`} />
            {Math.round(progression.progress * 100)}%
          </p>
        </div>
      </div>

      {showBadges ? (
        <div>
          <p className="muted-kicker">Badges</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {progression.badges.length > 0 ? (
              progression.badges.map((badge) => (
                <span key={badge} className="neon-chip status-purple">
                  {badge}
                </span>
              ))
            ) : (
              <span className="text-sm uppercase tracking-[0.16em] text-[color:var(--muted)]">
                No badges yet.
              </span>
            )}
          </div>
        </div>
      ) : null}
    </section>
      {open ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 px-4 py-6">
          <div className="shell-panel max-h-[90vh] w-full max-w-2xl overflow-y-auto p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="kicker">Reputation guide</p>
                <h2 className="mt-2 font-[var(--font-space)] text-3xl font-bold uppercase tracking-[-0.05em] text-[color:var(--text)]">
                  How reputation works
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-sm uppercase tracking-[0.16em] text-[color:var(--muted)] hover:text-[color:var(--text)]"
              >
                Close
              </button>
            </div>

            <div className="mt-6 grid gap-4">
              <div className="bg-surface-low px-4 py-4">
                <p className="kicker">What is Reputation?</p>
                <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">
                  Your reputation shows how good you are at judging arguments.
                  The better your predictions, the higher your reputation.
                </p>
              </div>
              <div className="bg-surface-low px-4 py-4">
                <p className="kicker">How do you gain reputation?</p>
                <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">
                  You earn reputation when your prediction is correct.
                  The stronger your conviction, the bigger the reward.
                </p>
              </div>
              <div className="bg-surface-low px-4 py-4">
                <p className="kicker">Can you lose reputation?</p>
                <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">
                  Yes — if your prediction is wrong, you lose reputation.
                  This keeps the system skill-based.
                </p>
              </div>
              <div className="bg-surface-low px-4 py-4">
                <p className="kicker">What are Titles?</p>
                <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">
                  Titles represent your level as a predictor.
                  As your reputation grows, your title improves:
                  Rookie → Expert → Oracle
                </p>
              </div>
              <div className="bg-surface-low px-4 py-4">
                <p className="kicker">What about streaks?</p>
                <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">
                  Voting daily builds your streak.
                  Streaks help you stay consistent and improve faster.
                </p>
              </div>
            </div>

            <Link href="/reputation" onClick={() => setOpen(false)} className="primary-cta mt-6 inline-flex">
              Learn more about reputation →
            </Link>
          </div>
        </div>
      ) : null}
    </>
  );
}
