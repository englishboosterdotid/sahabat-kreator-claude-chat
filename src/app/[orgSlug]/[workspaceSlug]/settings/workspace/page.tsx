"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/shared/presentation/components/ui/input";
import { Button } from "@/shared/presentation/components/ui/button";
import { useOrgSession } from "@/shared/infrastructure/context/org-session-context";
import {
  updateWorkspaceAction,
  deleteWorkspaceAction,
} from "@/features/organization-member/application/use-cases/update-workspace";
import { AiProviderSettingsForm } from "@/features/ai-provider/presentation/components/ai-provider-settings-form";
import { TopUpRequestForm } from "@/features/ai-provider/presentation/components/top-up-request-form";
import { BalanceWarningBanner } from "@/features/ai-provider/presentation/components/balance-warning-banner";
import { UsageAnalyticsChart } from "@/features/ai-provider/presentation/components/usage-analytics-chart";
import { getAiProviderConfigAction } from "@/features/ai-provider/application/use-cases/get-ai-provider-config";
import type { AiProviderConfigView } from "@/features/ai-provider/application/use-cases/get-ai-provider-config";
import { cn } from "@/shared/lib/utils";

export default function WorkspaceSettingsPage() {
  const router = useRouter();
  const { data: sessionData } = useOrgSession();
  const [name, setName] = useState(sessionData?.teamName ?? "");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [success, setSuccess] = useState<string | null>(null);
  const [initialConfig, setInitialConfig] = useState<AiProviderConfigView | null>(null);
  const [activeTab, setActiveTab] = useState<"settings" | "ai" | "usage">("settings");
  const [usageStats, setUsageStats] = useState<UsageStatsEntry | null>(null);

  // Load AI config server-side once when session resolves.
  useEffect(() => {
    if (!sessionData?.teamId) return;
    let cancelled = false;
    (async () => {
      try {
        const config = await getAiProviderConfigAction();
        if (!cancelled) setInitialConfig(config);
      } catch {
        // non-fatal — form has safe defaults
      }
    })();
    return () => { cancelled = true; };
  }, [sessionData?.teamId]);

  // Load usage stats when switching to AI/Usage tab
  useEffect(() => {
    if (activeTab !== "usage" || !sessionData?.teamId) return;
    let cancelled = false;
    (async () => {
      try {
        const { getUsageStatisticsAction } = await import("@/features/ai-provider/application/use-cases/get-usage-statistics");
        const stats = await getUsageStatisticsAction();
        if (!cancelled) setUsageStats(stats);
      } catch {
        // ignore
      }
    })();
    return () => { cancelled = true; };
  }, [activeTab, sessionData?.teamId]);

  const handleSave = useCallback(async () => {
    if (!name.trim()) return;
    setIsUpdating(true);
    setSuccess(null);
    try {
      await updateWorkspaceAction({ name });
      setSuccess("Workspace berhasil diperbarui.");
      setTimeout(() => setSuccess(null), 3000);
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal memperbarui.");
    } finally {
      setIsUpdating(false);
    }
  }, [name, router]);

  const handleDelete = useCallback(async () => {
    if (deleteConfirm !== sessionData?.teamName) return;
    setIsDeleting(true);
    try {
      await deleteWorkspaceAction();
      // Bounce to first remaining workspace or root.
      window.location.href = sessionData?.organizationSlug
        ? `/${sessionData.organizationSlug}`
        : "/";
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal menghapus workspace.");
    } finally {
      setIsDeleting(false);
    }
  }, [deleteConfirm, sessionData?.teamName, sessionData?.organizationSlug]);

  if (!sessionData) return <p className="p-6">Memuat workspace...</p>;

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold">Pengaturan Workspace</h1>
        <p className="text-sm text-muted-foreground">
          Pengaturan spesifik untuk workspace aktif.
        </p>
      </div>

      <div className="flex items-center gap-1 border-b">
        <TabButton current={activeTab} value="settings" onClick={setActiveTab}>
          Detail
        </TabButton>
        <TabButton current={activeTab} value="ai" onClick={setActiveTab}>
          AI Provider
        </TabButton>
        <TabButton current={activeTab} value="usage" onClick={setActiveTab}>
          Pemakaian
        </TabButton>
      </div>

      {activeTab === "settings" && (
        <section className="space-y-3 rounded-lg border p-4">
          <h2 className="text-sm font-medium">Detail Workspace</h2>

          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Nama Workspace</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama workspace"
            />
            <p className="text-xs text-muted-foreground">
              Slug saat ini: <code className="rounded bg-muted px-1">{sessionData.teamSlug}</code> — tidak dapat diubah untuk menjaga URL stabil.
            </p>
          </div>

          {success && <p className="text-xs text-green-600">{success}</p>}

          <Button onClick={handleSave} isLoading={isUpdating}>
            Simpan Perubahan
          </Button>
        </section>
      )}

      {activeTab === "ai" && (
        <>
          {initialConfig ? (
            <>
              <BalanceWarningBanner
                balanceMicroUsd={initialConfig.tokenBalanceMicroUsd}
                providerType={initialConfig.providerType}
              />
              <AiProviderSettingsForm initialConfig={initialConfig} />
              <TopUpRequestForm />
            </>
          ) : (
            <section className="rounded-lg border p-4 text-sm text-muted-foreground">
              Memuat konfigurasi AI...
            </section>
          )}
        </>
      )}

      {activeTab === "usage" && (
        <section className="space-y-3 rounded-lg border p-4">
          <h2 className="text-sm font-medium">Statistik Pemakaian AI (30 hari)</h2>
          {usageStats ? (
            <UsageAnalyticsChart stats={usageStats} />
          ) : (
            <p className="text-sm text-muted-foreground">Memuat data pemakaian...</p>
          )}
        </section>
      )}

      <section className="space-y-3 rounded-lg border border-destructive/30 p-4">
        <h2 className="text-sm font-medium text-destructive">Hapus Workspace</h2>
        <p className="text-xs text-muted-foreground">
          Menghapus workspace akan menghapus semua konten, jadwal, knowledge, dan
          konfigurasi AI terkait. Anggota workspace akan kehilangan akses.
        </p>

        <Input
          value={deleteConfirm}
          onChange={(e) => setDeleteConfirm(e.target.value)}
          placeholder={`Ketik "${sessionData.teamName}" untuk konfirmasi`}
          className="max-w-sm"
        />
        <Button
          variant="destructive"
          onClick={handleDelete}
          isLoading={isDeleting}
          disabled={deleteConfirm !== sessionData.teamName}
        >
          Hapus Workspace
        </Button>
      </section>
    </div>
  );
}

function TabButton({
  current,
  value,
  onClick,
  children,
}: {
  current: "settings" | "ai" | "usage";
  value: "settings" | "ai" | "usage";
  onClick: (v: "settings" | "ai" | "usage") => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={() => onClick(value)}
      className={cn(
        "border-b-2 px-4 py-2 text-sm transition-colors",
        current === value
          ? "border-primary text-primary font-medium"
          : "border-transparent text-muted-foreground hover:text-foreground"
      )}
    >
      {children}
    </button>
  );
}

type UsageStatsEntry = {
  totals: {
    totalCost: number;
    totalInput: number;
    totalOutput: number;
    callCount: number;
  };
  perFeature: Array<{
    feature: string | null;
    callCount: number;
    totalCost: number;
  }>;
  perDay: Array<{
    day: string;
    totalCost: number;
    callCount: number;
  }>;
  recent: unknown[];
};
