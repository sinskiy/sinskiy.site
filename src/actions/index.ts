import { defineAction } from "astro:actions";
import { db, Thought } from "astro:db";
import { z } from "astro:schema";

export const server = {
  postThought: defineAction({
    accept: "form",
    input: z.object({
      username: z.string(),
      message: z.string(),
    }),
    handler: async ({ username, message }) => {
      await db.insert(Thought).values({ username: username, message: message });
    },
  }),
};
