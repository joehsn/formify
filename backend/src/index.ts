import dotenv from 'dotenv';
import express from 'express';
import envSchema from './lib/schemas/env.schema';
import mongoose from 'mongoose';
import errorHandler from './middlewares/error.middleware';
import { userRouter, formRouter, responseRouter } from './routes';
import setupMiddlewares from './middlewares';
import logger from './utils/logger';
import { exit } from 'process';

dotenv.config();

const app = express();
const envVars = envSchema.parse(process.env);

(async () => {
  try {
    await mongoose.connect(envVars.MONGO_URI);
    console.log('Connected to the database successfully.');
  } catch (error) {
    console.error('Database connection failed:', error);
    exit(1); // Exit process on failure
  }
})();

setupMiddlewares(app, envVars);

app.use('/users', userRouter);
app.use('/forms', formRouter);
app.use('/responses', responseRouter);

app.get('/', (_req, res) => {
  res.status(200).json({
    Message: 'Formify is running',
  });
});

app.use(errorHandler);

const server = app.listen(envVars.PORT, () =>
  console.log(
    `Formify server is running on port ${envVars.PORT} in ${envVars.NODE_ENV} mode`
  )
);

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
  logger.error('Unhandled Rejection:', reason);
  process.exit(1);
});

process.on('SIGINT', async () => {
  console.log('Shutting down server...');
  await mongoose.disconnect();
  server.close(() => {
    console.log('Server shut down gracefully.');
    process.exit(0);
  });
});

process.on('SIGTERM', async () => {
  console.log('Received termination signal. Closing resources...');
  await mongoose.disconnect();
  server.close(() => {
    console.log('Server terminated.');
    process.exit(0);
  });
});
