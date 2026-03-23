import { CheckCircle2, Flame, Sparkles, XCircle } from "lucide-react";

import { getProgressionSummary, getTitleFromReputation, type ProgressionSummary } from "@/lib/progression";
import { calculateExposure, reputationChange } from "@/lib/reputation";

type ResultFeedbackCardProps = {
  aPoints: number;
  bPoints: number;
  currentProgression: ProgressionSummary;
  winner: "A" | "B";
};

function getConvictionLabel(exposure: number) {
  const strength = Math.abs(exposure);

  if (strength > 40) {
    return "High conviction";
  }

  if (strength >= 15) {
    return "Strong call";
  }

  return "Safe pick";
}

function pickMessage(seed: string, options: string[]) {
  const hash = seed.split("").reduce((total, char) => total + char.charCodeAt(0), 0);
  return options[Math.abs(hash) % options.length];
}

export function ResultFeedbackCard({
  aPoints,
  bPoints,
  currentProgression,
  winner
}: ResultFeedbackCardProps) {
  const delta = reputationChange(aPoints, bPoints, winner);
  const wasCorrect = delta >= 0;
  const signedDelta = delta >= 0 ? `+${delta}` : `${delta}`;
  const exposure = calculateExposure(aPoints, bPoints);
  const previousReputation = currentProgression.reputation - delta;
  const previousProgression = getProgressionSummary(
    previousReputation,
    currentProgression.totalVotes,
    currentProgression.currentStreak,
    {
      correctPredictionStreak: Math.max(0, currentProgression.correctPredictionStreak - (wasCorrect ? 1 : 0)),
      streakProtected: currentProgression.streakProtected
    }
  );
  const titleChanged = getTitleFromReputation(previousReputation) !== currentProgression.title;
  const progressThreshold = currentProgression.nextTitleMinReputation ?? currentProgression.reputation;
  const messageSeed = `${winner}-${aPoints}-${bPoints}-${currentProgression.reputation}`;
  const positiveMessage = pickMessage(messageSeed, [
    "Strong prediction!",
    "Perfect call!",
    "Sharp judgment!",
    "Well played!"
  ]);
  const supportiveMessage = pickMessage(messageSeed, [
    "Better luck next time",
    "Tough call - keep going",
    "You'll get the next one",
    "Close one - stay sharp"
  ]);
  const identityMessage = pickMessage(`${messageSeed}-identity`, [
    "You're becoming a strong predictor",
    "Your judgment is improving",
    "Nice consistency"
  ]);
  const showIdentityMessage =
    wasCorrect ||
    Math.abs(`${messageSeed}-identity`.split("").reduce((total, char) => total + char.charCodeAt(0), 0)) % 5 === 0;
  const isNearMiss = !wasCorrect && Math.abs(exposure) < 10;
  const momentumActive = currentProgression.correctPredictionStreak >= 3;

  return (
    <section className="shell-panel grid gap-5 px-6 py-6 sm:px-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="kicker">Your feedback</p>
          <h2
            className={`mt-2 flex items-center gap-2 text-2xl font-bold uppercase tracking-[0.08em] ${
              wasCorrect ? "text-[color:var(--primary)]" : "text-red-400"
            }`}
          >
            {wasCorrect ? <CheckCircle2 className="h-6 w-6" /> : <XCircle className="h-6 w-6" />}
            {wasCorrect ? "Correct prediction" : "Incorrect prediction"}
          </h2>
          <p className="mt-2 text-sm uppercase tracking-[0.16em] text-[color:var(--muted)]">
            {wasCorrect ? positiveMessage : supportiveMessage}
          </p>
          {isNearMiss ? (
            <p className="mt-2 text-sm uppercase tracking-[0.16em] text-[color:var(--muted)]">
              Close call. You almost got it.
            </p>
          ) : null}
          {momentumActive && wasCorrect ? (
            <p className="mt-2 text-sm uppercase tracking-[0.16em] text-[color:var(--primary)]">
              You&apos;re on a roll!
            </p>
          ) : null}
          {showIdentityMessage ? (
            <p className="mt-2 text-sm uppercase tracking-[0.16em] text-[color:var(--muted)]">
              {identityMessage}
            </p>
          ) : null}
        </div>
        <div className="section-panel min-w-[180px] px-5 py-4 text-right">
          <p className="muted-kicker">Reputation change</p>
          <p className={`mt-2 text-3xl font-bold ${wasCorrect ? "text-[color:var(--primary)]" : "text-red-400"}`}>
            {signedDelta}
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-surface-low px-4 py-4">
          <p className="muted-kicker">Conviction</p>
          <p className="mt-2 text-xl font-bold text-[color:var(--text)]">{getConvictionLabel(exposure)}</p>
        </div>
        <div className="bg-surface-low px-4 py-4">
          <p className="muted-kicker">Prediction split</p>
          <p className="mt-2 text-xl font-bold text-[color:var(--text)]">
            {aPoints} / {bPoints}
          </p>
        </div>
        <div className="bg-surface-low px-4 py-4">
          <p className="muted-kicker">Streak</p>
          <p className="mt-2 flex items-center gap-2 text-xl font-bold text-[color:var(--text)]">
            <Flame className="h-5 w-5 text-[color:var(--secondary)]" />
            {currentProgression.currentStreak} day{currentProgression.currentStreak === 1 ? "" : "s"}
          </p>
          {currentProgression.streakProtected ? (
            <p className="mt-2 text-xs uppercase tracking-[0.16em] text-[color:var(--muted)]">
              Grace day protected
            </p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="muted-kicker">Progress</p>
          <p className="text-sm uppercase tracking-[0.16em] text-[color:var(--muted)]">
            {previousReputation} to {currentProgression.reputation}
            {currentProgression.nextTitle ? ` / ${progressThreshold}` : " / Top title"}
          </p>
        </div>
        <div className="h-3 overflow-hidden bg-[color:var(--surface-overlay)]">
          <div
            className="h-full bg-[linear-gradient(90deg,var(--primary),var(--secondary))]"
            style={{ width: `${Math.round(currentProgression.progress * 100)}%` }}
          />
        </div>
        <p className="text-sm uppercase tracking-[0.16em] text-[color:var(--muted)]">
          {previousProgression.title} to {currentProgression.title}
        </p>
      </div>

      {titleChanged ? (
        <div className="section-panel flex items-center gap-3 px-5 py-4">
          <Sparkles className="h-5 w-5 text-[color:var(--primary)]" />
          <div>
            <p className="kicker">Title upgraded!</p>
            <p className="mt-1 text-sm font-semibold uppercase tracking-[0.08em] text-[color:var(--text)]">
              You are now {currentProgression.title}
            </p>
          </div>
        </div>
      ) : null}
    </section>
  );
}
