const PROFILE_COLORS = [
  "bg-rose-500",
  "bg-orange-500",
  "bg-amber-500",
  "bg-lime-500",
  "bg-emerald-500",
  "bg-sky-500",
  "bg-blue-500",
  "bg-indigo-500"
];

export function getProfileColor(userId: string): string {
  const hash = userId.split("").reduce((total, char) => total + char.charCodeAt(0), 0);
  return PROFILE_COLORS[hash % PROFILE_COLORS.length];
}

export function getReputationCategory(reputation: number): string {
  if (reputation >= 100) {
    return "Heavyweight";
  }

  if (reputation >= 40) {
    return "Contender";
  }

  if (reputation >= 10) {
    return "Challenger";
  }

  if (reputation >= 0) {
    return "Rookie";
  }

  return "Wildcard";
}
