import { pgTable, text, timestamp, integer, jsonb } from "drizzle-orm/pg-core";
import { team } from "./auth-schema";

// Preferensi per workspace: kategori mana yang mau ditampilkan + tanggal gajian custom
export const workspaceMomentumPreference = pgTable("workspace_momentum_preference", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id")
    .notNull()
    .unique()
    .references(() => team.id, { onDelete: "cascade" }),
  enabledCategories: jsonb("enabled_categories")
    .$type<string[]>()
    .notNull()
    .default(["national_holiday", "religious", "commercial", "cultural"]),
  paydayDayOfMonth: integer("payday_day_of_month").default(25), // null = fitur gajian dimatikan
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});