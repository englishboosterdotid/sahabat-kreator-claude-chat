import { pgTable, text, timestamp, jsonb } from "drizzle-orm/pg-core";
import { team } from "./auth-schema";

export const brandVoicePlatformOverride = pgTable("brand_voice_platform_override", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id")
    .notNull()
    .references(() => team.id, { onDelete: "cascade" }),
  platform: text("platform").notNull(),
  toneAdjustment: text("tone_adjustment"), // "lebih santai, boleh pakai emoji dan slang"
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});


