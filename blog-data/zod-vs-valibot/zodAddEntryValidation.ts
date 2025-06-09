const start = performance.now();

import { z } from "zod/v4";

const Schema = z.object({
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
console.log(Schema);
const end = performance.now();
console.log("add entry schema created", end - start);

const startParse = performance.now();
const errorResult = Schema.safeParse({
  title: "valid title",
  description: "definitelly valid description",
  date: "invalid date",
  subscribe: "on",
});
const result = Schema.safeParse({
  title: "valid title",
  description: "definitelly valid description",
  date: "2025-06-09",
  subscribe: "on",
});
console.log(errorResult, result);
const endParse = performance.now();
console.log("add entry schema parsed", endParse - startParse);
