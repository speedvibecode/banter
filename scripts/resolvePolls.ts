const { logger } = require("../lib/logger");
const { resolveExpiredPolls } = require("../services/pollService");

export {};

async function main() {
  const resolvedCount = await resolveExpiredPolls();
  logger.info({ resolvedCount }, "expired polls processed");
}

main()
  .catch((error: unknown) => {
    logger.error({ error }, "poll resolution job failed");
    process.exitCode = 1;
  });
