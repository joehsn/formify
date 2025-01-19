import { z } from 'zod';

export const responseSchema = z.object({
  formId: z
    .string({
      required_error: 'formId is required',
    })
    .uuid({ message: 'formId must be a valid UUID.' }),
  email: z
    .string({
      required_error: 'Email is required',
    })
    .email('Must be a valid email.'),
  answers: z.record(z.union([z.string(), z.string().array(), z.boolean()])),
});

export type ResponseType = z.infer<typeof responseSchema>;

export default responseSchema;
