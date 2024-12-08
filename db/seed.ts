import { db, Thought } from "astro:db";

export default async function seed() {
  await db.insert(Thought).values([
    { username: "sinskiy", message: "I have no thoughts" },
    { username: "Сева", message: "Ты дурак" },
    { username: "kilwinta", message: "Давай в Roblox" },
  ]);
}
