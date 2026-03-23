import type { Prisma } from "@prisma/client";

import { FEED_PAGE_SIZE } from "@/lib/constants";
import { logger } from "@/lib/logger";
import { determineWinner } from "@/lib/pollLogic";
import { prisma } from "@/lib/prisma";
import { reputationChange } from "@/lib/reputation";
import type { PollCardData } from "@/lib/types";
import { incrementPollsCreated } from "@/services/userService";

type CreatePollInput = {
  creatorId: string;
  title: string;
  description?: string;
  optionA: string;
  optionB: string;
  category: string;
  durationMinutes: number;
};

type PollCardQuery = {
  id: string;
  title: string;
  optionA: string;
  optionB: string;
  category: string;
  totalA: number;
  totalB: number;
  voteCount: number;
  status: string;
  winner: string | null;
  createdAt: Date;
  endTime: Date;
  creator: {
    id: string;
    username: string;
    reputation: number;
  };
};

function mapPollCard(poll: PollCardQuery): PollCardData {
  return {
    ...poll,
    status: poll.status as PollCardData["status"],
    winner: poll.winner as PollCardData["winner"],
    createdAt: poll.createdAt.toISOString(),
    endTime: poll.endTime.toISOString()
  };
}

export async function createPoll(input: CreatePollInput) {
  const user = await prisma.user.findUnique({
    where: { id: input.creatorId }
  });

  if (!user) {
    throw new Error("User not found.");
  }

  if (user.isBanned) {
    throw new Error("This account is banned.");
  }

  const startTime = new Date();
  const endTime = new Date(startTime.getTime() + input.durationMinutes * 60000);

  const poll = await prisma.poll.create({
    data: {
      creatorId: user.id,
      category: input.category,
      title: input.title,
      description: input.description || null,
      optionA: input.optionA,
      optionB: input.optionB,
      startTime,
      endTime
    }
  });

  await incrementPollsCreated(user.id);
  logger.info({ pollId: poll.id, userId: user.id }, "poll created");
  return poll;
}

export async function getPoll(pollId: string) {
  return prisma.poll.findUnique({
    where: { id: pollId },
    include: {
      creator: true,
      votes: {
        orderBy: { createdAt: "desc" }
      },
      reports: {
        orderBy: { createdAt: "desc" }
      }
    }
  });
}

export async function listActivePolls(): Promise<PollCardData[]> {
  const polls = await prisma.poll.findMany({
    select: {
      id: true,
      title: true,
      optionA: true,
      optionB: true,
      category: true,
      totalA: true,
      totalB: true,
      voteCount: true,
      status: true,
      winner: true,
      createdAt: true,
      endTime: true,
      creator: {
        select: {
          id: true,
          username: true,
          reputation: true
        }
      }
    },
    where: {
      status: "ACTIVE"
    },
    orderBy: { createdAt: "desc" },
    take: FEED_PAGE_SIZE
  });

  return polls.map(mapPollCard);
}

export async function listRecentPolls(): Promise<PollCardData[]> {
  const polls = await prisma.poll.findMany({
    select: {
      id: true,
      title: true,
      optionA: true,
      optionB: true,
      category: true,
      totalA: true,
      totalB: true,
      voteCount: true,
      status: true,
      winner: true,
      createdAt: true,
      endTime: true,
      creator: {
        select: {
          id: true,
          username: true,
          reputation: true
        }
      }
    },
    where: {
      status: "CLOSED"
    },
    orderBy: { closedAt: "desc" },
    take: FEED_PAGE_SIZE
  });

  return polls.map(mapPollCard);
}

export async function listExpiredPolls() {
  return prisma.poll.findMany({
    where: {
      status: "ACTIVE",
      endTime: {
        lt: new Date()
      }
    }
  });
}

export async function resolvePoll(pollId: string) {
  const poll = await prisma.poll.findUnique({
    where: { id: pollId },
    include: {
      votes: true
    }
  });

  if (!poll) {
    throw new Error("Poll not found.");
  }

  if (poll.status !== "ACTIVE") {
    return poll;
  }

  const winner = determineWinner(poll.totalA, poll.totalB);

  const resolvedPoll = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const updated = await tx.poll.update({
      where: { id: poll.id },
      data: {
        winner,
        status: "CLOSED",
        closedAt: new Date()
      }
    });

    for (const vote of poll.votes) {
      const change = reputationChange(vote.aPoints, vote.bPoints, winner);

      if (change !== 0) {
        await tx.user.update({
          where: { id: vote.userId },
          data: {
            reputation: {
              increment: change
            }
          }
        });
      }
    }

    return updated;
  });

  logger.info({ pollId: poll.id, winner }, "poll resolved");
  return resolvedPoll;
}

export async function resolveExpiredPolls() {
  const polls = await listExpiredPolls();

  for (const poll of polls) {
    await resolvePoll(poll.id);
  }

  return polls.length;
}

export async function markPollRemoved(pollId: string) {
  const poll = await prisma.poll.update({
    where: { id: pollId },
    data: {
      status: "REMOVED"
    }
  });

  logger.info({ pollId }, "poll removed");
  return poll;
}

export async function deletePollByCreator(pollId: string, userId: string) {
  const poll = await prisma.poll.findUnique({
    where: { id: pollId },
    select: {
      id: true,
      creatorId: true,
      status: true,
      endTime: true
    }
  });

  if (!poll || poll.status === "REMOVED") {
    throw new Error("Poll not found.");
  }

  if (poll.creatorId !== userId) {
    throw new Error("You can only delete your own polls.");
  }

  const isClosed = poll.status === "CLOSED" || (poll.status === "ACTIVE" && poll.endTime <= new Date());

  if (!isClosed) {
    throw new Error("Only closed polls can be deleted.");
  }

  await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    await tx.report.deleteMany({
      where: { pollId }
    });

    await tx.vote.deleteMany({
      where: { pollId }
    });

    await tx.poll.delete({
      where: { id: pollId }
    });

    await tx.user.updateMany({
      where: {
        id: userId,
        pollsCreated: {
          gt: 0
        }
      },
      data: {
        pollsCreated: {
          decrement: 1
        }
      }
    });
  });

  logger.info({ pollId, userId }, "poll deleted by creator");
}
