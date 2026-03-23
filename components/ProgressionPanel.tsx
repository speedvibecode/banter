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
  return (
    <section className={`section-panel grid ${compact ? "gap-3 p-4" : "gap-4 p-5"}`}>
      <div className={compact ? "grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3" : "flex items-start justify-between gap-4"}>
        <div>
          <p className={compact ? "text-[0.52rem] font-semibold uppercase tracking-[0.26em] text-[color:var(--primary)]" : "kicker"}>Current title</p>
          <h2 className={`mt-2 font-[var(--font-space)] font-bold uppercase tracking-[-0.05em] text-[color:var(--text)] ${compact ? "text-[1.35rem]" : "text-3xl"}`}>
            {progression.title}
          </h2>
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
  );
}
