export const MAX_VOTE_POINTS = 100;

export const POLL_DURATIONS = [
  { label: "5 minutes", minutes: 5 },
  { label: "30 minutes", minutes: 30 },
  { label: "2 hours", minutes: 120 },
  { label: "24 hours", minutes: 1440 }
] as const;

export const REPORT_REASONS = [
  "SPAM",
  "HARASSMENT",
  "ILLEGAL_CONTENT",
  "MISINFORMATION",
  "OTHER"
] as const;
