import { z, defineCollection } from "astro:content";
const projects = defineCollection({
  type: "content",
  schema: z.object({
    name: z.string(),
    tags: z.array(z.string()),
    url: z.string(),
    github: z.string().optional(),
  }),
});
export const collections = { projects: projects };
