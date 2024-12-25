import dotenv from 'dotenv';
import express from 'express';
import logger from './utils/logger';
import userRouter from './routes/users.router';
import formRouter from './routes/forms.router';
import responseRouter from './routes/responses.router';
import morgan from 'morgan';
import session from 'express-session';
import envSchema from './lib/schemas/env.schema';
import mongoose from 'mongoose';
import passport from 'passport';
import {
  strategy,
  userSerialisation,
  userDeserialisation,
} from './lib/passport';
import MongoStore from 'connect-mongo';
import errorHandler from './middlewares/error.middleware';

dotenv.config();

const app = express();
const envVars = envSchema.parse(process.env);

mongoose.connect(envVars.MONGO_URI);

passport.use(strategy);
passport.serializeUser(userSerialisation);
passport.deserializeUser(userDeserialisation);

app.use(
  morgan(':method :url :status - :response-time ms', {
    stream: { write: (message) => logger.info(message.trim()) },
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: envVars.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: envVars.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours (A day)
    },
    store: MongoStore.create({
      mongoUrl: envVars.MONGO_URI,
    }),
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use('/user', userRouter);
app.use('/form', formRouter);
app.use('/response', responseRouter);
// TODO: implement CORS functionality
// app.use(cors({}))

app.get('/', (req, res) => {
  res.status(200).json({
    Message: 'Formify is running',
    isAuthenticated: req.isAuthenticated() ? 'Yes' : 'No',
    user: req.user,
    Session: req.session,
  });
});

app.use(errorHandler);

app.listen(envVars.PORT, () =>
  console.log(
    `Formify server is running on port ${envVars.PORT} in ${envVars.NODE_ENV} mode`
  )
);
