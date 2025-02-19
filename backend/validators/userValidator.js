const { z } = require("zod");

exports.loginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Invalid email format" }),

  password: z
    .string({ required_error: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters long" }),
});

exports.signupSchema = z.object({
  username: z
    .string({ required_error: "Username is required" })
    .min(3, { message: "Username must be at least 3 characters long" })
    .max(20, { message: "Username must not exceed 20 characters" }),

  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Invalid email format" }),

  password: z
    .string({ required_error: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters long" }),
});

exports.changePasswordSchema = z.object({
  currentPassword: z.string().trim().min(6, "Current password is required"),
  newPassword: z
    .string()
    .trim()
    .min(6, "New password must be at least 6 characters long"),
});

exports.forgotPasswordSchema = z.object({
  newPassword: z
    .string()
    .trim()
    .min(6, "New password must be at least 6 characters long"),
});
