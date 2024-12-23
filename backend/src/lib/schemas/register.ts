import { z } from "zod";

const userRegisterSchema = z.object({
  fullname: z.string({
    required_error: "Full Name is required",
  }),
  email: z
    .string({
      required_error: "Email is required",
    })
    .email("Invalid email"),
  password: z.string({
    required_error: "Password is required",
  }).min(6, "Password should be at least 6 characters long"),
});

export default userRegisterSchema;
