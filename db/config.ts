import { column, defineDb, defineTable, sql } from "astro:db";

const Thought = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    username: column.text(),
    message: column.text(),
    date: column.date({ default: sql`(CURRENT_TIMESTAMP)` }),
    post: column.text({ optional: true }),
  },
});

export default defineDb({
  tables: { Thought },
});
