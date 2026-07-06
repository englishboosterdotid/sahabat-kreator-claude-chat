"use client";

import { useState } from "react";
import { Input } from "@/shared/presentation/components/ui/input";
import { Label } from "@/shared/presentation/components/ui/label";
import { Button } from "@/shared/presentation/components/ui/button";
import { BrandVoiceAiAnalyzer } from "./brand-voice-ai-analyzer";
import { saveBrandVoiceAction } from "../../application/use-cases/save-brand-voice";
import type { BrandVoiceAnalysisResult } from "../../infrastructure/ai/brand-voice-analyzer";

type InitialData = {
  toneDescription: string;
  personalityTraits: string[];
  dos: string[];
  donts: string[];
  targetAudience: string;
  brandName?: string;
  tagline?: string;
  industry?: string;
};



export function BrandVoiceForm({ initialData }: { initialData?: InitialData }) {
  const [toneDescription, setToneDescription] = useState(initialData?.toneDescription ?? "");
  const [personalityTraits, setPersonalityTraits] = useState(
    (initialData?.personalityTraits ?? []).join(", ")
  );
  const [dos, setDos] = useState((initialData?.dos ?? []).join("\n"));
  const [donts, setDonts] = useState((initialData?.donts ?? []).join("\n"));
  const [targetAudience, setTargetAudience] = useState(initialData?.targetAudience ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const INDUSTRY_SUGGESTIONS = [
  "Skincare & Kosmetik", "Makanan & Minuman", "Fashion", "Kesehatan & Suplemen",
  "Teknologi & SaaS", "Jasa & Konsultasi", "Pendidikan", "Retail & E-commerce", "Lainnya",
];
const [brandName, setBrandName] = useState(initialData?.brandName ?? "");
const [tagline, setTagline] = useState(initialData?.tagline ?? "");
const [industry, setIndustry] = useState(initialData?.industry ?? "");


  function handleApplyAiResult(result: BrandVoiceAnalysisResult) {
    setToneDescription(result.toneDescription);
    setPersonalityTraits(result.personalityTraits.join(", "));
    setDos(result.dos.join("\n"));
    setDonts(result.donts.join("\n"));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setSaved(false);

    await saveBrandVoiceAction({
      toneDescription,
      personalityTraits: personalityTraits.split(",").map((s) => s.trim()).filter(Boolean),
      dos: dos.split("\n").map((s) => s.trim()).filter(Boolean),
      donts: donts.split("\n").map((s) => s.trim()).filter(Boolean),
      targetAudience,
      brandName,
      tagline,
      industry,
    });

    setIsSaving(false);
    setSaved(true);
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <BrandVoiceAiAnalyzer onApply={handleApplyAiResult} />

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="tone">Deskripsi tone</Label>
          <Input
            id="tone"
            value={toneDescription}
            onChange={(e) => setToneDescription(e.target.value)}
            placeholder="Contoh: santai, hangat, sedikit humoris"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="traits">Kepribadian brand (pisahkan dengan koma)</Label>
          <Input
            id="traits"
            value={personalityTraits}
            onChange={(e) => setPersonalityTraits(e.target.value)}
            placeholder="ramah, expert, to-the-point"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="dos">Selalu lakukan (1 poin per baris)</Label>
          <textarea
            id="dos"
            value={dos}
            onChange={(e) => setDos(e.target.value)}
            rows={3}
            className="w-full rounded-md border bg-background p-3 text-sm outline-none focus:border-foreground/40"
          />
        </div>
        <div className="space-y-1.5">
  <Label htmlFor="brandName">Nama Brand</Label>
  <Input id="brandName" value={brandName} onChange={(e) => setBrandName(e.target.value)} placeholder="Contoh: Kopi Senja" />
</div>

<div className="space-y-1.5">
  <Label htmlFor="tagline">Tagline (opsional)</Label>
  <Input id="tagline" value={tagline} onChange={(e) => setTagline(e.target.value)} placeholder="Contoh: Ngopi santai, obrolan hangat" />
</div>

<div className="space-y-1.5">
  <Label htmlFor="industry">Industri</Label>
  <Input id="industry" list="industry-suggestions" value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder="Pilih atau ketik industri kamu" />
  <datalist id="industry-suggestions">
    {INDUSTRY_SUGGESTIONS.map((s) => <option key={s} value={s} />)}
  </datalist>
</div>

        <div className="space-y-1.5">
          <Label htmlFor="donts">Hindari (1 poin per baris)</Label>
          <textarea
            id="donts"
            value={donts}
            onChange={(e) => setDonts(e.target.value)}
            rows={3}
            className="w-full rounded-md border bg-background p-3 text-sm outline-none focus:border-foreground/40"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="audience">Target audiens</Label>
          <Input
            id="audience"
            value={targetAudience}
            onChange={(e) => setTargetAudience(e.target.value)}
            placeholder="Contoh: wanita 20-35 tahun, tertarik skincare lokal"
          />
        </div>

        {saved && <p className="text-sm text-green-600">Brand voice tersimpan.</p>}

        <Button type="submit" isLoading={isSaving}>
          Simpan Brand Voice
        </Button>
      </form>
    </div>
  );
}