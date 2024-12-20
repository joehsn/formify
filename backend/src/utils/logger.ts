import winston from "winston";

const logger = winston.createLogger({
  level: "info",
  //format: winston.format.json(),
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
    }),
  ),
  defaultMeta: { service: "formify-log" },
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "server.log" }),
  ],
});

export const logToConsole = new winston.transports.Console({
  format: winston.format.simple(),
});

export default logger;
