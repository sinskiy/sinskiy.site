---
title: "did Zod v4 make Valibot obsolete?"
description: "new Zod version brought improvements to the bundle size"
pubDate: "Jun 08 2025"
---

i'll compare Zod, Zod Mini and Valibot by bundle size

let's initialize a fresh React app with `npm create vite@latest` and make it empty:

```diff
- vite.svg
- App.css
- index.css
- react.svg

// main.tsx
- import './index.css'
```

```tsx
// App.tsx
function App() {
  return <></>;
}

export default App;
```

install Zod and Valibot: `npm install zod valibot`

add some schemas:

```ts
// Zod
const PasswordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .regex(/[a-zA-Z]/, "Password must contain at least one letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(
    /[^a-zA-Z0-9]/,
    "Password must contain at least one special character",
  );

const SignUpSchema = z
  .object({
    email: z
      .email()
      .refine(
        (email) => !registeredEmails.includes(email.toLowerCase()),
        "Email is already in use",
      ),
    username: z.string().min(2, "Username must be at least 2 characters long"),
    password: PasswordSchema,
    confirmPassword: PasswordSchema,
  })
  .refine(
    ({ password, confirmPassword }) => password === confirmPassword,
    "Passwords don't match",
  );

// 2 more schemas:
// - abstract AddEntry with title, description, date, and *subscribe* checkbox
// - AddPerson with email, fullName, phone, birthday
// ...

// Zod Mini - same
// ...

// Valibot - same
// ...
```

you can imagine how other schemas look, as well as you can imagine how components look (the code would take too much space if i pasted it). the dependency tree looks like the following:

```
Main:
  ZodForms/ZodMiniForms/ValibotForms:
    SignUpForm:
      Form
        InputField
        ... more InputField
    AddEntryForm:
      ... same
    AddPersonForm:
      ... same
```

> the source code is located [in this repository](https://github.com/sinskiy/sinskiy.site), at `blog-data/zod-vs-valibot`. take a look if you want!

to test bundle size, i created 3 builds: with `ZodForms`, `ZodMiniForms` and `ValibotForms` in `main.tsx`. the results for gzipped JS files are the following:

| Zod     | Zod Mini | Valibot |
| ------- | -------- | ------- |
| 71.53kb | 65.41kb  | 62.07kb |

as you can see, there's practically no difference. i like syntax of Zod Mini and Valibot more, but types are a bit more flexible in the Zod group, so i'd rather use Zod Mini. i'll test parsing speed later, as testing bundle sizes took too much time

## encountered limitations of solutions

- Valibot has no phone number validator
