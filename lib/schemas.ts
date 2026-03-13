import { z } from "zod";

import { MAX_VOTE_POINTS, POLL_DURATIONS, REPORT_REASONS } from "@/lib/constants";

export const identitySchema = z.object({
  username: z.string().trim().min(2).max(30),
  email: z.string().trim().email()
});

export const createPollSchema = z.object({
  title: z.string().trim().min(5).max(200),
  description: z.string().trim().max(500).optional().or(z.literal("")),
  optionA: z.string().trim().min(1).max(100),
  optionB: z.string().trim().min(1).max(100),
  category: z.string().trim().min(2).max(50),
  durationMinutes: z
    .number()
    .int()
    .refine(
      (value) => POLL_DURATIONS.some((duration) => duration.minutes === value),
      "Invalid duration"
    )
});

export const voteSchema = z
  .object({
    pollId: z.string().uuid(),
    aPoints: z.number().int().min(0).max(MAX_VOTE_POINTS),
    bPoints: z.number().int().min(0).max(MAX_VOTE_POINTS)
  })
  .refine((value) => value.aPoints + value.bPoints <= MAX_VOTE_POINTS, {
    message: "A_points + B_points must be <= 100",
    path: ["aPoints"]
  });

export const reportSchema = z.object({
  pollId: z.string().uuid(),
  reason: z.enum(REPORT_REASONS),
  notes: z.string().trim().max(500).optional().or(z.literal(""))
});

export const moderationActionSchema = z.object({
  reportId: z.string().uuid(),
  action: z.enum(["ignore", "remove"])
});
