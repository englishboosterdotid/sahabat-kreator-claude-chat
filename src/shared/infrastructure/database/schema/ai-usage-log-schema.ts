import { pgTable, text, timestamp, integer } from "drizzle-orm/pg-core";
import { aiProviderTypeEnum } from "./enum-schema";
import { team } from "./auth-schema";

// Log pemakaian, dipakai untuk billing/monitoring & potong saldo token platform
export const aiUsageLog = pgTable("ai_usage_log", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id")
    .notNull()
    .references(() => team.id, { onDelete: "cascade" }),
  providerType: aiProviderTypeEnum("provider_type").notNull(),
  model: text("model").notNull(),
  inputTokens: integer("input_tokens").notNull().default(0),
  outputTokens: integer("output_tokens").notNull().default(0),
  costMicroUsd: integer("cost_micro_usd").notNull().default(0), // biaya aktual, satuan micro-USD (1,000,000 = $1)
  feature: text("feature"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});