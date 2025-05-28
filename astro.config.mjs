// @ts-check
import { defineConfig } from "astro/config";
import db from "@astrojs/db";
import vercel from "@astrojs/vercel";

import preact from "@astrojs/preact";

export default defineConfig({
  output: "server",
  adapter: vercel(),
  integrations: [db(), preact()],
});