import { Queue } from 'bullmq';
import { z } from 'zod';

const redis = z
  .object({
    REDIS_HOST: z.string().default('127.0.0.1'),
    REDIS_PORT: z.string().default('6379'),
  })
  .safeParse(process.env);

if (!redis.success) {
  throw new Error("Couldn't parse environment variables");
}

const emailQueue = new Queue('emailQueue', {
  connection: {
    host: redis.data?.REDIS_HOST,
    port: Number(redis.data?.REDIS_PORT),
  },
});

export default emailQueue;
