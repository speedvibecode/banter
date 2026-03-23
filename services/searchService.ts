import { prisma } from "@/lib/prisma";

const SEARCH_LIMIT = 10;

export async function searchVisiblePolls(query: string) {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return {
      openPolls: [],
      closedPolls: []
    };
  }

  const pollWhere = {
    status: {
      not: "REMOVED" as const
    },
    OR: [
      {
        title: {
          contains: trimmedQuery,
          mode: "insensitive" as const
        }
      },
      {
        optionA: {
          contains: trimmedQuery,
          mode: "insensitive" as const
        }
      },
      {
        optionB: {
          contains: trimmedQuery,
          mode: "insensitive" as const
        }
      }
    ]
  };

  const [openPolls, closedPolls] = await Promise.all([
    prisma.poll.findMany({
      where: {
        ...pollWhere,
        status: "ACTIVE"
      },
      select: {
        id: true,
        title: true,
        optionA: true,
        optionB: true
      },
      orderBy: {
        createdAt: "desc"
      },
      take: SEARCH_LIMIT
    }),
    prisma.poll.findMany({
      where: {
        ...pollWhere,
        status: "CLOSED"
      },
      select: {
        id: true,
        title: true,
        optionA: true,
        optionB: true
      },
      orderBy: {
        closedAt: "desc"
      },
      take: SEARCH_LIMIT
    })
  ]);

  return {
    openPolls,
    closedPolls
  };
}

export async function searchUsers(query: string) {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return [];
  }

  return prisma.user.findMany({
    where: {
      username: {
        contains: trimmedQuery,
        mode: "insensitive"
      }
    },
    select: {
      id: true,
      username: true,
      reputation: true
    },
    orderBy: {
      username: "asc"
    },
    take: SEARCH_LIMIT
  });
}
