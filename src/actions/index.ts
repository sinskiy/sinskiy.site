import { defineAction } from "astro:actions";
import { db, eq, isNull, Thought } from "astro:db";
import { z } from "astro:schema";
import type { ThoughtNoPost } from "../thoughts";

export const server = {
  getThoughts: defineAction({
    input: z.object({ post: z.string().optional() }),
    handler: async ({ post }) => {
      const selector = {
        username: Thought.username,
        date: Thought.date,
        message: Thought.message,
      };
      const thoughts: ThoughtNoPost[] = post
        ? await db.select(selector).from(Thought).where(eq(Thought.post, post))
        : await db.select(selector).from(Thought).where(isNull(Thought.post));
      // sort by date
      return thoughts.reverse();
    },
  }),
  postThought: defineAction({
    input: z.object({
      username: z.string().max(100),
      message: z.string().max(1000),
      post: z.string().max(100).optional(),
    }),
    handler: async ({ username, message, post }, context) => {
      await db.insert(Thought).values({
        username,
        message,
        post,
      });
    },
  }),
};
