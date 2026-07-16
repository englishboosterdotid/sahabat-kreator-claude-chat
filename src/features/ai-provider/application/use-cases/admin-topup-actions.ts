"use server";

import { db } from "@/shared/infrastructure/database/client";
import { aiTopUpInvoice, aiTokenBalance } from "@/shared/infrastructure/database/schema";
import { eq, and, desc, gte, sql } from "drizzle-orm";
import { nanoid } from "nanoid";
import { z } from "zod";
import { withPlatformAdmin } from "./require-platform-admin-action";
import { parseActionInput } from "@/shared/lib/validation/action-validation";

const approveInputSchema = z.object({
  invoiceId: z.string().min(1),
  adminNote: z.string().trim().max(500).optional(),
});

/**
 * Platform admin approves a top-up invoice. The workspace's AI token
 * balance is credited with the requested amount.
 */
export const approveTopUpInvoiceAction = withPlatformAdmin(
  "approve",
  async (_ctx, rawInput: z.infer<typeof approveInputSchema>) => {
    const input = parseActionInput(approveInputSchema, rawInput);

    const existing = await db.query.aiTopUpInvoice.findFirst({
      where: eq(aiTopUpInvoice.id, input.invoiceId),
    });

    if (!existing) {
      return { success: false as const, error: "Invoice tidak ditemukan." };
    }
    if (existing.status !== "pending") {
      return { success: false as const, error: "Invoice sudah diproses." };
    }

    // Credit balance — upsert into aiTokenBalance.
    await db.transaction(async (tx) => {
      await tx.update(aiTopUpInvoice).set({
        status: "approved",
        adminNote: input.adminNote ?? null,
        approvedByUserId: _ctx.userId,
        approvedAt: new Date(),
        updatedAt: new Date(),
      }).where(eq(aiTopUpInvoice.id, input.invoiceId));

      // Atomically add amountMicroUsd to existing balance (upsert)
      const newBalanceId = nanoid();
      await tx.execute(sql`
        INSERT INTO ai_token_balance (id, workspace_id, balance, updated_at)
        VALUES (${newBalanceId}, ${existing.workspaceId}, ${existing.amountMicroUsd}, NOW())
        ON CONFLICT (workspace_id)
        DO UPDATE SET balance = ai_token_balance.balance + ${existing.amountMicroUsd}, updated_at = NOW()
      `);
    });

    return { success: true as const };
  }
);

const rejectInputSchema = z.object({
  invoiceId: z.string().min(1),
  adminNote: z.string().trim().max(500),
});

/**
 * Platform admin rejects a top-up. The invoice is frozen as `rejected`
 * for audit purposes. No balance is touched.
 */
export const rejectTopUpInvoiceAction = withPlatformAdmin(
  "reject",
  async (_ctx, rawInput: z.infer<typeof rejectInputSchema>) => {
    const input = parseActionInput(rejectInputSchema, rawInput);

    const existing = await db.query.aiTopUpInvoice.findFirst({
      where: eq(aiTopUpInvoice.id, input.invoiceId),
    });

    if (!existing) {
      return { success: false as const, error: "Invoice tidak ditemukan." };
    }
    if (existing.status !== "pending") {
      return { success: false as const, error: "Invoice sudah diproses." };
    }

    await db
      .update(aiTopUpInvoice)
      .set({
        status: "rejected",
        adminNote: input.adminNote ?? null,
        approvedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(aiTopUpInvoice.id, input.invoiceId));

    return { success: true as const };
  }
);

/**
 * Summary of top-up invoices across ALL workspaces in the platform.
 * Shows pending count, total pending value, and recent activity.
 */
export const getAllPlatformTopUpsAction = withPlatformAdmin(
  "read",
  async (_ctx): Promise<{
    pendingCount: number;
    pendingTotalMicroUsd: number;
    invoices: Array<{
      id: string;
      workspaceId: string;
      amountMicroUsd: number;
      status: string;
      paymentProofUrl: string | null;
      paymentMethod: string | null;
      paymentReference: string | null;
      notes: string | null;
      createdAt: Date;
    }>;
  }> => {
    const rows = await db.query.aiTopUpInvoice.findMany({
      where: eq(aiTopUpInvoice.status, "pending"),
      orderBy: [desc(aiTopUpInvoice.createdAt)],
      limit: 50,
    });

    const pendingTotal = rows.reduce((sum, r) => sum + r.amountMicroUsd, 0);

    return {
      pendingCount: rows.length,
      pendingTotalMicroUsd: pendingTotal,
      invoices: rows.map((r) => ({
        id: r.id,
        workspaceId: r.workspaceId,
        amountMicroUsd: r.amountMicroUsd,
        status: r.status,
        paymentProofUrl: r.paymentProofUrl,
        paymentMethod: r.paymentMethod,
        paymentReference: r.paymentReference,
        notes: r.notes,
        createdAt: r.createdAt,
      })),
    };
  }
);