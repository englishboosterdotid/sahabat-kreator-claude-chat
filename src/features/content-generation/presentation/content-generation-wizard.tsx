"use client";

import { useState } from "react";
import { ContentBriefForm } from "./components/content-brief-form";
import { ContentIdeaList } from "./components/content-idea-list";
import { CaptionEditor } from "./components/caption-editor";
import { generateContentIdeasAction } from "../application/use-cases/generate-content-ideas";
import { generateCaptionFromIdeaAction } from "../application/use-cases/generate-caption-from-idea";
import { saveGeneratedContentAction } from "../application/use-cases/save-generated-content";
import type { ContentIdea } from "../domain/entities/content-idea.entity";

type Step = "brief" | "ideas" | "caption" | "done";

export function ContentGenerationWizard({ prefillBrief }: { prefillBrief?: string }) {
  const [step, setStep] = useState<Step>("brief");
  const [brief, setBrief] = useState("");
  const [platform, setPlatform] = useState<"instagram" | "tiktok" | "youtube" | "facebook" | "x">("instagram");
  const [ideas, setIdeas] = useState<ContentIdea[]>([]);
  const [selectedIdea, setSelectedIdea] = useState<ContentIdea | null>(null);
  const [caption, setCaption] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerateIdeas(briefInput: string, platformInput: string) {
    setBrief(briefInput);
    setPlatform(platformInput as typeof platform);
    setIsLoading(true);
    setError(null);
    try {
      const result = await generateContentIdeasAction(briefInput, platformInput);
      setIdeas(result);
      setStep("ideas");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal generate ide.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSelectIdea(idea: ContentIdea) {
    setSelectedIdea(idea);
    setIsLoading(true);
    setError(null);
    try {
      const result = await generateCaptionFromIdeaAction(idea, platform);
      setCaption(result.caption);
      setHashtags(result.hashtags);
      setStep("caption");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal generate caption.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSaveCaption(finalCaption: string, finalHashtags: string[]) {
    if (!selectedIdea) return;
    setIsLoading(true);
    try {
      await saveGeneratedContentAction({
        brief,
        platform,
        idea: selectedIdea,
        caption: finalCaption,
        hashtags: finalHashtags,
      });
      setStep("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan konten.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {error && <p className="text-sm text-destructive">{error}</p>}

      {step === "brief" && (
        <ContentBriefForm onGenerate={handleGenerateIdeas} isGenerating={isLoading} initialBrief={prefillBrief} />
      )}

      {step === "ideas" && (
        <ContentIdeaList
          ideas={ideas}
          onSelect={handleSelectIdea}
          onRegenerate={() => handleGenerateIdeas(brief, platform)}
          isRegenerating={isLoading}
        />
      )}

      {step === "caption" && (
        <CaptionEditor
          initialCaption={caption}
          initialHashtags={hashtags}
          onSave={handleSaveCaption}
          isSaving={isLoading}
        />
      )}

      {step === "done" && (
        <div className="space-y-3 rounded-lg border p-6 text-center">
          <p className="text-sm font-medium">Konten tersimpan sebagai draft.</p>
          <button
            onClick={() => {
              setStep("brief");
              setBrief("");
              setIdeas([]);
              setSelectedIdea(null);
            }}
            className="text-sm text-muted-foreground hover:text-foreground underline"
          >
            Buat konten baru
          </button>
        </div>
      )}
    </div>
  );
}