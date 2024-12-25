import { z } from "zod";

const fieldSchema = z.object({
  label: z.string().trim().nonempty("Label is required"),
  type: z.enum([
    "text",
    "email",
    "number",
    "radio",
    "checkbox",
    "dropdown",
    "date",
  ]),
  options: z.array(z.string()).optional(),
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
  id: z.string().uuid(),
  title: z.string().nonempty("Title is required").trim(),
  description: z.string().trim().optional(),
  fields: z.array(fieldSchema).nonempty("At least one field is present"),
  status: z.enum(["draft", "published", "closed"]).default("draft"), // Enum for status
});

export type FormType = z.infer<typeof formSchema>;

export default formSchema;
