import { pgTable, text, timestamp, jsonb } from "drizzle-orm/pg-core";
import { team } from "./auth-schema";

export const generatedContent = pgTable("generated_content", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id")
    .notNull()
    .references(() => team.id, { onDelete: "cascade" }),

  brief: text("brief").notNull(),
  platform: text("platform").notNull(),

  // Ide yang dipilih (snapshot, bukan referensi - ide lain yang tidak dipilih tidak perlu disimpan)
  selectedHook: text("selected_hook").notNull(),
  selectedPillar: text("selected_pillar").notNull(),
  selectedAngle: text("selected_angle").notNull(),

  caption: text("caption").notNull(),
  hashtags: jsonb("hashtags").$type<string[]>().default([]),

   slides: jsonb("slides").$type<{ order: number; text: string; imageUrl: string }[]>(), // diisi kalau contentFormat = carousel
  contentFormat: text("content_format").notNull().default("single"), // "single" | "carousel"
  
  status: text("status").notNull().default("draft"), // draft | scheduled | published (dipakai Kalender Konten nanti)

   // === Kolom baru untuk Content Transform ===
  parentContentId: text("parent_content_id"), // self-reference, null = konten original
  transformType: text("transform_type"),        // "variant" | "repurpose" | null

  createdBy: text("created_by").notNull(), // userId
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});


