"use client";

import { useState } from "react";
import { ONE_STEP_PLATFORMS, TWO_STEP_PLATFORMS, type ReplizPlatform, REPLIZ_PLATFORM_LABELS } from "@/features/social-integration/domain/value-objects/repliz-platform.vo";
import { Button } from "@/shared/presentation/components/ui/button";
import { saveWorkspacePlatformOverrideAction } from "../../application/use-cases/save-workspace-platform-override";

type OverrideMap = Record<string, string>;

const ALL_PLATFORMS = [...ONE_STEP_PLATFORMS, ...TWO_STEP_PLATFORMS];

export function PlatformOverrideTabs({ initialOverrides }: { initialOverrides: OverrideMap }) {
  const [activePlatform, setActivePlatform] = useState<ReplizPlatform>(ALL_PLATFORMS[0]);
  const [overrides, setOverrides] = useState<OverrideMap>(initialOverrides);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSave() {
    setIsSaving(true);
    await saveWorkspacePlatformOverrideAction(activePlatform, overrides[activePlatform] ?? "");
    setIsSaving(false);
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2 overflow-x-auto">
        {ALL_PLATFORMS.map((platform) => (
          <button
            key={platform}
            onClick={() => setActivePlatform(platform)}
            className={`shrink-0 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              activePlatform === platform ? "bg-foreground text-background" : "border hover:bg-accent"
            }`}
          >
            {REPLIZ_PLATFORM_LABELS[platform]}
          </button>
        ))}
      </div>

      <textarea
        value={overrides[activePlatform] ?? ""}
        onChange={(e) => setOverrides({ ...overrides, [activePlatform]: e.target.value })}
        placeholder={`Penyesuaian tone khusus untuk ${REPLIZ_PLATFORM_LABELS[activePlatform]} (opsional, kosongkan kalau ikut brand voice utama)`}
        rows={3}
        className="w-full rounded-md border bg-background p-3 text-sm outline-none focus:border-foreground/40"
      />

      <Button type="button" isLoading={isSaving} onClick={handleSave}>
        Simpan Penyesuaian
      </Button>
    </div>
  );
}