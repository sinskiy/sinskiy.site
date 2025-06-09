const start = performance.now();

import {
  e164,
  email,
  iso,
  maxLength,
  minLength,
  object,
  pipe,
  safeParse,
  string,
  transform,
} from "zod/v4-mini";

const Schema = object({
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
console.log(Schema);
const end = performance.now();
console.log("add person schema created", end - start);

const startParse = performance.now();
const errorResult = safeParse(Schema, {
  email: "dimasinskiy@gmail.com",
  fullName: "John Galt Anonymous",
  phone: "+42 424 424-42-42",
  birthday: "invalid birthday date",
});
const result = safeParse(Schema, {
  email: "dimasinskiy@gmail.com",
  fullName: "John Galt Anonymous",
  phone: "+42 424 424-42-42",
  birthday: "2025-06-09",
});
console.log(errorResult, result);
const endParse = performance.now();
console.log("add person schema parsed", endParse - startParse);
