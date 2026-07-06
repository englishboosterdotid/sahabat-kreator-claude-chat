import { pgTable, text, timestamp, jsonb } from "drizzle-orm/pg-core";
import { team } from "./auth-schema";

export const brandVoice = pgTable("brand_voice", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id")
    .notNull()
    .unique() // 1 brand voice per workspace
    .references(() => team.id, { onDelete: "cascade" }),

  brandName: text("brand_name"),
  tagline: text("tagline"),
  industry: text("industry"), // free text, dikasih suggestion di UI tapi tidak dipaksa enum

  toneDescription: text("tone_description"),          // deskripsi bebas: "santai, hangat, sedikit humoris"
  personalityTraits: jsonb("personality_traits").$type<string[]>().notNull().default([]), // ["ramah", "expert", "to-the-point"]
  dos: jsonb("dos").$type<string[]>().notNull().default([]),
  donts: jsonb("donts").$type<string[]>().notNull().default([]),
  targetAudience: text("target_audience"),

  sampleContent: text("sample_content"),               // sample teks yang di-paste user untuk dianalisis AI
  aiAnalysisSummary: text("ai_analysis_summary"),       // hasil ekstraksi AI, ditampilkan sebagai saran

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

