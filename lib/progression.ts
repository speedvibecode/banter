export const TITLE_LEVELS = [
  { title: "Rookie", minReputation: 0 },
  { title: "Learner", minReputation: 50 },
  { title: "Debater", minReputation: 150 },
  { title: "Analyst", minReputation: 300 },
  { title: "Strategist", minReputation: 600 },
  { title: "Expert", minReputation: 1000 },
  { title: "Master", minReputation: 2000 },
  { title: "Oracle", minReputation: 4000 }
] as const;

export type TitleName = (typeof TITLE_LEVELS)[number]["title"];

export type ProgressionSummary = {
  badges: string[];
  correctPredictionStreak: number;
  currentStreak: number;
  nextTitle: TitleName | null;
  nextTitleMinReputation: number | null;
  progress: number;
  reputation: number;
  streakProtected: boolean;
  title: TitleName;
  titleMinReputation: number;
  totalVotes: number;
};

export function getTitleFromReputation(reputation: number): TitleName {
  for (let index = TITLE_LEVELS.length - 1; index >= 0; index -= 1) {
    if (reputation >= TITLE_LEVELS[index].minReputation) {
      return TITLE_LEVELS[index].title;
    }
  }

  return TITLE_LEVELS[0].title;
}

export function getTitleIndex(title: TitleName): number {
  return TITLE_LEVELS.findIndex((level) => level.title === title);
}

export function getProgressionSummary(
  reputation: number,
  totalVotes: number,
  currentStreak: number,
  options?: {
    correctPredictionStreak?: number;
    streakProtected?: boolean;
  }
): ProgressionSummary {
  const currentIndex = TITLE_LEVELS.findLastIndex((level) => reputation >= level.minReputation);
  const currentLevel = TITLE_LEVELS[Math.max(0, currentIndex)];
  const nextLevel = TITLE_LEVELS[currentIndex + 1] ?? null;
  const progress = nextLevel
    ? Math.max(
        0,
        Math.min(
          1,
          (reputation - currentLevel.minReputation) / (nextLevel.minReputation - currentLevel.minReputation)
        )
      )
    : 1;

  return {
    badges: getBadges(totalVotes),
    correctPredictionStreak: options?.correctPredictionStreak ?? 0,
    currentStreak,
    nextTitle: nextLevel?.title ?? null,
    nextTitleMinReputation: nextLevel?.minReputation ?? null,
    progress,
    reputation,
    streakProtected: options?.streakProtected ?? false,
    title: currentLevel.title,
    titleMinReputation: currentLevel.minReputation,
    totalVotes
  };
}

export function getBadges(totalVotes: number): string[] {
  const badges: string[] = [];

  if (totalVotes >= 100) {
    badges.push("Active");
  }

  if (totalVotes >= 500) {
    badges.push("Committed");
  }

  if (totalVotes >= 1000) {
    badges.push("Banter Addict");
  }

  return badges;
}

export function getCurrentStreak(voteDates: Date[], now = new Date()): { count: number; protectedByGrace: boolean } {
  if (voteDates.length === 0) {
    return { count: 0, protectedByGrace: false };
  }

  const uniqueDays = Array.from(
    new Set(voteDates.map((voteDate) => voteDate.toISOString().slice(0, 10)))
  ).sort((left, right) => right.localeCompare(left));

  const today = startOfUtcDay(now);
  const latestVoteDay = parseUtcDay(uniqueDays[0]);
  const dayGap = dayDifference(today, latestVoteDay);

  if (dayGap > 2) {
    return { count: 0, protectedByGrace: false };
  }

  let streak = 1;
  let previousDay = latestVoteDay;

  for (let index = 1; index < uniqueDays.length; index += 1) {
    const nextDay = parseUtcDay(uniqueDays[index]);
    const gap = dayDifference(previousDay, nextDay);

    if (gap > 2) {
      break;
    }

    streak += 1;
    previousDay = nextDay;
  }

  return {
    count: streak,
    protectedByGrace: dayGap === 2
  };
}

export function getCorrectPredictionStreak(
  results: Array<{ aPoints: number; bPoints: number; winner: "A" | "B" | null }>
): number {
  let streak = 0;

  for (const result of results) {
    if (!result.winner) {
      continue;
    }

    const isCorrect =
      result.winner === "A" ? result.aPoints > result.bPoints : result.bPoints > result.aPoints;

    if (!isCorrect) {
      break;
    }

    streak += 1;
  }

  return streak;
}

function startOfUtcDay(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

function addUtcDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
}

function parseUtcDay(day: string): Date {
  return new Date(`${day}T00:00:00.000Z`);
}

function dayDifference(left: Date, right: Date): number {
  return Math.round((left.getTime() - right.getTime()) / (24 * 60 * 60 * 1000));
}
