"use client";

import { useState } from "react";
import { Input } from "@/shared/presentation/components/ui/input";
import { Button } from "@/shared/presentation/components/ui/button";
import { Badge } from "@/shared/presentation/components/ui/badge";
import { TOPUP_PACKAGES } from "../../application/use-cases/manage-topup-invoices";
import { submitTopUpInvoiceAction, cancelTopUpInvoiceAction } from "../../application/use-cases/manage-topup-invoices";
import { DollarSign, Clock, CheckCircle, XCircle, Loader2, Ban } from "lucide-react";

export function TopUpRequestForm() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentRef, setPaymentRef] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<string | null>(null); // invoice id
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAmount) return;
    if (!paymentMethod.trim()) return;

    setSubmitting(true);
    setError(null);
    try {
      const result = await submitTopUpInvoiceAction({
        amountMicroUsd: selectedAmount,
        paymentMethod: paymentMethod.trim(),
        paymentReference: paymentRef.trim() || undefined,
        notes: notes.trim() || undefined,
        paymentProofUrl: undefined, // placeholder — upload feature pending
      });

      if ("success" in result && result.success) {
        setSubmitted(result.invoiceId);
        setSelectedAmount(null);
        setPaymentMethod("");
        setPaymentRef("");
        setNotes("");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengajukan top-up");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async () => {
    if (!submitted) return;
    if (!confirm("Batalkan permintaan ini?")) return;
    await cancelTopUpInvoiceAction({ invoiceId: submitted });
    setSubmitted(null);
  };

  return (
    <section className="space-y-3 rounded-lg border p-4">
      <h2 className="text-sm font-medium flex items-center gap-2">
        <DollarSign className="size-4" />
        Top-Up Saldo AI Token
      </h2>
      <p className="text-xs text-muted-foreground">
        Pilih paket atau isi nominal, lalu konfirmasi setelah transfer dilakukan. Admin akan mencairkan saldo dalam 1–2 jam kerja.
      </p>

      {submitted && (
        <div className="rounded-md bg-emerald-50 border border-emerald-200 p-3 text-sm">
          <div className="flex items-center gap-2 text-emerald-700">
            <CheckCircle className="size-4" /> Permintaan sedang menunggu persetujuan admin.
          </div>
          <div className="mt-1 text-xs text-emerald-600">
            Invoice: <code>{submitted}</code>
          </div>
          <div className="mt-2">
            <Button variant="outline" size="sm" onClick={handleCancel}>
              <Ban className="size-3.5 mr-1" /> Batalkan
            </Button>
          </div>
        </div>
      )}

      {!submitted && (
        <form onSubmit={handleSubmit} className="space-y-3 max-w-md">
          {/* Package selection */}
          <fieldset className="grid grid-cols-2 gap-2">
            {TOPUP_PACKAGES.map((pkg) => (
              <button
                key={pkg.microUsd}
                type="button"
                onClick={() => setSelectedAmount(pkg.microUsd)}
                className={`rounded-md border px-3 py-2 text-left text-xs transition-all ${
                  selectedAmount === pkg.microUsd
                    ? "border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500"
                    : "border-border bg-background hover:bg-muted/50"
                }`}
              >
                <div className="font-medium">{pkg.label}</div>
                <div className="text-muted-foreground">
                  {(pkg.microUsd / 1_000_000).toFixed(0)} USD
                </div>
              </button>
            ))}
          </fieldset>

          {selectedAmount && (
            <>
              <div className="space-y-1">
                <label className="text-xs">Metode Pembayaran</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  required
                  className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                >
                  <option value="">— Pilih —</option>
                  <option value="Bank BCA">Bank BCA</option>
                  <option value="Bank Mandiri">Bank Mandiri</option>
                  <option value="GoPay">GoPay</option>
                  <option value="OVO">OVO</option>
                  <option value="DANA">DANA</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs">Referensi Pembayaran</label>
                <Input
                  placeholder="Mis. 'Transfer dari Rekening 123-456'"
                  value={paymentRef}
                  onChange={(e) => setPaymentRef(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs">Catatan Tambahan</label>
                <textarea
                  rows={2}
                  placeholder="Opsional"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                />
              </div>

              {error && <p className="text-xs text-destructive">{error}</p>}

              <Button type="submit" isLoading={submitting} className="w-full">
                Ajukan Top-Up
              </Button>
            </>
          )}
        </form>
      )}

      {/* Status history */}
      <TopUpHistory />
    </section>
  );
}

/**
 * Recent top-up history for this workspace (uses listTopUpInvoicesAction).
 */
function TopUpHistory() {
  const [invoices, setInvoices] = useState<
    Array<{
      id: string;
      amountMicroUsd: number;
      status: string;
      paymentMethod: string | null;
      paymentReference: string | null;
      paymentProofUrl: string | null;
      notes: string | null;
      adminNote: string | null;
      createdAt: Date | string;
      approvedAt: Date | null | string;
    }>
  >([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const { listTopUpInvoicesAction } = await import("../../application/use-cases/manage-topup-invoices");
    try {
      const rows = await listTopUpInvoicesAction();
      setInvoices(rows);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-medium">Riwayat Top-Up</h3>
        {!loading && (
          <button onClick={load} className="text-xs text-muted-foreground hover:text-foreground">
            <Loader2 className="size-3 animate-spin" />
          </button>
        )}
      </div>

      {loading ? (
        <p className="text-xs text-muted-foreground">Memuat...</p>
      ) : invoices.length === 0 ? (
        <p className="text-xs text-muted-foreground">Belum ada permintaan.</p>
      ) : (
        <div className="space-y-1">
          {invoices.map((inv) => (
            <div key={inv.id} className="flex items-center justify-between rounded-md border px-3 py-2 text-xs">
              <div>
                <span className="font-medium">
                  ${(inv.amountMicroUsd / 1_000_000).toFixed(0)}
                </span>
                {inv.paymentMethod && (
                  <span className="ml-1 text-muted-foreground">via {inv.paymentMethod}</span>
                )}
              </div>
              <div className="flex items-center gap-1">
                <StatusBadge status={inv.status} />
                <span className="text-muted-foreground">
                  {new Date(inv.createdAt).toLocaleDateString("id-ID")}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    pending: { label: "Menunggu", cls: "bg-amber-100 text-amber-800 border-amber-200" },
    approved: { label: "Disetujui", cls: "bg-emerald-100 text-emerald-800 border-emerald-200" },
    rejected: { label: "Ditolak", cls: "bg-red-100 text-red-800 border-red-200" },
    cancelled: { label: "Dibatalkan", cls: "bg-gray-200 text-gray-800 border-gray-300" },
  };
  const { label, cls } = map[status] ?? { label: status, cls: "" };
  return (
    <Badge variant="outline" className={cls}>
      {status === "approved" && <CheckCircle className="size-3 mr-0.5" />}
      {status === "rejected" && <XCircle className="size-3 mr-0.5" />}
      {status === "pending" && <Clock className="size-3 mr-0.5" />}
      {label}
    </Badge>
  );
}