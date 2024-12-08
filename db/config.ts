import { column, defineDb, defineTable } from "astro:db";

const Thought = defineTable({
  columns: {
    username: column.text(),
    message: column.text(),
  },
});

export default defineDb({
  tables: { Thought },
});
