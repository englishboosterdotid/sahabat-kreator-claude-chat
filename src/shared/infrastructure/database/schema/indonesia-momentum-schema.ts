import { pgTable, text, date, timestamp, boolean, integer, jsonb } from "drizzle-orm/pg-core";
import { momentumCategoryEnum } from "./enum-schema";

// Data global, tidak per-workspace - dikurasi oleh tim, di-update tiap tahun
export const indonesiaMomentum = pgTable("indonesia_momentum", {
  id: text("id").primaryKey(),
  date: date("date").notNull(),                 // format YYYY-MM-DD
  name: text("name").notNull(),
  category: momentumCategoryEnum("category").notNull(),
  description: text("description"),
  contentAngleHint: text("content_angle_hint"), // saran sudut pandang konten untuk momen ini
  isTentative: boolean("is_tentative").notNull().default(false), // true untuk tanggal hijriah yang bisa geser
  year: integer("year").notNull(),               // untuk query per tahun, data perlu di-refresh tiap tahun
});


