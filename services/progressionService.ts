import { getCurrentStreak, getProgressionSummary } from "@/lib/progression";
import { prisma } from "@/lib/prisma";

export async function getUserProgression(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      reputation: true,
      pollsParticipated: true,
      votes: {
        select: {
          createdAt: true
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

  return getProgressionSummary(
    user.reputation,
    user.pollsParticipated,
    getCurrentStreak(user.votes.map((vote) => vote.createdAt))
  );
}
