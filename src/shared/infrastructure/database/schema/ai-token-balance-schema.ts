import { pgTable, text, timestamp, integer } from "drizzle-orm/pg-core";
import { team } from "./auth-schema";

export const aiTokenBalance = pgTable("ai_token_balance", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id").notNull().unique().references(() => team.id, { onDelete: "cascade" }),
  balance: integer("balance").notNull().default(0), // satuan micro-USD (1,000,000 = $1)
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});