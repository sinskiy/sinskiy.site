import { useState, type FormEvent } from "react";
import { SignUpForm } from "./SignUpForm";
import { type ZodValidationError } from "./utils";
import { registeredEmails } from "./const";
import { AddEntryForm } from "./AddEntryForm";
import { AddPersonForm } from "./AddPersonForm";
import {
  e164,
  email,
  flattenError,
  iso,
  maxLength,
  minLength,
  object,
  optional,
  pipe,
  refine,
  regex,
  safeParse,
  string,
  transform,
} from "zod/v4-mini";

export function ZodMiniForms() {
  const [signUpValidationError, setSignUpValidationError] =
    useState<SignUpValidationError>(null);
  function handleSignUpSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const result = safeParse(SignUpSchema, Object.fromEntries(formData));
    if (result.error) {
      setSignUpValidationError(flattenError(result.error));
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
    if (result.error) {
      setAddEntryValidationError(flattenError(result.error));
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
    if (result.error) {
      setAddPersonValidationError(flattenError(result.error));
    } else {
      setAddPersonValidationError(null);
    }
  }

  return (
    <>
      <SignUpForm
        handleSubmit={handleSignUpSubmit}
        formErrors={signUpValidationError?.formErrors}
        errors={signUpValidationError?.fieldErrors}
      />
      <AddEntryForm
        handleSubmit={handleAddEntrySubmit}
        formErrors={addEntryValidationError?.formErrors}
        errors={addEntryValidationError?.fieldErrors}
      />
      <AddPersonForm
        handleSubmit={handleAddPersonSubmit}
        formErrors={addPersonValidationError?.formErrors}
        errors={addPersonValidationError?.fieldErrors}
      />
    </>
  );
}
const PasswordSchema = string().check(
  minLength(8, "Password must be at least 8 characters long"),
  regex(/[a-zA-Z]/, "Password must contain at least one letter."),
  regex(/[0-9]/, "Password must contain at least one number."),
  regex(/[^a-zA-Z0-9]/, {
    message: "Password must contain at least one special character.",
  })
);

const SignUpSchema = object({
  email: email().check(
    refine(
      (email) => !registeredEmails.includes(email.toLowerCase()),
      "Email is already in use"
    )
  ),
  username: string().check(
    minLength(2, "Username must be at least 2 characters long")
  ),
  password: PasswordSchema,
  confirmPassword: PasswordSchema,
}).check(
  refine(
    ({ password, confirmPassword }) => password === confirmPassword,
    "Passwords don't match"
  )
);
type SignUpValidationError = ZodValidationError<typeof SignUpSchema>;

const AddEntrySchema = object({
  title: string().check(
    minLength(5, "Title must be at least 5 characters long"),
    maxLength(100, "Title must be less than 100 characters long")
  ),
  description: optional(
    string().check(
      maxLength(1000, "Description must be less than 1000 characters long")
    )
  ),
  date: iso.date("Date must be specified in correct format"),
  subscribe: pipe(
    optional(string()),
    transform((isChecked) => (isChecked === "on" ? true : false))
  ),
});
type AddEntryValidationError = ZodValidationError<typeof AddEntrySchema>;

const AddPersonSchema = object({
  email: email(),
  fullName: string().check(
    minLength(3, "Full name must be at least 3 characters long"),
    maxLength(100, "Full name must be less than 100 characters long")
  ),
  phone: pipe(
    transform((value) =>
      typeof value === "string" ? value.replace(/[^\d+]/g, "") : value
    ),
    e164("Phone must be specified in correct format")
  ),
  birthday: iso.date("Birthday date must be specified in correct format"),
});
type AddPersonValidationError = ZodValidationError<typeof AddPersonSchema>;
