import type { MonorepoTemplateData } from '../../../../types';

export function generateDbTursoSchema(_data: MonorepoTemplateData): string {
  return `import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";

// Define your tables here using Drizzle ORM sqlite-core.
// Example:
// export const users = sqliteTable("users", {
//   id: text("id").primaryKey(),
//   name: text("name").notNull(),
//   email: text("email").notNull().unique(),
//   createdAt: integer("created_at", { mode: "timestamp" })
//     .notNull()
//     .$defaultFn(() => new Date()),
// });
`;
}
