import { pgTable, text, timestamp, integer } from "drizzle-orm/pg-core";
import { aiProviderTypeEnum } from "./enum-schema";
import { team } from "./auth-schema";

export const aiProviderConfig = pgTable("ai_provider_config", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id")
    .notNull()
    .unique() // 1 config aktif per workspace
    .references(() => team.id, { onDelete: "cascade" }),

  providerType: aiProviderTypeEnum("provider_type").notNull().default("platform_sumopod"),

  // BYOK fields - null kalau pakai platform_sumopod
  apiKeyEncrypted: text("api_key_encrypted"),
  customBaseUrl: text("custom_base_url"),  // hanya diisi kalau providerType = "custom"
  model: text("model"),                     // misal "claude-sonnet-4-6", "gpt-4o", "gemini-2.5-pro"

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});






