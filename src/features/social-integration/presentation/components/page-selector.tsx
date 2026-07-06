"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ReplizTwoStepOption } from "../../infrastructure/repliz/repliz-client";
import { selectPageAction } from "../../application/use-cases/select-facebook-page";

export function PageSelector({
    platform,
    pages,
    reconnectAccountId,
    basePath,
}: {
    platform: string;
    pages: ReplizTwoStepOption[];
    reconnectAccountId?: string;
    basePath: string;
}) {
    const router = useRouter();
    const [isSaving, setIsSaving] = useState<string | null>(null);

    async function handleSelect(page: ReplizTwoStepOption) {
        setIsSaving(page.id);
        await selectPageAction(platform, page, reconnectAccountId);
        router.push(`${basePath}/social-integration?connected=${platform}`);
    }

    if (pages.length === 0) {
        return <p className="text-sm text-muted-foreground">Tidak ada akun yang bisa dihubungkan dari otorisasi ini.</p>;
    }

    return (
        <div className="space-y-2">
            {pages.map((page) => (
                <button
                    key={page.id}
                    onClick={() => handleSelect(page)}
                    disabled={isSaving !== null}
                    className="flex w-full items-center gap-3 rounded-lg border p-3 text-left hover:bg-accent/50 disabled:opacity-50"
                >
                    {page.picture && <img src={page.picture} alt="" className="size-10 rounded-full object-cover" />}
                    <div>
                        <p className="text-sm font-medium">{page.name}</p>
                        {page.username && <p className="text-xs text-muted-foreground">@{page.username}</p>}
                    </div>
                    {isSaving === page.id && <span className="ml-auto text-xs text-muted-foreground">Menyimpan...</span>}
                </button>
            ))}
        </div>
    );
}