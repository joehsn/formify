import express from 'express';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import morgan from 'morgan';
import MongoStore from 'connect-mongo';
import logger from '../utils/logger';
import helmet from 'helmet';
import {
  strategy,
  userDeserialisation,
  userSerialisation,
} from '../lib/passport';
import { rateLimit } from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  // store: ... , // Redis, Memcached, etc. See below.
});

/**
 * Sets up the middlewares for the application.
 * @param app - The express application instance.
 * @param envVars - The environment variables.
 * @returns void
 */
function setupMiddlewares(
  app: express.Application,
  envVars: Record<string, string>
) {
  app.use(
    morgan(':method :url :status - :response-time ms', {
      stream: { write: (message) => logger.info(message.trim()) },
    })
  );
  app.use(limiter);
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(
    cors({
      origin: envVars.CLIENT_URL,
      credentials: true,
    })
  );
  app.use(helmet());
  app.use(
    session({
      secret: envVars.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: envVars.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      },
      store: MongoStore.create({
        mongoUrl: envVars.MONGO_URI,
      }),
    })
  );
  passport.use(strategy);
  passport.serializeUser(userSerialisation);
  passport.deserializeUser(userDeserialisation);
  app.use(passport.initialize());
  app.use(passport.session());
}

export default setupMiddlewares;
