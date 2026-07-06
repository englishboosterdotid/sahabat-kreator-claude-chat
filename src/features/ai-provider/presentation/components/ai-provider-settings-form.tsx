"use client";

import { useState } from "react";
import { Input } from "@/shared/presentation/components/ui/input";
import { Label } from "@/shared/presentation/components/ui/label";
import { Button } from "@/shared/presentation/components/ui/button";
import { AI_PROVIDER_LABELS, requiresApiKey, requiresBaseUrl } from "../../domain/value-objects/provider-type.vo";
import type { AIProviderType } from "../../domain/value-objects/provider-type.vo";
import { saveAiProviderConfigAction } from "../../application/use-cases/save-ai-provider-config";
import { CURATED_SUMOPOD_MODELS, SUMOPOD_MODEL_PRICING } from "@/features/ai-provider/infrastructure/adapters/sumopod-pricing";

const PROVIDER_OPTIONS: AIProviderType[] = ["platform_sumopod", "anthropic", "openai", "gemini", "custom"];

export function AiProviderSettingsForm({ initialProviderType }: { initialProviderType: AIProviderType }) {
  const [providerType, setProviderType] = useState<AIProviderType>(initialProviderType);
  const [apiKey, setApiKey] = useState("");
  const [baseUrl, setBaseUrl] = useState("");
  const [model, setModel] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

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

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-4">
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
          <p className="text-xs text-muted-foreground">
            Pakai token yang disediakan platform, tidak perlu API key sendiri.
          </p>
        )}
      </div>

      {requiresApiKey(providerType) && (
        <div className="space-y-1.5">
          <Label htmlFor="apiKey">API Key</Label>
          <Input
            id="apiKey"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-..."
          />
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

      {saved && <p className="text-sm text-green-600">Pengaturan provider tersimpan.</p>}

      <Button type="submit" isLoading={isSaving}>Simpan</Button>
    </form>
  );
}