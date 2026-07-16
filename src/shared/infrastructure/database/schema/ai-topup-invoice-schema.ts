import { pgTable, text, timestamp, pgEnum, integer } from "drizzle-orm/pg-core";
import { team, user } from "./auth-schema";

export const topUpStatusEnum = pgEnum("ai_topup_status", [
  "pending",    // user submitted, awaiting admin verification
  "approved",   // admin approved; balance credited
  "rejected",   // admin rejected (e.g. no payment received)
  "cancelled",  // user cancelled before approval
]);

/**
 * A top-up request the user files to refill their workspace's AI token balance.
 * Money flows: user → transfer to admin's bank/e-wallet → submit this form →
 * admin verifies payment → balance credited to workspace.
 *
 * Amount stored in micro-USD for parity with `aiTokenBalance.balance`.
 * Example: $25.00 = 25_000_000 micro-USD.
 */
export const aiTopUpInvoice = pgTable("ai_topup_invoice", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id")
    .notNull()
    .references(() => team.id, { onDelete: "cascade" }),
  requestedByUserId: text("requested_by_user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  amountMicroUsd: integer("amount_micro_usd").notNull(),
  status: topUpStatusEnum("status").notNull().default("pending"),
  paymentProofUrl: text("payment_proof_url"),        // optional image of bank transfer receipt
  paymentMethod: text("payment_method"),              // e.g. "BCA Transfer", "GoPay", etc.
  paymentReference: text("payment_reference"),        // optional note: sender name / bank account used
  notes: text("notes"),                               // user's note to admin
  adminNote: text("admin_note"),                      // admin's note when approving/rejecting
  approvedByUserId: text("approved_by_user_id").references(() => user.id, { onDelete: "set null" }),
  approvedAt: timestamp("approved_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
});