import { column, defineDb, defineTable } from "astro:db";

const Thought = defineTable({
  columns: {
    username: column.text(),
    message: column.text(),
    date: column.date({ default: new Date() }),
    post: column.text({ optional: true }),
  },
});

export default defineDb({
  tables: { Thought },
});
