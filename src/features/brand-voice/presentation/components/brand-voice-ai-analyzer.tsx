"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/shared/presentation/components/ui/button";
import { analyzeBrandVoiceAction } from "../../application/use-cases/analyze-brand-voice-from-samples";
import type { BrandVoiceAnalysisResult } from "../../infrastructure/ai/brand-voice-analyzer";

export function BrandVoiceAiAnalyzer({
  onApply,
}: {
  onApply: (result: BrandVoiceAnalysisResult) => void;
}) {
  const [sample, setSample] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<BrandVoiceAnalysisResult | null>(null);

  async function handleAnalyze() {
    setIsAnalyzing(true);
    setError(null);
    try {
      const data = await analyzeBrandVoiceAction(sample);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analisis gagal, coba lagi.");
    } finally {
      setIsAnalyzing(false);
    }
  }

  return (
    <div className="space-y-3 rounded-lg border p-4">
      <div className="flex items-center gap-2">
        <Sparkles size={16} className="text-foreground" />
        <p className="text-sm font-medium">Analisa otomatis dari sample konten (opsional)</p>
      </div>

      <textarea
        value={sample}
        onChange={(e) => setSample(e.target.value)}
        placeholder="Paste beberapa caption/postingan yang mewakili gaya bicara brand kamu..."
        rows={5}
        className="w-full rounded-md border bg-background p-3 text-sm outline-none focus:border-foreground/40"
      />

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button
        type="button"
        variant="outline"
        isLoading={isAnalyzing}
        onClick={handleAnalyze}
        disabled={sample.trim().length < 50}
      >
        Analisa dengan AI
      </Button>

      {result && (
        <div className="space-y-2 rounded-md bg-accent/50 p-3">
          <p className="text-xs text-muted-foreground">{result.summary}</p>
          <Button type="button" onClick={() => onApply(result)}>
            Terapkan ke form
          </Button>
        </div>
      )}
    </div>
  );
}