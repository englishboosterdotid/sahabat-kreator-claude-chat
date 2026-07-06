import { pgTable, text, timestamp, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { team } from "./auth-schema";
import { contentSchedule } from "./content-schedule-schema";

export const contentStatistic = pgTable("content_statistic", {
    id: text("id").primaryKey(),
    workspaceId: text("workspace_id").notNull().references(() => team.id, { onDelete: "cascade" }),
    scheduleId: text("schedule_id").notNull().unique().references(() => contentSchedule.id, { onDelete: "cascade" }),

    platform: text("platform").notNull(),
    metrics: jsonb("metrics").notNull(), // shape beda per platform, lihat domain/value-objects
    fetchedAt: timestamp("fetched_at").notNull().defaultNow(),
});

