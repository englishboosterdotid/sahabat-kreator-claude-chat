"use client";

import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/shared/presentation/components/ui/badge";
import { Button } from "@/shared/presentation/components/ui/button";
import { Card } from "@/shared/presentation/components/ui/card";
import { Input } from "@/shared/presentation/components/ui/input";
import { AlertTriangle, CheckCircle, Clock, DollarSign, Loader2, Search, XCircle } from "lucide-react";

interface Invoice {
  id: string;
  workspaceId: string;
  amountMicroUsd: number;
  status: string;
  paymentProofUrl: string | null;
  paymentMethod: string | null;
  paymentReference: string | null;
  notes: string | null;
  createdAt: Date | string;
}

type ApprovalAction = "approve" | "reject";

export default function AdminTopUpsPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [pendingTotal, setPendingTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionState, setActionState] = useState<{
    action: ApprovalAction | null;
    invoiceId: string;
    loading: boolean;
  }>({ action: null, invoiceId: "", loading: false });
  const [adminNote, setAdminNote] = useState("");

  const load = useCallback(async () => {
    const { getAllPlatformTopUpsAction } = await import(
      "@/features/ai-provider/application/use-cases/admin-topup-actions"
    );
    const result = await getAllPlatformTopUpsAction();
    setPendingTotal(result.pendingTotalMicroUsd);
    setInvoices(result.invoices);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = searchTerm
    ? invoices.filter(
        (inv) =>
          inv.id.startsWith(searchTerm) ||
          inv.workspaceId.startsWith(searchTerm) ||
          String(inv.amountMicroUsd).startsWith(searchTerm)
      )
    : invoices;

  const handleAction = async (action: ApprovalAction) => {
    setActionState({ action, invoiceId: actionState.invoiceId, loading: true });
    try {
      const { approveTopUpInvoiceAction, rejectTopUpInvoiceAction } = await import(
        "@/features/ai-provider/application/use-cases/admin-topup-actions"
      );
      if (action === "approve") {
        await approveTopUpInvoiceAction({ invoiceId: actionState.invoiceId, adminNote: adminNote || undefined });
      } else {
        if (!adminNote.trim()) {
          alert("Alasan penolakan wajib diisi.");
          setActionState({ action: null, invoiceId: "", loading: false });
          return;
        }
        await rejectTopUpInvoiceAction({ invoiceId: actionState.invoiceId, adminNote: adminNote.trim() });
      }
      await load();
      setActionState({ action: null, invoiceId: "", loading: false });
      setAdminNote("");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal memproses.");
      setActionState({ action: null, invoiceId: "", loading: false });
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <DollarSign className="size-5" />
            Manajemen Top-Up Saldo AI
          </h1>
          <p className="text-sm text-muted-foreground">
            Verifikasi pembayaran dan cairkan saldo AI token untuk workspace.
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={load}>
          <Loader2 className="size-3 animate-spin" />
        </Button>
      </div>

      {/* Summary card */}
      <Card className="flex items-center gap-6 p-4">
        <div className="text-center">
          <div className="text-3xl font-bold">{invoices.length}</div>
          <div className="text-xs text-muted-foreground">Permintaan pending</div>
        </div>
        <div className="h-12 w-px bg-border" />
        <div className="text-center">
          <div className="text-3xl font-bold tabular-nums">
            ${(pendingTotal / 1_000_000).toFixed(2)}
          </div>
          <div className="text-xs text-muted-foreground">Total pending (USD)</div>
        </div>
        {invoices.length > 0 && (
          <>
            <div className="h-12 w-px bg-border" />
            <div className="flex items-center gap-1 text-xs text-amber-600">
              <AlertTriangle className="size-3" />
              Perlu diverifikasi
            </div>
          </>
        )}
      </Card>

      {/* Search */}
      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
        <Input
          placeholder="Cari ID / workspace..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Invoice list */}
      {filtered.length === 0 ? (
        <div className="rounded-lg border p-8 text-center text-sm text-muted-foreground">
          Tidak ada permintaan top-up pending.
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((inv) => (
            <Card key={inv.id} className="overflow-hidden">
              <div className="flex items-start justify-between p-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={inv.status} />
                    <span className="text-xs font-medium tabular-nums">
                      ${((inv.amountMicroUsd / 1_000_000).toFixed(2))}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center gap-2">
                    <span>ID: <code className="rounded bg-muted px-1">{inv.id.slice(0, 8)}</code></span>
                    <span>Workspace: <code className="rounded bg-muted px-1">{inv.workspaceId.slice(0, 8)}</code></span>
                  </div>
                  {inv.paymentMethod && (
                    <p className="text-xs">
                      Via: <span className="font-medium">{inv.paymentMethod}</span>
                      {inv.paymentReference && ` — ${inv.paymentReference}`}
                    </p>
                  )}
                  {inv.notes && (
                    <p className="text-xs italic text-muted-foreground">{inv.notes}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Diajukan: {new Date(inv.createdAt).toLocaleString("id-ID")}
                  </p>
                </div>

                {/* Actions */}
                {actionState.invoiceId === inv.id ? (
                  <div className="space-y-2 w-72">
                    {inv.status === "pending" && (
                      <>
                        <Input
                          placeholder="Catatan admin (opsional)"
                          value={adminNote}
                          onChange={(e) => setAdminNote(e.target.value)}
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="default"
                            isLoading={actionState.loading}
                            onClick={() => handleAction("approve")}
                            className="flex-1"
                          >
                            <CheckCircle className="size-3.5 mr-1" /> Terima
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            isLoading={actionState.loading}
                            onClick={() => handleAction("reject")}
                            className="flex-1"
                          >
                            <XCircle className="size-3.5 mr-1" /> Tolak
                          </Button>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setActionState({ action: null, invoiceId: "", loading: false })}
                          className="w-full"
                        >
                          Batal
                        </Button>
                      </>
                    )}
                  </div>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={inv.status !== "pending"}
                    onClick={() => {
                      setActionState({ ...actionState, invoiceId: inv.id });
                      setAdminNote(inv.status === "rejected" ? "" : adminNote);
                    }}
                  >
                    Periksa
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; icon: React.ReactNode; cls: string }> = {
    pending: {
      label: "Pending",
      icon: <Clock className="size-3 mr-0.5" />,
      cls: "bg-amber-100 text-amber-800 border-amber-200",
    },
    approved: {
      label: "Disetujui",
      icon: <CheckCircle className="size-3 mr-0.5" />,
      cls: "bg-emerald-100 text-emerald-800 border-emerald-200",
    },
    rejected: {
      label: "Ditolak",
      icon: <XCircle className="size-3 mr-0.5" />,
      cls: "bg-red-100 text-red-800 border-red-200",
    },
  };
  const { label, icon, cls } = map[status] ?? { label: status, icon: null, cls: "bg-gray-100" };
  return (
    <Badge variant="outline" className={cls}>
      {icon}
      {label}
    </Badge>
  );
}