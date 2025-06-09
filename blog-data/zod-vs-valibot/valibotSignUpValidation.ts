const start = performance.now();

import { registeredEmails } from "./const";
import {
  check,
  email,
  forward,
  minLength,
  object,
  partialCheck,
  pipe,
  regex,
  safeParse,
  string,
} from "valibot";

const PasswordSchema = pipe(
  string(),
  minLength(8, "Password must be at least 8 characters long"),
  regex(/[a-zA-Z]/, "Password must contain at least one letter"),
  regex(/[0-9]/, "Password must contain at least one number"),
  regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character")
);

const Schema = pipe(
  object({
    email: pipe(
      string(),
      email(),
      check(
        (email) => !registeredEmails.includes(email.toLowerCase()),
        "Email is already in use"
      )
    ),
    username: pipe(
      string(),
      minLength(2, "Username must be at least 2 characters long")
    ),
    password: PasswordSchema,
    confirmPassword: PasswordSchema,
  }),
  forward(
    partialCheck(
      [["password"], ["confirmPassword"]],
      ({ password, confirmPassword }) => password === confirmPassword,
      "Passwords don't match"
    ),
    ["confirmPassword"]
  )
);
console.log(Schema);
const end = performance.now();
console.log("sign up schema created", end - start);

const startParse = performance.now();
const errorResult = safeParse(Schema, {
  email: "dimasinskiy@gmail.com",
  username: "sinskiy",
  password: "totallyrandompassword!42",
  confirmPassword: "totallyrandompassword!42",
});
const result = safeParse(Schema, {
  email: "main@sinskiy.site",
  username: "sinskiy",
  password: "totallyrandompassword!42",
  confirmPassword: "totallyrandompassword!42",
});
console.log(errorResult, result);
const endParse = performance.now();
console.log("sign up schema parsed", endParse - startParse);
