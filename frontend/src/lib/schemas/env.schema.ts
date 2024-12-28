import { z } from 'zod';

export const envSchema = z.object({
  VITE_API_URL: z
    .string({
      required_error: 'API_URL is required',
    })
    .url('Invalid URL')
    .default('http://localhost:5000'),
});
