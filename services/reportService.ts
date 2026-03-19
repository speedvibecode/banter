import { logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import { markPollRemoved } from "@/services/pollService";
import { banUser } from "@/services/userService";
import { Prisma } from "@prisma/client";

type ReportInput = {
  reporterId: string;
  pollId: string;
  reason: "SPAM" | "HARASSMENT" | "ILLEGAL_CONTENT" | "MISINFORMATION" | "OTHER";
  notes?: string;
};

export class DuplicateReportError extends Error {
  constructor() {
    super("You have already reported this poll.");
    this.name = "DuplicateReportError";
  }
}

export async function createReport(input: ReportInput) {
  const [user, poll] = await Promise.all([
    prisma.user.findUnique({
      where: { id: input.reporterId }
    }),
    prisma.poll.findUnique({
      where: { id: input.pollId },
      select: { id: true, status: true }
    })
  ]);

  if (!user) {
    throw new Error("User not found.");
  }

  if (!poll || poll.status === "REMOVED") {
    throw new Error("Poll not found.");
  }

  try {
    // The unique pair prevents duplicate reports even if the same user double-submits quickly.
    const report = await prisma.report.create({
      data: {
        pollId: input.pollId,
        reporterId: user.id,
        reason: input.reason,
        notes: input.notes || null
      }
    });

    logger.info({ pollId: input.pollId, reportId: report.id }, "report submitted");
    return report;
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new DuplicateReportError();
    }

    throw error;
  }
}

export async function listReports() {
  return prisma.report.findMany({
    include: {
      poll: {
        include: {
          creator: true
        }
      },
      reporter: true
    },
    orderBy: { createdAt: "desc" }
  });
}

export async function reviewReport(reportId: string) {
  return prisma.report.update({
    where: { id: reportId },
    data: {
      status: "REVIEWED"
    }
  });
}

export async function resolveReport(reportId: string, removePoll: boolean) {
  const report = await prisma.report.findUnique({
    where: { id: reportId }
  });

  if (!report) {
    throw new Error("Report not found.");
  }

  if (removePoll) {
    await markPollRemoved(report.pollId);
  }

  return prisma.report.update({
    where: { id: reportId },
    data: {
      status: "RESOLVED"
    }
  });
}

export async function removePollAndBanUser(reportId: string) {
  const report = await prisma.report.findUnique({
    where: { id: reportId },
    include: {
      poll: true
    }
  });

  if (!report) {
    throw new Error("Report not found.");
  }

  await markPollRemoved(report.pollId);
  await banUser(report.poll.creatorId);

  return prisma.report.update({
    where: { id: reportId },
    data: {
      status: "RESOLVED"
    }
  });
}
