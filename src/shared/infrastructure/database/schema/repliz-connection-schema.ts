import { boolean, index, pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { team, organization, user } from "./auth-schema";

export const replizConnection = pgTable(
  "repliz_connection",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id").notNull().references(() => organization.id, { onDelete: "cascade" }),
    teamId: text("team_id").notNull().references(() => team.id, { onDelete: "cascade" }),

    provider: text("provider").notNull().default("repliz"),
    platform: text("platform").notNull(),

    replizAccountId: text("repliz_account_id").notNull(),
    externalName: text("external_name").notNull(),
    externalUsername: text("external_username"),
    externalPicture: text("external_picture"),
    externalAccountType: text("external_account_type"),

    isConnected: boolean("is_connected").notNull().default(true),
    isRemoved: boolean("is_removed").notNull().default(false),

    connectedByUserId: text("connected_by_user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    lastCheckedAt: timestamp("last_checked_at"),

    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
  },
  (table) => [
    uniqueIndex("repliz_connection_team_account_uidx").on(table.teamId, table.replizAccountId),
    index("repliz_connection_team_idx").on(table.teamId),
    index("repliz_connection_org_idx").on(table.organizationId),
    index("repliz_connection_platform_idx").on(table.platform),
  ]
);