import { pgTable, text, boolean, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { team } from "./auth-schema";

export const hashtagNote = pgTable("hashtag_note", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id").notNull().references(() => team.id, { onDelete: "cascade" }),
  hashtag: text("hashtag").notNull(),
  isProven: boolean("is_proven").notNull().default(true),
  note: text("note"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => [
  uniqueIndex("hashtag_note_workspace_tag_uidx").on(table.workspaceId, table.hashtag),
]);