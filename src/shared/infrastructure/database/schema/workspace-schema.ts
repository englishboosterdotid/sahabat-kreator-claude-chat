import { pgTable, text, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { team, user } from "./auth-schema"; // tabel team & user dari BetterAuth
import { workspaceRoleEnum } from "./enum-schema"; // import enum dari enum-schema

// Tabel tambahan untuk permission granular per-workspace,
// terpisah dari role Better Auth bawaan (org-level)
export const workspaceMemberRole = pgTable("workspace_member_role", {
  id: text("id").primaryKey(),
  teamId: text("team_id")
    .notNull()
    .references(() => team.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  role: workspaceRoleEnum("role").notNull().default("member"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

