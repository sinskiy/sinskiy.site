const start = performance.now();

import {
  date,
  email,
  maxLength,
  minLength,
  object,
  pipe,
  regex,
  safeParse,
  string,
  transform,
} from "valibot";

const Schema = object({
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
  birthday: new Date(),
});
console.log(errorResult, result);
const endParse = performance.now();
console.log("add person schema parsed", endParse - startParse);
