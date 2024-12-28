import { z } from 'zod';

const loginSchema = z.object({
  email: z
    .string()
    .nonempty('Email is required')
    .email('Please enter a valid email'),
  password: z
    .string()
    .nonempty('Password is required')
    .min(8, 'Password must be at least 8 characters'),
});

export type LoginType = z.infer<typeof loginSchema>;

export default loginSchema;
