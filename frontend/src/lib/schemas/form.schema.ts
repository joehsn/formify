import { z } from 'zod';

export const fieldSchema = z.object({
  _id: z.string(),
  label: z.string().trim().nonempty('Label is required'),
  type: z.enum([
    'text',
    'email',
    'number',
    'radio',
    'checkbox',
    'dropdown',
    'date',
  ]),
  options: z.string().array().optional(),
  required: z.boolean().default(false),
  validations: z
    .object({
      maxLength: z.number().optional(),
      minLength: z.number().optional(),
      pattern: z.string().optional(),
    })
    .optional(),
});

const formSchema = z.object({
  title: z.string().nonempty('Title is required').trim(),
  description: z.string().trim().optional(),
  fields: fieldSchema.array().nonempty('At least one field is present'),
  status: z.enum(['draft', 'published', 'closed']).default('draft'), // Enum for status
});

export default formSchema;
