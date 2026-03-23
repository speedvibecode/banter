import { getTitleFromReputation } from "@/lib/progression";

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
  return getTitleFromReputation(reputation);
}
