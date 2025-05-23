import { db, Thought } from "astro:db";

export default async function seed() {
  await db.insert(Thought).values([
    { username: "fluqont", message: "and other usernames too" },
    { username: "sinskiy", message: "duplicated usernames are allowed" },
    { username: "sinskiy", message: "thoughts are merely words in your brain" },
  ]);
}
