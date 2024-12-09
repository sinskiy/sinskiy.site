import { column, defineDb, defineTable } from "astro:db";

const Thought = defineTable({
  columns: {
    username: column.text(),
    message: column.text(),
    date: column.date({ default: new Date() }),
  },
});

export default defineDb({
  tables: { Thought },
});
