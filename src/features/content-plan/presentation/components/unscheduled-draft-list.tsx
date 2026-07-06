"use client";

import { SOCIAL_PLATFORM_REGISTRY } from "@/features/social-integration/presentation/constants/platform-registry";

type Draft = { id: string; caption: string; platform: string; selectedHook: string; selectedPillar: string };

export function UnscheduledDraftList({ drafts, onSchedule }: { drafts: Draft[]; onSchedule: (draft: Draft) => void }) {
    if (drafts.length === 0) {
        return <p className="text-sm text-muted-foreground">Tidak ada draft yang belum dijadwalkan.</p>;
    }

    return (
        <div className="space-y-2">
            {drafts.map((draft) => (
                <button
                    key={draft.id}
                    onClick={() => onSchedule(draft)}
                    className="block w-full rounded-md border p-3 text-left text-sm hover:bg-accent/50"
                >
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-medium">{SOCIAL_PLATFORM_REGISTRY[draft.platform as keyof typeof SOCIAL_PLATFORM_REGISTRY]?.label ?? draft.platform}</span>
                        <span className="rounded-full bg-accent px-1.5 py-0.5 text-xs">{draft.selectedPillar}</span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{draft.caption}</p>
                </button>
            ))}
        </div>
    );
}