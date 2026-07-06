"use client";

import { useState } from "react";
import { Input } from "@/shared/presentation/components/ui/input";
import { Label } from "@/shared/presentation/components/ui/label";
import { Button } from "@/shared/presentation/components/ui/button";
import { ONE_STEP_PLATFORMS, TWO_STEP_PLATFORMS, type ReplizPlatform, REPLIZ_PLATFORM_LABELS } from "@/features/social-integration/domain/value-objects/repliz-platform.vo";

const ALL_PLATFORMS = [...ONE_STEP_PLATFORMS, ...TWO_STEP_PLATFORMS];

export function ContentBriefForm({
  onGenerate,
  isGenerating,
  initialBrief,
}: {
  onGenerate: (brief: string, platform: string) => void;
  isGenerating: boolean;
  initialBrief?: string;
}) {
  const [brief, setBrief] = useState(initialBrief ?? "");
  const [platform, setPlatform] = useState<ReplizPlatform>(ALL_PLATFORMS[0]);

  return (  
    <div className="space-y-4 max-w-xl">
      <div className="space-y-1.5">
        <Label htmlFor="brief">Ceritakan topik/produk yang ingin dibahas</Label>
        <textarea
          id="brief"
          value={brief}
          onChange={(e) => setBrief(e.target.value)}
          rows={4}
          placeholder="Contoh: peluncuran produk skincare baru, serum vitamin C untuk kulit kusam"
          className="w-full rounded-md border bg-background p-3 text-sm outline-none focus:border-foreground/40"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="platform">Platform tujuan</Label>
        <select
  id="platform"
  value={platform}
  onChange={(e) => setPlatform(e.target.value as ReplizPlatform)}
  className="h-10 w-full rounded-md border bg-background px-3 text-sm"
>
          {ALL_PLATFORMS.map((p) => (
            <option key={p} value={p}>{REPLIZ_PLATFORM_LABELS[p]}</option>
          ))}
        </select>
      </div>

      <Button
        type="button"
        isLoading={isGenerating}
        disabled={brief.trim().length < 5}
        onClick={() => onGenerate(brief, platform)}
      >
        Generate Ide Konten
      </Button>
    </div>
  );
}