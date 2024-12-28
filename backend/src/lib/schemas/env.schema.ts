import { z } from 'zod';

const modes = ['development', 'test', 'production'] as const;

const envSchema = z.object({
  PORT: z.string({
    required_error: 'PORT environment variable is missing',
  }),
  NODE_ENV: z.enum(modes, {
    required_error: 'NODE_ENV environment variable is missing',
  }),
  SESSION_SECRET: z.string({
    required_error: 'SESSION_SECRET environment variable is missing',
  }),
  MONGO_URI: z
    .string({
      required_error: 'MONGO_URI environment variable is missing',
    })
    .url('MONGO_URI is not a valid URI'),
  CLIENT_URL: z
    .string({
      required_error: 'CLIENT_URL environment variable is missing',
    })
    .url('CLIENT_URL is not a valid URI'),
});

export type ENVType = z.infer<typeof envSchema>;

export default envSchema;
