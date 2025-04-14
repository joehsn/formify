import { z } from 'zod';

const fieldSchema = z.object({
  fieldLabel: z.string().trim().nonempty('Label is required'),
  fieldType: z.enum([
    'text',
    'email',
    'number',
    'radio',
    'checkbox',
    'dropdown',
    'date',
  ]),
  fieldOptions: z.array(z.string()).optional(),
  fieldRequired: z.boolean().default(false),
  fieldValidations: z
    .object({
      maxLength: z.number().optional(),
      minLength: z.number().optional(),
      pattern: z.string().optional(),
    })
    .optional(),
});

const formSchema = z.object({
  formTitle: z.string().nonempty('Title is required').trim(),
  formDesc: z.string().trim().optional(),
  formFields: fieldSchema.array().nonempty('At least one field is present'),
  formStatus: z.enum(['draft', 'published', 'closed']).default('draft'), // Enum for status
});

export type FormType = z.infer<typeof formSchema>;

export default formSchema;
