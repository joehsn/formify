import { z } from "zod";

const userLoginSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
    })
    .email("Invalid email"),
  password: z.string({
    required_error: "Password is required",
  }).min(6, "Password should be at least 6 characters long"),
});

export default userLoginSchema;
