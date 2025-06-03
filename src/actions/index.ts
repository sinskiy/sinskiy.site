import { defineAction } from "astro:actions";
import { db, eq, inArray, isNull, Thought } from "astro:db";
import { z } from "astro:schema";
import type { ThoughtNoPost } from "../thoughts";
import { randomUUID } from "node:crypto";

export const server = {
  getThoughts: defineAction({
    input: z.object({ post: z.string().optional() }),
    handler: async ({ post }, context) => {
      const cookies = context.request.headers.get("cookie");
      const savedCookie = cookies ? cookies.split("=")[1] : null;
      let savedIds = [];
      if (savedCookie) {
        try {
          const parsedDecodedSavedIds = JSON.parse(
            decodeURI(savedCookie).replaceAll("%2C", ","),
          );
          // TODO: verify
          savedIds = parsedDecodedSavedIds;
        } catch (error) {
          console.log(error);
        }
      }

      const selector = {
        username: Thought.username,
        date: Thought.date,
        message: Thought.message,
        isOwner: inArray(Thought.id, savedIds),
      };
      const thoughts = post
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
      const thought = await db
        .insert(Thought)
        .values({
          id: randomUUID(),
          username,
          message,
          post,
        })
        .returning({ id: Thought.id });
      let prevCookies: string[] = [];
      try {
        const savedCookies = JSON.parse(
          context.cookies.get("created")?.value ?? "[]",
        );
        if (
          Array.isArray(savedCookies) &&
          savedCookies.every((id) => typeof id === "string")
        ) {
          prevCookies = savedCookies;
        }
      } catch {}
      const newCookies = JSON.stringify(prevCookies.concat(thought[0].id));
      context.cookies.set("created", newCookies, { path: "/" });
    },
  }),
};
