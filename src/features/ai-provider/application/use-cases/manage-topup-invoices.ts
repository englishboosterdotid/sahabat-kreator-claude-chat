"use server";

import { db } from "@/shared/infrastructure/database/client";
import { aiTopUpInvoice } from "@/shared/infrastructure/database/schema";
import { eq, and, desc } from "drizzle-orm";
import { nanoid } from "nanoid";
import { z } from "zod";
import { withWorkspacePermission } from "@/shared/lib/guards/with-workspace-permission";
import { parseActionInput } from "@/shared/lib/validation/action-validation";

/**
 * Preset top-up packages. Prices reflect realistic OpenAI/Anthropic 2025 costs
 * plus margin. Micro-USD = USD × 1_000_000.
 */
export const TOPUP_PACKAGES = [
  { microUsd: 1_000_000,   label: "$1 — Coba-coba",   },
  { microUsd: 5_000_000,   label: "$5 — Starter",     },
  { microUsd: 10_000_000,  label: "$10 — Reguler",    },
  { microUsd: 25_000_000,  label: "$25 — Pro",        },
  { microUsd: 50_000_000,  label: "$50 — Bisnis",     },
] as const;

const submitInputSchema = z.object({
  amountMicroUsd: z.number().int().positive()
    .refine((n) => TOPUP_PACKAGES.some(p => p.microUsd === n), "Pilih paket yang tersedia"),
  paymentMethod: z.string().trim().min(1, "Pilih metode pembayaran").max(120),
  paymentReference: z.string().trim().max(200).optional(),
  paymentProofUrl: z.string().url().max(2048).optional().or(z.literal("").transform(() => undefined)),
  notes: z.string().trim().max(1000).optional(),
});

export type SubmitTopUpInput = z.infer<typeof submitInputSchema>;

/**
 * Workspace member submits a top-up request. Stored as `pending` until an
 * admin approves it (see `approveTopUpInvoice` / `rejectTopUpInvoice`).
 */
export const submitTopUpInvoiceAction = withWorkspacePermission(
  ["owner", "admin"],
  async (ctx, rawInput: SubmitTopUpInput) => {
    const input = parseActionInput(submitInputSchema, rawInput);

    const id = nanoid();
    await db.insert(aiTopUpInvoice).values({
      id,
      workspaceId: ctx.teamId,
      requestedByUserId: ctx.userId,
      amountMicroUsd: input.amountMicroUsd,
      paymentMethod: input.paymentMethod,
      paymentReference: input.paymentReference ?? null,
      paymentProofUrl: input.paymentProofUrl ?? null,
      notes: input.notes ?? null,
      status: "pending",
    });

    return { success: true as const, invoiceId: id };
  }
);

const cancelInputSchema = z.object({
  invoiceId: z.string().min(1),
});

/**
 * Cancel a pending top-up request. Only the original requester can cancel,
 * and only while it's still `pending` — once approved/rejected it's frozen
 * for audit purposes.
 */
export const cancelTopUpInvoiceAction = withWorkspacePermission(
  ["owner", "admin"],
  async (ctx, rawInput: { invoiceId: string }) => {
    const input = parseActionInput(cancelInputSchema, rawInput);

    const existing = await db.query.aiTopUpInvoice.findFirst({
      where: and(eq(aiTopUpInvoice.id, input.invoiceId)),
    });

    if (!existing || existing.workspaceId !== ctx.teamId) {
      return { success: false as const, error: "Invoice tidak ditemukan." };
    }
    if (existing.status !== "pending") {
      return { success: false as const, error: "Invoice sudah diproses, tidak dapat dibatalkan." };
    }

    await db
      .update(aiTopUpInvoice)
      .set({ status: "cancelled", updatedAt: new Date() })
      .where(eq(aiTopUpInvoice.id, input.invoiceId));

    return { success: true as const };
  }
);

export type TopUpInvoiceRow = {
  id: string;
  amountMicroUsd: number;
  status: "pending" | "approved" | "rejected" | "cancelled";
  paymentMethod: string | null;
  paymentReference: string | null;
  paymentProofUrl: string | null;
  notes: string | null;
  adminNote: string | null;
  createdAt: Date;
  approvedAt: Date | null;
};

/**
 * List recent top-up invoices for the current workspace.
 */
export const listTopUpInvoicesAction = withWorkspacePermission(
  ["owner", "admin", "member", "viewer"],
  async (ctx): Promise<TopUpInvoiceRow[]> => {
    const rows = await db.query.aiTopUpInvoice.findMany({
      where: eq(aiTopUpInvoice.workspaceId, ctx.teamId),
      orderBy: [desc(aiTopUpInvoice.createdAt)],
      limit: 50,
    });

    return rows.map((r) => ({
      id: r.id,
      amountMicroUsd: r.amountMicroUsd,
      status: r.status,
      paymentMethod: r.paymentMethod,
      paymentReference: r.paymentReference,
      paymentProofUrl: r.paymentProofUrl,
      notes: r.notes,
      adminNote: r.adminNote,
      createdAt: r.createdAt,
      approvedAt: r.approvedAt,
    }));
  }
);