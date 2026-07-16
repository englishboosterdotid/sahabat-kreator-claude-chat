"use client";

import { useEffect, useState } from "react";
import { Input } from "@/shared/presentation/components/ui/input";
import { Label } from "@/shared/presentation/components/ui/label";
import { Button } from "@/shared/presentation/components/ui/button";
import { Badge } from "@/shared/presentation/components/ui/badge";
import { DollarSign, AlertTriangle, Info, RefreshCw } from "lucide-react";
import { AI_PROVIDER_LABELS, requiresApiKey, requiresBaseUrl } from "../../domain/value-objects/provider-type.vo";
import type { AIProviderType } from "../../domain/value-objects/provider-type.vo";
import { saveAiProviderConfigAction } from "../../application/use-cases/save-ai-provider-config";
import { CURATED_SUMOPOD_MODELS, SUMOPOD_MODEL_PRICING } from "@/features/ai-provider/infrastructure/adapters/sumopod-pricing";
import { getAiProviderConfigAction } from "../../application/use-cases/get-ai-provider-config";
import type { AiProviderConfigView } from "../../application/use-cases/get-ai-provider-config";

const PROVIDER_OPTIONS: AIProviderType[] = ["platform_sumopod", "anthropic", "openai", "gemini", "custom"];

/** Micro-USD threshold at which the balance is considered "critical" (wallet red). */
const CRITICAL_BALANCE_THRESHOLD = 100_000; // $0.10

export function AiProviderSettingsForm({ initialConfig }: { initialConfig: AiProviderConfigView }) {
  const [providerType, setProviderType] = useState<AIProviderType>(initialConfig.providerType);
  const [apiKey, setApiKey] = useState("");
  const [baseUrl, setBaseUrl] = useState("");
  const [model, setModel] = useState(initialConfig.model ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [config, setConfig] = useState<AiProviderConfigView | null>(null);

  // Refresh config from server after mount (in case someone else changed it).
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data = await getAiProviderConfigAction();
        if (!cancelled) {
          setConfig(data);
          setProviderType(data.providerType);
        }
      } catch {
        // non-fatal — fall back to initialConfig
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setSaved(false);

    await saveAiProviderConfigAction({
      providerType,
      apiKey: requiresApiKey(providerType) ? apiKey : undefined,
      customBaseUrl: requiresBaseUrl(providerType) ? baseUrl : undefined,
      model: model || undefined,
    });

    setIsSaving(false);
    setSaved(true);
  }

  const displayConfig = config ?? initialConfig;
  const balanceUSD = (displayConfig.tokenBalanceMicroUsd / 1_000_000).toFixed(4);
  const isCritical = displayConfig.tokenBalanceMicroUsd <= CRITICAL_BALANCE_THRESHOLD;
  const isEmpty = displayConfig.tokenBalanceMicroUsd === 0;

  if (isLoading && !displayConfig) {
    return <div className="text-sm text-muted-foreground">Memuat pengaturan...</div>;
  }

  return (
    <section className="space-y-3 rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium flex items-center gap-2">
          <RefreshCw className="size-4 text-muted-foreground" />
          Konfigurasi Provider AI
        </h2>
      </div>

      {/* Balance indicator */}
      <div className="flex items-center gap-3 rounded-md bg-muted/40 p-3">
        <DollarSign className={`size-4 shrink-0 ${isEmpty ? "text-muted-foreground" : isCritical ? "text-amber-600" : "text-emerald-600"}`} />
        <div className="flex-1">
          <p className="text-sm font-medium">
            Saldo Token Platform
          </p>
          <p className="text-xl font-bold tabular-nums">
            ${parseFloat(balanceUSD).toFixed(2)}{" "}
            <span className="text-xs font-normal text-muted-foreground">
              ({displayConfig.tokenBalanceMicroUsd.toLocaleString()} micro-USD)
            </span>
          </p>
          {isCritical && !isEmpty && (
            <p className="text-xs text-amber-600 mt-0.5 flex items-center gap-1">
              <AlertTriangle className="size-3" /> Saldo hampir habis — minta top-up atau pakai API key sendiri.
            </p>
          )}
          {isEmpty && (
            <p className="text-xs text-destructive mt-0.5 flex items-center gap-1">
              <AlertTriangle className="size-3" /> Saldo habis — sistem akan otomatis gunakan API key sendiri (BYOK) atau blokir generate.
            </p>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="provider">Provider AI</Label>
          <select
            id="provider"
            value={providerType}
            onChange={(e) => setProviderType(e.target.value as AIProviderType)}
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
          >
            {PROVIDER_OPTIONS.map((type) => (
              <option key={type} value={type}>
                {AI_PROVIDER_LABELS[type]}
              </option>
            ))}
          </select>
          {providerType === "platform_sumopod" && (
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Info className="size-3" />
              Pakai token yang disediakan platform, tidak perlu API key sendiri.
            </p>
          )}
        </div>

        {requiresApiKey(providerType) && (
          <div className="space-y-1.5">
            <Label htmlFor="apiKey">API Key</Label>
            {displayConfig.hasApiKey ? (
              <div className="flex items-center gap-2 rounded-md border border-dashed px-3 py-2.5 text-sm text-muted-foreground bg-muted/20">
                <span>••••••••••••****</span>
                <p className="text-xs">(sudah diatur, isi untuk mengganti)</p>
              </div>
            ) : (
              <Input
                id="apiKey"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
              />
            )}
          </div>
        )}

        {requiresBaseUrl(providerType) && (
          <div className="space-y-1.5">
            <Label htmlFor="baseUrl">Base URL</Label>
            <Input
              id="baseUrl"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              placeholder="https://your-endpoint.com/v1"
            />
          </div>
        )}

        {providerType === "platform_sumopod" ? (
          <div className="space-y-1.5">
            <Label htmlFor="model">Model</Label>
            <select
              id="model"
              value={model || CURATED_SUMOPOD_MODELS[0]}
              onChange={(e) => setModel(e.target.value)}
              className="h-10 w-full rounded-md border bg-background px-3 text-sm"
            >
              {CURATED_SUMOPOD_MODELS.map((m) => {
                const pricing = SUMOPOD_MODEL_PRICING[m];
                return (
                  <option key={m} value={m}>
                    {m} (${pricing.input}/1M in, ${pricing.output}/1M out)
                  </option>
                );
              })}
            </select>
            <p className="text-xs text-muted-foreground">
              Model lebih murah = lebih hemat saldo token platform per generate.
            </p>
          </div>
        ) : (
          <div className="space-y-1.5">
            <Label htmlFor="model">Model</Label>
            <Input
              id="model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="claude-sonnet-4-6 / gpt-4o / gemini-2.5-pro"
            />
          </div>
        )}

        {saved && (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Pengaturan provider tersimpan.
          </Badge>
        )}

        <Button type="submit" isLoading={isSaving}>Simpan</Button>
      </form>
    </section>
  );
}