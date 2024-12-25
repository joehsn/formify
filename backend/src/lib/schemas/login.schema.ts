import { z } from "zod";

const loginSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
    })
    .email("Invalid email"),
  password: z.string({
    required_error: "Password is required",
  }).min(6, "Password should be at least 6 characters long"),
});

export type LoginType = z.infer<typeof loginSchema>;

export default loginSchema;
