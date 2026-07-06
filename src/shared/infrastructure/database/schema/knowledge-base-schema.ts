import { pgTable, text, timestamp, boolean, vector, jsonb } from "drizzle-orm/pg-core";
import { team } from "./auth-schema";
import { knowledgeCategoryEnum } from "./enum-schema";

export const knowledgeEntry = pgTable("knowledge_entry", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id")
    .notNull()
    .references(() => team.id, { onDelete: "cascade" }),

  title: text("title").notNull(),
  content: text("content").notNull(),
  category: knowledgeCategoryEnum("category").notNull().default("other"),
  tags: jsonb("tags").$type<string[]>().notNull().default([]),
  isPinned: boolean("is_pinned").notNull().default(false), // selalu disertakan, apa pun briefnya

  embedding: vector("embedding", { dimensions: 1536 }), // text-embedding-3-small = 1536 dimensi

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});


