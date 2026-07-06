"use client";

import { TRANSFORM_MODE_LABELS, type TransformMode } from "../../domain/value-objects/transform-mode.vo";
import { SOCIAL_PLATFORM_REGISTRY } from "@/features/social-integration/presentation/constants/platform-registry";
import { Button } from "@/shared/presentation/components/ui/button";
import { useState } from "react";


export function TransformModeSelector({
  sourcePlatform,
  onGenerate,
  isGenerating,
}: {
  sourcePlatform: string;
  onGenerate: (mode: TransformMode, targetPlatform: string, count: number) => void;
  isGenerating: boolean;
}) {
  const [mode, setMode] = useState<TransformMode>("variant");
  const [slideCount, setSlideCount] = useState(6);
  const [targetPlatform, setTargetPlatform] = useState(
    Object.keys(SOCIAL_PLATFORM_REGISTRY).find((p) => p !== sourcePlatform) ?? "tiktok"
  );
  const [count, setCount] = useState(3);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {(Object.keys(TRANSFORM_MODE_LABELS) as TransformMode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`rounded-lg border p-3 text-left transition-colors ${mode === m ? "border-foreground bg-accent/50" : ""}`}
          >
            <p className="text-sm font-medium">{TRANSFORM_MODE_LABELS[m].label}</p>
            <p className="text-xs text-muted-foreground">{TRANSFORM_MODE_LABELS[m].description}</p>
          </button>
        ))}
      </div>

      {mode === "repurpose" && (
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Platform tujuan</label>
          <select
            value={targetPlatform}
            onChange={(e) => setTargetPlatform(e.target.value)}
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
          >
            {Object.entries(SOCIAL_PLATFORM_REGISTRY)
              .filter(([key]) => key !== sourcePlatform)
              .map(([key, val]) => (
                <option key={key} value={key}>{(val as { label: string }).label}</option>
              ))}
          </select>
        </div>
      )}

      {mode === "variant" && (
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Jumlah variasi</label>
          <select
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
          >
            {[2, 3, 4, 5].map((n) => <option key={n} value={n}>{n} variasi</option>)}
          </select>
        </div>
      )}

      {mode === "carousel" && (
  <div className="space-y-1.5">
    <label className="text-sm font-medium">Jumlah slide</label>
    <select value={slideCount} onChange={(e) => setSlideCount(Number(e.target.value))} className="h-10 w-full rounded-md border bg-background px-3 text-sm">
      {[4, 5, 6, 7, 8].map((n) => <option key={n} value={n}>{n} slide</option>)}
    </select>
  </div>
)}

      <Button
        type="button"
        isLoading={isGenerating}
        onClick={() => onGenerate(mode, targetPlatform, count)}
      >
        Generate
      </Button>
    </div>
  );
}