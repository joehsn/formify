import { z } from 'zod';

const modes = ['development', 'test', 'production'] as const;

const envSchema = z.object({
  PORT: z
    .string({
      required_error: 'PORT environment variable is missing',
    })
    .default('5000'),
  NODE_ENV: z
    .enum(modes, {
      required_error: 'NODE_ENV environment variable is missing',
    })
    .default('development'),
  SESSION_SECRET: z
    .string({
      required_error: 'SESSION_SECRET environment variable is missing',
    })
    .default('secret'),
  MONGO_URI: z
    .string({
      required_error: 'MONGO_URI environment variable is missing',
    })
    .url('MONGO_URI is not a valid URI')
    .default('mongodb://localhost:27017/formify'),
  CLIENT_URL: z
    .string({
      required_error: 'CLIENT_URL environment variable is missing',
    })
    .url('CLIENT_URL is not a valid URI')
    .default('http://localhost:3000'),
});

export type ENVType = z.infer<typeof envSchema>;

export default envSchema;
