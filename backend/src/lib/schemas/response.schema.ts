import { z } from 'zod';

const fieldSchema = z.object({
  fieldId: z.string().nonempty({ message: 'fieldId is required.' }), // Ensures fieldId is not empty
  value: z
    .union([z.string(), z.number(), z.boolean(), z.date(), z.array(z.string())])
    .optional(),
});

export const responseSchema = z.object({
  responseId: z
    .string({
      required_error: 'responseId is required',
    })
    .uuid('responseId must be a valid UUID.')
    .optional(),
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
  answers: z
    .array(fieldSchema)
    .nonempty({ message: 'answers must contain at least one field.' }),
});

export type ResponseType = z.infer<typeof responseSchema>;

export default responseSchema;
