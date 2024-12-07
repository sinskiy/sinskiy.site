import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/data/projects" }),
  schema: z.object({
    title: z.string(),
    tags: z.array(z.string()),
    href: z.string(),
    github: z.string(),
    src: z.string(),
  }),
});

export const collections = { projects };
