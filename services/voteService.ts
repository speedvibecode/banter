import type { Prisma } from "@prisma/client";

import { logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import { calculateExposure } from "@/lib/reputation";

type VoteInput = {
  userId: string;
  pollId: string;
  aPoints: number;
  bPoints: number;
};

export async function validateVote(input: VoteInput) {
  const poll = await prisma.poll.findUnique({
    where: { id: input.pollId }
  });

  if (!poll) {
    throw new Error("Poll not found.");
  }

  if (poll.status !== "ACTIVE") {
    throw new Error("Poll is not active.");
  }

  if (poll.endTime <= new Date()) {
    throw new Error("Poll has already expired.");
  }

  const user = await prisma.user.findUnique({
    where: { id: input.userId }
  });

  if (!user) {
    throw new Error("User not found.");
  }

  if (user.isBanned) {
    throw new Error("This account is banned.");
  }

  const existingVote = await prisma.vote.findUnique({
    where: {
      userId_pollId: {
        userId: input.userId,
        pollId: input.pollId
      }
    }
  });

  if (existingVote) {
    throw new Error("You have already voted on this poll.");
  }

  return { poll, user };
}

export async function submitVote(input: VoteInput) {
  const { user } = await validateVote(input);
  const exposure = calculateExposure(input.aPoints, input.bPoints);

  const vote = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const createdVote = await tx.vote.create({
      data: {
        userId: user.id,
        pollId: input.pollId,
        aPoints: input.aPoints,
        bPoints: input.bPoints,
        exposure
      }
    });

    await tx.poll.update({
      where: { id: input.pollId },
      data: {
        totalA: {
          increment: input.aPoints
        },
        totalB: {
          increment: input.bPoints
        },
        voteCount: {
          increment: 1
        }
      }
    });

    await tx.user.update({
      where: { id: user.id },
      data: {
        pollsParticipated: {
          increment: 1
        }
      }
    });

    return createdVote;
  });

  logger.info({ pollId: input.pollId, userId: user.id }, "vote submitted");
  return vote;
}

export async function updatePollTotals(
  pollId: string,
  aPoints: number,
  bPoints: number
) {
  return prisma.poll.update({
    where: { id: pollId },
    data: {
      totalA: {
        increment: aPoints
      },
      totalB: {
        increment: bPoints
      },
      voteCount: {
        increment: 1
      }
    }
  });
}
