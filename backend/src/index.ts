import dotenv from "dotenv";
import express, { NextFunction, Response, Request } from "express";
import logger from "./utils/logger";
import userRouter from "./routes/users.router";
import morgan from "morgan";
import session from "express-session";
import envSchema from "./lib/schemas/env";
import mongoose from "mongoose";
import passport from "passport";
import {
  strategy,
  userSerialisation,
  userDeserialisation,
} from "./lib/passport";
import MongoStore from "connect-mongo";

dotenv.config();

const app = express();
const envVars = envSchema.parse(process.env);

mongoose.connect(envVars.MONGO_URI);

passport.use(strategy);
passport.serializeUser(userSerialisation);
passport.deserializeUser(userDeserialisation);

app.use(
  morgan(":method :url :status - :response-time ms", {
    stream: { write: (message) => logger.info(message.trim()) },
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: envVars.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: envVars.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours (A day)
    },
    store: MongoStore.create({
      mongoUrl: envVars.MONGO_URI,
    }),
  }),
);
app.use(passport.initialize());
app.use(passport.session());
app.use("/user", userRouter);
// TODO: implement CORS functionality
// app.use(cors({}))

app.get("/", (req, res) => {
  res.status(200).json({
    Message: "Formify is running",
    isAuthenticated: req.isAuthenticated() ? "Yes" : "No",
    user: req.user,
    Session: req.session,
  });
});

// no-unused-vars disable
app.use(
  (
    err: {
      status: number;
      message: string;
      stack: unknown;
    },
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const statusCode = err.status || 500;
    logger.error(`${statusCode} - ${err.message}`);
    res.status(statusCode).json({
      success: false,
      message: err.message || "Internal Server Error",
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  },
);

app.listen(envVars.PORT, () =>
  console.log(
    `Formify server is running on port ${envVars.PORT} in ${envVars.NODE_ENV} mode`,
  ),
);
