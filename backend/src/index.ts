import dotenv from "dotenv";
import express from "express";
import envSchema from "./lib/schemas/env";
import logger, { logToConsole } from "./utils/logger";
import morgan from "morgan";

dotenv.config();

const app = express();

export const { PORT, NODE_ENV } = envSchema.parse(process.env);

app.use(
  morgan(":method :url :status - :response-time ms", {
    stream: { write: (message) => logger.info(message.trim()) },
  }),
);
app.use(express.json());
// TODO: implement CORS functionality
// app.use(cors({}))

if (NODE_ENV !== "production") {
  logger.add(logToConsole);
}

app.get("/", (_, res) => {
  res.status(200).json({
    Message: "Formify is running",
  });
});

app.listen(PORT, () =>
  console.log(`Formify server is running on port ${PORT} in ${NODE_ENV} mode`),
);
