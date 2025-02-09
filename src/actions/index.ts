import { defineAction } from "astro:actions";
import { db, Thought } from "astro:db";
import { z } from "astro:schema";

export const server = {
  postThought: defineAction({
    accept: "form",
    input: z.object({
      username: z.string().max(100),
      message: z.string().max(1000),
    }),
    handler: async ({ username, message }) => {
      await db.insert(Thought).values({ username: username, message: message });
    },
  }),
};
