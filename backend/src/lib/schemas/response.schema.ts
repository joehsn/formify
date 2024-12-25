import { z } from 'zod';

const fieldSchema = z.object({
  fieldId: z.string().nonempty({ message: 'fieldId is required.' }), // Ensures fieldId is not empty
  value: z
    .union([z.string(), z.number(), z.boolean(), z.date(), z.array(z.string())])
    .optional(), // Allows multiple types for flexibility in answers
});

export const responseSchema = z.object({
  formId: z
    .string({
      required_error: 'formId is required',
    })
    .uuid({ message: 'formId must be a valid UUID.' }), // Validates UUID format
  email: z
    .string({
      required_error: 'Email is required',
    })
    .email('Must be a valid email.'),
  answers: z
    .array(fieldSchema)
    .nonempty({ message: 'answers must contain at least one field.' }), // Ensures at least one answer is provided
});

export type ResponseType = z.infer<typeof responseSchema>;

export default responseSchema;
