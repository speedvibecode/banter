const { execFileSync } = require("child_process");
const path = require("path");

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const migrationName = "20260320_unique_report_per_user";

function prismaBin() {
  return process.platform === "win32"
    ? path.join("node_modules", ".bin", "prisma.cmd")
    : path.join("node_modules", ".bin", "prisma");
}

async function resolveFailedMigrationIfNeeded() {
  const rows = await prisma.$queryRawUnsafe(`
    SELECT migration_name
    FROM "_prisma_migrations"
    WHERE migration_name = '${migrationName}'
      AND finished_at IS NULL
      AND rolled_back_at IS NULL
    LIMIT 1
  `);

  if (!Array.isArray(rows) || rows.length === 0) {
    return;
  }

  execFileSync(prismaBin(), ["migrate", "resolve", "--rolled-back", migrationName], {
    stdio: "inherit",
    env: process.env
  });
}

async function deleteDuplicateReports() {
  const duplicateGroups = await prisma.$queryRawUnsafe(`
    SELECT
      "pollId",
      "reporterId",
      ARRAY_AGG(id ORDER BY "createdAt" ASC, id ASC) AS ids
    FROM "Report"
    GROUP BY "pollId", "reporterId"
    HAVING COUNT(*) > 1
  `);

  if (!Array.isArray(duplicateGroups) || duplicateGroups.length === 0) {
    return;
  }

  const duplicateIds = duplicateGroups.flatMap((group) => {
    const ids = Array.isArray(group.ids) ? group.ids : [];
    return ids.slice(1);
  });

  if (duplicateIds.length === 0) {
    return;
  }

  // Keep the earliest report in each duplicate set and remove the invalid extras before adding the unique index.
  await prisma.report.deleteMany({
    where: {
      id: {
        in: duplicateIds
      }
    }
  });
}

async function main() {
  await resolveFailedMigrationIfNeeded();
  await deleteDuplicateReports();
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
