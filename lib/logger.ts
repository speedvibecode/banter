import pino from "pino";

export const logger = pino({
  name: "banter",
  level: process.env.LOG_LEVEL ?? "info"
});
