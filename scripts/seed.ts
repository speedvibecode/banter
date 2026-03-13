const { hash } = require("bcryptjs");
const fs = require("fs");
const path = require("path");
const { prisma } = require("../lib/prisma");

export {};

function loadEnvFile() {
  const envPath = path.join(process.cwd(), ".env");

  if (!fs.existsSync(envPath)) {
    return;
  }

  const raw = fs.readFileSync(envPath, "utf8");

  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    let value = trimmed.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith("\"") && value.endsWith("\"")) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

async function main() {
  loadEnvFile();
  const passwordHash = await hash("banterdemo123", 12);

  const demoUser = await prisma.user.upsert({
    where: { email: "demo@banter.app" },
    update: {},
    create: {
      username: "banterdemo",
      email: "demo@banter.app",
      passwordHash,
      reputation: 128
    }
  });

  const existingPolls = await prisma.poll.count();

  if (existingPolls > 0) {
    return;
  }

  const now = new Date();

  await prisma.poll.createMany({
    data: [
      {
        creatorId: demoUser.id,
        category: "campus",
        title: "Should university fests have a hard 11 PM end time?",
        description:
          "Security and noise complaints versus student freedom and nightlife.",
        optionA: "Yes, hard stop",
        optionB: "No, extend later",
        startTime: now,
        endTime: new Date(now.getTime() + 2 * 60 * 60 * 1000),
        totalA: 220,
        totalB: 310,
        voteCount: 14,
        status: "ACTIVE"
      },
      {
        creatorId: demoUser.id,
        category: "food",
        title: "Is the campus canteen underrated?",
        description:
          "Price, convenience, and nostalgia against quality complaints.",
        optionA: "Yes, underrated",
        optionB: "No, criticism is fair",
        startTime: now,
        endTime: new Date(now.getTime() + 30 * 60 * 1000),
        totalA: 180,
        totalB: 140,
        voteCount: 9,
        status: "ACTIVE"
      }
    ]
  });
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
