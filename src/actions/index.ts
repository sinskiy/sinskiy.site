import { defineAction } from "astro:actions";
import { db, eq, inArray, isNull, Thought } from "astro:db";
import { z } from "astro:schema";
import { randomUUID } from "node:crypto";
import { getSavedCookies, getSavedCookiesFromHead } from "./helpers";

export const server = {
  getThoughts: defineAction({
    input: z.object({ post: z.string().optional() }),
    handler: async ({ post }, context) => {
      const cookies = context.request.headers.get("cookie");
      // TODO: createe a minimal reproduction and open an issue
      const savedIds = getSavedCookiesFromHead(cookies);

      const selector = {
        username: Thought.username,
        date: Thought.date,
        message: Thought.message,
        isOwner: inArray(Thought.id, savedIds),
        ...(inArray(Thought.id, savedIds) ? { id: Thought.id } : {}),
      };
      try {
        const thoughts = post
          ? await db
              .select(selector)
              .from(Thought)
              .where(eq(Thought.post, post))
          : await db.select(selector).from(Thought).where(isNull(Thought.post));
        // sort by date
        return thoughts.reverse();
      } catch (error) {
        throw new Error("couldn't get thoughts. hit me up on Discord");
      }
    },
  }),
  postThought: defineAction({
    input: z.object({
      username: z.string().max(100),
      message: z.string().max(1000),
      post: z.string().max(100).optional(),
    }),
    handler: async ({ username, message, post }, context) => {
      try {
        const thought = await db
          .insert(Thought)
          .values({
            id: randomUUID(),
            username,
            message,
            post,
          })
          .returning({ id: Thought.id });
        const prevCookies = getSavedCookies(context.cookies);
        const newCookies = JSON.stringify(prevCookies.concat(thought[0].id));
        context.cookies.set("created", newCookies, { path: "/" });
      } catch (error) {
        throw new Error("couldn't insert thought. hit me up on Discord");
      }
    },
  }),
  deleteThought: defineAction({
    input: z.string(),
    handler: async (id) => {
      try {
        await db.delete(Thought).where(eq(Thought.id, id));
      } catch (error) {
        throw new Error("couldn't delete thought. hit me up on Discord");
      }
    },
  }),
  editThought: defineAction({
    input: z.object({
      id: z.string(),
      newUsername: z.string().max(100),
      newMessage: z.string().max(1000),
    }),
    handler: async ({ id, newUsername, newMessage }) => {
      try {
        await db
          .update(Thought)
          .set({ username: newUsername, message: newMessage })
          .where(eq(Thought.id, id));
      } catch (error) {
        throw new Error("couldn't edit thought. hit me up on Discord");
      }
    },
  }),
};
