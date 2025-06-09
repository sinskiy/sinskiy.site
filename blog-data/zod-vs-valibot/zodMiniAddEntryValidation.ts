const start = performance.now();

import {
  iso,
  maxLength,
  minLength,
  object,
  optional,
  pipe,
  safeParse,
  string,
  transform,
} from "zod/v4-mini";

const Schema = object({
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
console.log(Schema);
const end = performance.now();
console.log("add entry schema created", end - start);

const startParse = performance.now();
const errorResult = safeParse(Schema, {
  title: "valid title",
  description: "definitelly valid description",
  date: "invalid date",
  subscribe: "on",
});
const result = safeParse(Schema, {
  title: "valid title",
  description: "definitelly valid description",
  date: "2025-06-09",
  subscribe: "on",
});
console.log(errorResult, result);
const endParse = performance.now();
console.log("add entry schema parsed", endParse - startParse);
