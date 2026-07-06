"use client";

import { useState, useEffect } from "react";
import { listDraftOptionsAction } from "../../application/use-cases/list-draft-options";
import { SOCIAL_PLATFORM_REGISTRY } from "@/features/social-integration/presentation/constants/platform-registry";

type DraftOption = {
  id: string;
  caption: string;
  platform: string;
  selectedHook: string;
  createdAt: Date;
};

export function SourcePicker({
  onSelect,
}: {
  onSelect: (sourceText: string, sourcePlatform: string, sourceContentId: string | null) => void;
}) {
  const [tab, setTab] = useState<"draft" | "paste">("draft");
  const [drafts, setDrafts] = useState<DraftOption[]>([]);
  const [pastedText, setPastedText] = useState("");
  const [pastedPlatform, setPastedPlatform] = useState("instagram");

  useEffect(() => {
    if (tab === "draft") {
      listDraftOptionsAction().then((result) => setDrafts(result as DraftOption[]));
    }
  }, [tab]);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setTab("draft")}
          className={`px-3 py-2 text-sm font-medium ${tab === "draft" ? "border-b-2 border-foreground" : "text-muted-foreground"}`}
        >
          Pilih dari Draft
        </button>
        <button
          onClick={() => setTab("paste")}
          className={`px-3 py-2 text-sm font-medium ${tab === "paste" ? "border-b-2 border-foreground" : "text-muted-foreground"}`}
        >
          Paste Teks Bebas
        </button>
      </div>

      {tab === "draft" ? (
        <div className="space-y-2">
          {drafts.length === 0 && <p className="text-sm text-muted-foreground">Belum ada draft tersimpan.</p>}
          {drafts.map((draft) => (
            <button
              key={draft.id}
              onClick={() => onSelect(draft.caption, draft.platform, draft.id)}
              className="block w-full rounded-md border p-3 text-left text-sm hover:bg-accent/50"
            >
              <span className="font-medium">{SOCIAL_PLATFORM_REGISTRY[draft.platform as keyof typeof SOCIAL_PLATFORM_REGISTRY]?.label ?? draft.platform}</span>
              <p className="line-clamp-2 text-xs text-muted-foreground mt-1">{draft.caption}</p>
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          <textarea
            value={pastedText}
            onChange={(e) => setPastedText(e.target.value)}
            rows={6}
            placeholder="Paste caption lama atau teks apa pun yang mau ditransform..."
            className="w-full rounded-md border bg-background p-3 text-sm outline-none focus:border-foreground/40"
          />
          <select
            value={pastedPlatform}
            onChange={(e) => setPastedPlatform(e.target.value)}
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
          >
            {Object.entries(SOCIAL_PLATFORM_REGISTRY).map(([key, val]) => (
              <option key={key} value={key}>{val.label} (platform asal)</option>
            ))}
          </select>
          <button
            onClick={() => onSelect(pastedText, pastedPlatform, null)}
            disabled={pastedText.trim().length < 10}
            className="w-full rounded-md bg-foreground py-2 text-sm font-medium text-background disabled:opacity-50"
          >
            Lanjutkan dengan teks ini
          </button>
        </div>
      )}
    </div>
  );
}