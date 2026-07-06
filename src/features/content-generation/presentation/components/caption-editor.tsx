"use client";

import { useState } from "react";
import { Button } from "@/shared/presentation/components/ui/button";
import { checkContentComplianceAction } from "@/features/compliance-checker/application/use-cases/check-content-compliance";
import { ComplianceCheckResultView } from "@/features/compliance-checker/presentation/components/compliance-check-result";
import type { ComplianceCheckResult } from "@/features/compliance-checker/domain/entities/compliance-issue.entity";


export function CaptionEditor({
  initialCaption,
  initialHashtags,
  onSave,
  isSaving,
}: {
  initialCaption: string;
  initialHashtags: string[];
  onSave: (caption: string, hashtags: string[]) => void;
  isSaving: boolean;
}) {
  const [caption, setCaption] = useState(initialCaption);
  const [hashtags, setHashtags] = useState(initialHashtags.join(" "));
const [complianceResult, setComplianceResult] = useState<ComplianceCheckResult | null>(null);
const [isChecking, setIsChecking] = useState(false);

async function handleCheckCompliance() {
  setIsChecking(true);
  try {
    const result = await checkContentComplianceAction(caption);
    setComplianceResult(result);
  } catch (err) {
    // tampilkan error secukupnya, tidak perlu blocking form utama
  } finally {
    setIsChecking(false);
  }
}
  return (
    <div className="space-y-4 max-w-xl">
      <textarea
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        rows={8}
        className="w-full rounded-md border bg-background p-3 text-sm outline-none focus:border-foreground/40"
      />
      <input
        value={hashtags}
        onChange={(e) => setHashtags(e.target.value)}
        placeholder="#hashtag1 #hashtag2"
        className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:border-foreground/40"
      />
      <Button
        type="button"
        isLoading={isSaving}
        onClick={() => onSave(caption, hashtags.split(" ").map((h) => h.trim()).filter(Boolean))}
      >
        Simpan Konten
      </Button>
      <button
  type="button"
  onClick={handleCheckCompliance}
  disabled={isChecking}
  className="text-xs font-medium text-blue-600 hover:underline disabled:opacity-50"
>
  {isChecking ? "Mengecek..." : "🔍 Cek Compliance"}
</button>

{complianceResult && <ComplianceCheckResultView result={complianceResult} />}
    </div>
  );
}