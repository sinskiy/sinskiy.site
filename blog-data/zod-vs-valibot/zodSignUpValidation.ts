const start = performance.now();

import { z } from "zod/v4";
import { registeredEmails } from "./const";

const PasswordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .regex(/[a-zA-Z]/, "Password must contain at least one letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(
    /[^a-zA-Z0-9]/,
    "Password must contain at least one special character"
  );

const Schema = z
  .object({
    email: z
      .email()
      .refine(
        (email) => !registeredEmails.includes(email.toLowerCase()),
        "Email is already in use"
      ),
    username: z.string().min(2, "Username must be at least 2 characters long"),
    password: PasswordSchema,
    confirmPassword: PasswordSchema,
  })
  .refine(
    ({ password, confirmPassword }) => password === confirmPassword,
    "Passwords don't match"
  );
console.log(Schema);
const end = performance.now();
console.log("sign up schema created", end - start);

const startParse = performance.now();
const errorResult = Schema.safeParse({
  email: "dimasinskiy@gmail.com",
  username: "sinskiy",
  password: "totallyrandompassword!42",
  confirmPassword: "totallyrandompassword!42",
});
const result = Schema.safeParse({
  email: "main@sinskiy.site",
  username: "sinskiy",
  password: "totallyrandompassword!42",
  confirmPassword: "totallyrandompassword!42",
});
console.log(errorResult, result);
const endParse = performance.now();
console.log("sign up schema parsed", endParse - startParse);
