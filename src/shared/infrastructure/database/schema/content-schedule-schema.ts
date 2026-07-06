import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { team } from "./auth-schema";
import { generatedContent } from "./content-generation-schema";
import { replizConnection } from "./repliz-connection-schema";
import { contentStatistic } from "./content-statistic-schema";

export const contentSchedule = pgTable("content_schedule", {
    id: text("id").primaryKey(),
    workspaceId: text("workspace_id").notNull().references(() => team.id, { onDelete: "cascade" }),

    generatedContentId: text("generated_content_id")
        .notNull()
        .references(() => generatedContent.id, { onDelete: "cascade" }),
    connectionId: text("connection_id")
        .notNull()
        .references(() => replizConnection.id, { onDelete: "cascade" }),

    replizScheduleId: text("repliz_schedule_id").notNull(),
    scheduleAt: timestamp("schedule_at").notNull(),
    status: text("status").notNull().default("pending"),
    errorMessage: text("error_message"),

    createdBy: text("created_by").notNull(),
    postId: text("post_id"), // diisi setelah sync, cuma ada kalau status = success
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
