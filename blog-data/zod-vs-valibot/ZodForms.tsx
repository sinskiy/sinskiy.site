import { useState, type FormEvent } from "react";
import { SignUpForm } from "./SignUpForm";
import { z } from "zod/v4";
import { type ZodValidationError } from "./utils";
import { registeredEmails } from "./const";
import { AddEntryForm } from "./AddEntryForm";
import { AddPersonForm } from "./AddPersonForm";

export function ZodForms() {
  const [signUpValidationError, setSignUpValidationError] =
    useState<SignUpValidationError>(null);
  function handleSignUpSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const result = SignUpSchema.safeParse(Object.fromEntries(formData));
    if (result.error) {
      setSignUpValidationError(z.flattenError(result.error));
    } else {
      setSignUpValidationError(null);
    }
  }

  const [addEntryValidationError, setAddEntryValidationError] =
    useState<AddEntryValidationError>(null);
  function handleAddEntrySubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const result = AddEntrySchema.safeParse(Object.fromEntries(formData));
    if (result.error) {
      setAddEntryValidationError(z.flattenError(result.error));
    } else {
      setAddEntryValidationError(null);
    }
  }

  const [addPersonValidationError, setAddPersonValidationError] =
    useState<AddPersonValidationError>(null);
  function handleAddPersonSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const result = AddPersonSchema.safeParse(Object.fromEntries(formData));
    if (result.error) {
      setAddPersonValidationError(z.flattenError(result.error));
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
const PasswordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .regex(/[a-zA-Z]/, "Password must contain at least one letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(
    /[^a-zA-Z0-9]/,
    "Password must contain at least one special character"
  );

const SignUpSchema = z
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
type SignUpValidationError = ZodValidationError<typeof SignUpSchema>;

const AddEntrySchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters long")
    .max(100, "Title must be less than 100 characters long"),
  description: z.string().max(1000).optional(),
  date: z.iso.date("Date must be specified in correct format"),
  subscribe: z
    .string()
    .optional()
    .transform((isChecked) => (isChecked === "on" ? true : false)),
});
type AddEntryValidationError = ZodValidationError<typeof AddEntrySchema>;

const AddPersonSchema = z.object({
  email: z.email(),
  fullName: z
    .string()
    .min(3, "Full name must be at least 3 characters long")
    .max(100, "Full name must be less than 100 characters long"),
  phone: z.preprocess(
    (value) =>
      typeof value === "string" ? value.replace(/[^\d+]/g, "") : value,
    z.e164("Phone must be specified in correct format")
  ),
  birthday: z.iso.date("Birthday date must be specified in correct format"),
});
type AddPersonValidationError = ZodValidationError<typeof AddPersonSchema>;
