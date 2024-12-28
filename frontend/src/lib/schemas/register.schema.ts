import { z } from 'zod';

export const registerSchema = z
  .object({
    name: z.string().nonempty('Name is required').min(3),
    email: z
      .string()
      .nonempty('Email is required')
      .email('Invalid email address'),
    password: z
      .string()
      .nonempty('Password is required')
      .min(8, 'Password must be at least 8 characters'),
    confirmPassword: z
      .string()
      .nonempty('Confirm password is required')
      .min(8, 'Password must be at least 8 characters'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type RegisterType = z.infer<typeof registerSchema>;

export default registerSchema;
