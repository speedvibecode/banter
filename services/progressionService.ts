import { getCorrectPredictionStreak, getCurrentStreak, getProgressionSummary } from "@/lib/progression";
import { prisma } from "@/lib/prisma";

export async function getUserProgression(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      reputation: true,
      pollsParticipated: true,
      votes: {
        select: {
          aPoints: true,
          bPoints: true,
          createdAt: true,
          poll: {
            select: {
              status: true,
              winner: true
            }
          }
        },
        orderBy: {
          createdAt: "desc"
        },
        take: 365
      }
    }
  });

  if (!user) {
    return null;
  }

  const streak = getCurrentStreak(user.votes.map((vote) => vote.createdAt));
  const correctPredictionStreak = getCorrectPredictionStreak(
    user.votes
      .filter((vote) => vote.poll.status === "CLOSED")
      .map((vote) => ({
        aPoints: vote.aPoints,
        bPoints: vote.bPoints,
        winner: vote.poll.winner as "A" | "B" | null
      }))
  );

  return getProgressionSummary(
    user.reputation,
    user.pollsParticipated,
    streak.count,
    {
      correctPredictionStreak,
      streakProtected: streak.protectedByGrace
    }
  );
}
