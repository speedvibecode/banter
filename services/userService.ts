import { prisma } from "@/lib/prisma";

type IdentityInput = {
  username: string;
  email: string;
};

export async function findOrCreateUser(identity: IdentityInput) {
  const email = identity.email.trim().toLowerCase();
  const baseUsername = identity.username.trim();

  const existing = await prisma.user.findUnique({
    where: { email }
  });

  if (existing) {
    return existing;
  }

  let username = baseUsername;
  let suffix = 1;

  while (await prisma.user.findUnique({ where: { username } })) {
    suffix += 1;
    username = `${baseUsername}${suffix}`;
  }

  return prisma.user.create({
    data: {
      email,
      username
    }
  });
}

export async function getUser(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      reputation: true,
      pollsCreated: true,
      pollsParticipated: true,
      polls: {
        select: {
          id: true,
          title: true,
          status: true,
          createdAt: true
        },
        orderBy: { createdAt: "desc" },
        take: 3
      },
      votes: {
        select: {
          id: true,
          createdAt: true,
          poll: {
            select: {
              id: true,
              title: true,
              status: true
            }
          }
        },
        orderBy: { createdAt: "desc" },
        take: 3
      }
    }
  });
}

export async function incrementPollsCreated(userId: string) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      pollsCreated: {
        increment: 1
      }
    }
  });
}

export async function incrementPollsParticipated(userId: string) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      pollsParticipated: {
        increment: 1
      }
    }
  });
}

export async function updateReputation(userId: string, change: number) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      reputation: {
        increment: change
      }
    }
  });
}

export async function banUser(userId: string) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      isBanned: true
    }
  });
}
