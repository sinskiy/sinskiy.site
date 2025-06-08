import { useState, type FormEvent } from "react";
import { SignUpForm } from "./SignUpForm";
import { type ValibotValidationError } from "./utils";
import { registeredEmails } from "./const";
import { AddEntryForm } from "./AddEntryForm";
import { AddPersonForm } from "./AddPersonForm";
import {
  check,
  date,
  email,
  flatten,
  forward,
  maxLength,
  minLength,
  object,
  optional,
  partialCheck,
  pipe,
  regex,
  safeParse,
  string,
  transform,
} from "valibot";

export function ValibotForms() {
  const [signUpValidationError, setSignUpValidationError] =
    useState<SignUpValidationError>(null);
  function handleSignUpSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const result = safeParse(SignUpSchema, Object.fromEntries(formData));
    if (result.issues) {
      setSignUpValidationError(flatten(result.issues));
    } else {
      setSignUpValidationError(null);
    }
  }

  const [addEntryValidationError, setAddEntryValidationError] =
    useState<AddEntryValidationError>(null);
  function handleAddEntrySubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const result = safeParse(AddEntrySchema, Object.fromEntries(formData));
    if (result.issues) {
      setAddEntryValidationError(flatten(result.issues));
    } else {
      setAddEntryValidationError(null);
    }
  }

  const [addPersonValidationError, setAddPersonValidationError] =
    useState<AddPersonValidationError>(null);
  function handleAddPersonSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const result = safeParse(AddPersonSchema, Object.fromEntries(formData));
    if (result.issues) {
      setAddPersonValidationError(flatten(result.issues));
    } else {
      setAddPersonValidationError(null);
    }
  }

  return (
    <>
      <SignUpForm
        handleSubmit={handleSignUpSubmit}
        formErrors={signUpValidationError?.root}
        errors={signUpValidationError?.nested}
      />
      <AddEntryForm
        handleSubmit={handleAddEntrySubmit}
        formErrors={addEntryValidationError?.root}
        errors={addEntryValidationError?.nested}
      />
      <AddPersonForm
        handleSubmit={handleAddPersonSubmit}
        formErrors={addPersonValidationError?.root}
        errors={addPersonValidationError?.nested}
      />
    </>
  );
}
const PasswordSchema = pipe(
  string(),
  minLength(8, "Password must be at least 8 characters long"),
  regex(/[a-zA-Z]/, "Password must contain at least one letter"),
  regex(/[0-9]/, "Password must contain at least one number"),
  regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character")
);

const SignUpSchema = pipe(
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
type SignUpValidationError = ValibotValidationError<typeof SignUpSchema>;

const AddEntrySchema = object({
  title: pipe(
    string(),
    minLength(5, "Title must be at least 5 characters long"),
    maxLength(100, "Title must be less than 100 characters long")
  ),
  description: optional(
    pipe(
      string(),
      maxLength(1000, "Description must be less than 1000 characters")
    )
  ),
  date: date("Date must be specified in correct format"),
  subscribe: pipe(
    optional(string()),
    transform((isChecked) => (isChecked === "on" ? true : false))
  ),
});
type AddEntryValidationError = ValibotValidationError<typeof AddEntrySchema>;

const AddPersonSchema = object({
  email: pipe(string(), email()),
  fullName: pipe(
    string(),
    minLength(3, "Full name must be at least 3 characters long"),
    maxLength(100, "Full name must be less than 100 characters long")
  ),
  phone: pipe(
    string(),
    transform((value) => value.replace(/[^\d+]/g, "")),
    regex(
      /^\+(?:[0-9]){6,14}[0-9]$/,
      "Phone must be specified in correct format"
    )
  ),
  birthday: date("Birthday date must be specified in correct format"),
});
type AddPersonValidationError = ValibotValidationError<typeof AddPersonSchema>;
