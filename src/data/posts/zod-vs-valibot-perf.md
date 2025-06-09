---
title: "Zod and Valibot performance comparison"
description: "giving Valibot another chance"
pubDate: "Jun 09 2025"
---

as i promised, a quick follow-up to the [bundle size test](/posts/zod-vs-valibot) with some benchmarks

> i've also promised a follow-up post about JetPack Compose, but i'm still getting the hang of it. it's not abandoned; expect it to be released within a week

let's add some files and modify `App.tsx` a bit:

```tsx
// zodSignUpValidation.ts
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
    "Password must contain at least one special character",
  );

const Schema = z.object({
  // it was shown in the previous blog post
});
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

// 2 more similar files: zodAddEntryValidation.ts and zodAddPersonValidation.ts

// 6 more similar files for Zod Mini and Valibot

// example of App.tsx for Zod tests:
import "./zodSignUpValidation";
import "./zodAddEntryValidation";
import "./zodAddPersonValidation";

function App() {
  return <></>;
}

export default App;
```

> the source code was updated. its version without config files is still located [in this repository](https://github.com/sinskiy/sinskiy.site), at `blog-data/zod-vs-valibot`. take a look if you want!

to test performance, i created 3 builds: with `zod...Validation`, `zodMini...Validation` and `valibot...Validation` in `main.tsx`, set my network and CPU throttling to 3G and Low-tier mobile (which is 8.5× for me), and ran performance profling 5 times for each build in Chromium

<details>
<summary>my specs</summary>

- motherboard: ASRock AB350 Pro4
- RAM: 16 GiB
- processor: AMD Ryzen 5 1600 × 12
- graphics: NVIDIA GeForce GTX 1650
- OS: Debian 12 (Bookworm)
- GNOME: 43.9
- windowing system: X11
- browser: Chromium 137.0
</details>

the results are as following (0, 1, 2, 3 and 4 are median times in ms; 0, 2, 4 - schema creation, 1, 3, 5 - parsing):

| Name     | 0    | 2    | 4   | 1    | 3    | 5    |
| -------- | ---- | ---- | --- | ---- | ---- | ---- |
| Zod      | 33.8 | 16.5 | 3.7 | 24.7 | 11.8 | 10.1 |
| Zod Mini | 24.8 | 10.5 | 6.2 | 23.8 | 10.9 | 7.6  |
| Valibot  | 5.4  | 2.1  | 2.0 | 15.9 | 3.6  | 3.1  |

<details>
<summary>full data</summary>

in order of `console.log`, creation-parsing pairs:

1. zod

- `33.8 29.1 15.7 15.6 3.0 09.2`
- `33.4 23.5 17.0 11.8 5.0 13.0`
- `34.6 24.7 16.5 10.0 3.7 09.3`
- `36.3 27.2 20.4 13.1 5.4 10.1`
- `31.9 23.2 14.1 09.6 3.3 11.2`

2. zod mini

- `23.7 20.7 10.9 10.6 6.7 7.6`
- `21.7 21.7 09.9 11.0 6.8 8.6`
- `24.8 25.0 12.4 10.8 5.9 6.8`
- `28.3 26.4 09.6 10.1 6.2 6.6`
- `25.3 23.8 10.5 10.9 6.2 7.6`

3. valibot

- `5.5 15.9 3.0 2.9 2.0 3.6`
- `7.3 16.5 2.1 4.0 1.0 3.2`
- `5.4 16.6 2.4 5.3 1.3 1.9`
- `4.2 14.4 2.0 3.6 2.3 2.5`
- `5.4 10.8 1.8 2.7 2.7 3.1`
</details>

as you can see, all solutions are extremely fast: 33.8 ms to create a schema and 24.7 ms to parse on a low-end mobile device isn't a lot. still, Valibot is significantly faster than other solutions (although they're closer when parsing the complex `SignUpSchema`), while Zod Mini is about 50% faster than the regular version. In conclusion, you can absolutely use whatever you want for parsing schemas; the difference is too insignificant now. [Colin McDonnell](https://github.com/colinhacks) did a great job at improving Zod's performance and bundle size in the new version
