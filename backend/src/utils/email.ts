import path from 'path';
import ejs from 'ejs';
import { Worker } from 'bullmq';
import { z } from 'zod';
import nodemailer from 'nodemailer';
import dotenv from "dotenv"
import logger from './logger';

dotenv.config();

const envVars = z
  .object({
    SMTP_HOST: z.string(),
    SMTP_PORT: z.string(),
    SMTP_USERNAME: z.string(),
    SMTP_PASSWORD: z.string(),
    USER_EMAIL: z.string(),
    REDIS_HOST: z.string().default('127.0.0.1'),
    REDIS_PORT: z.string().default('6379'),
  })
  .safeParse(process.env);

if (!envVars.success) {
  throw new Error("Couldn't parse environment variables");
}

const transporter = nodemailer.createTransport({
  auth: {
    user: envVars.data.SMTP_USERNAME,
    pass: envVars.data.SMTP_PASSWORD,
  },
  host: envVars.data.SMTP_HOST,
  port: Number(envVars.data.SMTP_PORT),
  secure: false,
} as nodemailer.TransportOptions);

const emailWorker = new Worker(
  'emailQueue',
  async (job) => {
    const { name, email, resetLink } = job.data;
    const emailTemplate = await ejs.renderFile(
      path.join(__dirname, '..', 'views', 'email.ejs'),
      {
        name,
        resetLink,
      }
    );
    await transporter.sendMail({
      from: envVars.data.USER_EMAIL,
      to: email,
      subject: 'Password Reset',
      html: emailTemplate,
    });
    logger.log('info', `Email sent to ${email}`);
  },
  {
    connection: {
      host: envVars.data.REDIS_HOST,
      port: Number(envVars.data.REDIS_PORT),
    },
  }
);

export default emailWorker;
