import { Flame, Sparkles, TrendingUp } from "lucide-react";

import type { ProgressionSummary } from "@/lib/progression";

type ProgressionPanelProps = {
  progression: ProgressionSummary;
  showBadges?: boolean;
  showVotes?: boolean;
};

export function ProgressionPanel({
  progression,
  showBadges = false,
  showVotes = false
}: ProgressionPanelProps) {
  return (
    <section className="section-panel grid gap-4 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="kicker">Current title</p>
          <h2 className="mt-2 font-[var(--font-space)] text-3xl font-bold uppercase tracking-[-0.05em] text-[color:var(--text)]">
            {progression.title}
          </h2>
        </div>
        <div className="text-right">
          <p className="muted-kicker">Reputation</p>
          <p className="mt-2 text-3xl font-bold text-[color:var(--primary)]">
            {progression.reputation}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3 text-[0.68rem] uppercase tracking-[0.18em] text-[color:var(--muted)]">
          <span>Progress</span>
          <span>
            {progression.nextTitle && progression.nextTitleMinReputation
              ? `${progression.nextTitle} at ${progression.nextTitleMinReputation}`
              : "Top title reached"}
          </span>
        </div>
        <div className="h-3 overflow-hidden bg-[color:var(--surface-overlay)]">
          <div
            className="h-full bg-[linear-gradient(90deg,var(--primary),var(--secondary))] transition-[width] duration-300"
            style={{ width: `${Math.round(progression.progress * 100)}%` }}
          />
        </div>
      </div>

      <div className={`grid gap-3 ${showVotes ? "sm:grid-cols-2 xl:grid-cols-3" : "sm:grid-cols-2"}`}>
        <div className="bg-surface-low px-4 py-4">
          <p className="muted-kicker">Streak</p>
          <p className="mt-2 flex items-center gap-2 text-2xl font-bold text-[color:var(--text)]">
            <Flame className="h-5 w-5 text-[color:var(--secondary)]" />
            {progression.currentStreak} day{progression.currentStreak === 1 ? "" : "s"}
          </p>
        </div>

        {showVotes ? (
          <div className="bg-surface-low px-4 py-4">
            <p className="muted-kicker">Total votes</p>
            <p className="mt-2 flex items-center gap-2 text-2xl font-bold text-[color:var(--text)]">
              <TrendingUp className="h-5 w-5 text-[color:var(--primary)]" />
              {progression.totalVotes}
            </p>
          </div>
        ) : null}

        <div className="bg-surface-low px-4 py-4">
          <p className="muted-kicker">Next step</p>
          <p className="mt-2 flex items-center gap-2 text-2xl font-bold text-[color:var(--text)]">
            <Sparkles className="h-5 w-5 text-[color:var(--primary)]" />
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
  );
}
