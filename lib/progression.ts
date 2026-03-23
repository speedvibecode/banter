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
  currentStreak: number;
  nextTitle: TitleName | null;
  nextTitleMinReputation: number | null;
  progress: number;
  reputation: number;
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
  currentStreak: number
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
    currentStreak,
    nextTitle: nextLevel?.title ?? null,
    nextTitleMinReputation: nextLevel?.minReputation ?? null,
    progress,
    reputation,
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

export function getCurrentStreak(voteDates: Date[], now = new Date()): number {
  if (voteDates.length === 0) {
    return 0;
  }

  const uniqueDays = Array.from(
    new Set(voteDates.map((voteDate) => voteDate.toISOString().slice(0, 10)))
  ).sort((left, right) => right.localeCompare(left));

  const today = startOfUtcDay(now);
  const yesterday = addUtcDays(today, -1);
  const latestVoteDay = parseUtcDay(uniqueDays[0]);

  if (latestVoteDay.getTime() !== today.getTime() && latestVoteDay.getTime() !== yesterday.getTime()) {
    return 0;
  }

  let streak = 1;
  let expectedDay = latestVoteDay;

  for (let index = 1; index < uniqueDays.length; index += 1) {
    expectedDay = addUtcDays(expectedDay, -1);

    if (parseUtcDay(uniqueDays[index]).getTime() !== expectedDay.getTime()) {
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
