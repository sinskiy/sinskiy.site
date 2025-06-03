import { column, defineDb, defineTable } from "astro:db";

const Thought = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    username: column.text(),
    message: column.text(),
    date: column.date({ default: new Date() }),
    post: column.text({ optional: true }),
  },
});

export default defineDb({
  tables: { Thought },
});
