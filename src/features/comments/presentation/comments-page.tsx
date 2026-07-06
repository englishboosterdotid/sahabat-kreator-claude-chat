"use client";

import { useState, useEffect, useCallback, useTransition } from "react";
import { listCommentsAction } from "../application/use-cases/list-comments";
import { replyCommentAction, updateCommentStatusAction } from "../application/use-cases/manage-comment";
import { getConnectedAccountsAction } from "@/features/social-integration/application/use-cases/get-connected-accounts";
import type { ReplizComment } from "@/features/social-integration/infrastructure/repliz/repliz-client";
import { Button } from "@/shared/presentation/components/ui/button";
import { Input } from "@/shared/presentation/components/ui/input";
import { EmptyState } from "@/shared/presentation/components/ui/empty-state";
import { Spinner } from "@/shared/presentation/components/ui/spinner";

type StatusFilter = "all" | "pending" | "resolved" | "ignored";

export function CommentsPage() {
    const [connectedAccountIds, setConnectedAccountIds] = useState<string[]>([]);
    const [page, setPage] = useState(1);
    const [status, setStatus] = useState<StatusFilter>("pending");
    const [search, setSearch] = useState("");
    const [docs, setDocs] = useState<ReplizComment[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [replyText, setReplyText] = useState("");
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        getConnectedAccountsAction()
            .then((res) => setConnectedAccountIds(res.accountIds))
            .catch(() => setConnectedAccountIds([]));
    }, []);

    const load = useCallback(async () => {
        setLoading(true);
        const result = await listCommentsAction({
            page,
            limit: 20,
            status: status === "all" ? undefined : status,
            accountIds: connectedAccountIds,
            search: search.trim() ? search.trim() : undefined,
        });
        setDocs(result.docs);
        setTotalPages(result.totalPages ?? 1);
        setLoading(false);
    }, [page, status, search, connectedAccountIds]);

    useEffect(() => { load(); }, [load]);

    const submitReply = (commentId: string) => {
        if (!replyText.trim()) return;
        startTransition(async () => {
            await replyCommentAction({ commentId, text: replyText.trim() });
            setReplyText("");
            setReplyingTo(null);
            await load();
        });
    };

    const updateStatus = (commentId: string, next: "pending" | "resolved" | "ignored") => {
        startTransition(async () => {
            await updateCommentStatusAction({ commentId, status: next });
            await load();
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
                <div className="flex gap-1 rounded-md border p-1">
                    {(["all", "pending", "resolved", "ignored"] as StatusFilter[]).map((s) => (
                        <button
                            key={s}
                            onClick={() => { setStatus(s); setPage(1); }}
                            className={`rounded px-3 py-1 text-xs capitalize ${status === s ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
                <Input
                    placeholder="Cari komentar..."
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    className="max-w-xs"
                />
                {loading && <Spinner className="h-4 w-4" />}
            </div>

            {loading && docs.length === 0 ? (
                <p className="text-sm text-muted-foreground">Memuat komentar...</p>
            ) : docs.length === 0 ? (
                <EmptyState title="Belum ada komentar" description="Komentar dari semua akun terhubung akan muncul di sini." />
            ) : (
                <div className="space-y-3">
                    {docs.map((comment) => (
                        <div key={comment._id} className="rounded-lg border p-4 space-y-3">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-3 flex-1 min-w-0">
                                    {comment.from.picture && (
                                        <img src={comment.from.picture} alt="" className="h-10 w-10 rounded-full object-cover" />
                                    )}
                                    <div className="min-w-0 flex-1">
                                        <p className="font-medium text-sm">{comment.from.name}</p>
                                        <p className="text-xs text-muted-foreground">
                                            di akun {comment.account.name} · {comment.content.title}
                                        </p>
                                        <p className="mt-2 text-sm">{comment.comment}</p>
                                        {comment.reply && (
                                            <div className="mt-3 rounded-md bg-muted p-3 text-sm">
                                                <p className="text-xs text-muted-foreground mb-1">Balasan kamu:</p>
                                                {comment.reply}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <span className={`shrink-0 rounded px-2 py-1 text-xs capitalize ${comment.status === "pending" ? "bg-yellow-100 text-yellow-800" : comment.status === "resolved" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                                    {comment.status}
                                </span>
                            </div>

                            {replyingTo === comment._id ? (
                                <div className="flex gap-2">
                                    <Input
                                        autoFocus
                                        placeholder="Tulis balasan..."
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") submitReply(comment._id);
                                            if (e.key === "Escape") { setReplyingTo(null); setReplyText(""); }
                                        }}
                                    />
                                    <Button onClick={() => submitReply(comment._id)} disabled={isPending || !replyText.trim()}>
                                        Kirim
                                    </Button>
                                    <Button variant="ghost" onClick={() => { setReplyingTo(null); setReplyText(""); }}>
                                        Batal
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex gap-2">
                                    <Button size="sm" variant="outline" onClick={() => setReplyingTo(comment._id)}>
                                        Balas
                                    </Button>
                                    {comment.status !== "resolved" && (
                                        <Button size="sm" variant="ghost" onClick={() => updateStatus(comment._id, "resolved")} disabled={isPending}>
                                            Tandai Selesai
                                        </Button>
                                    )}
                                    {comment.status !== "ignored" && (
                                        <Button size="sm" variant="ghost" onClick={() => updateStatus(comment._id, "ignored")} disabled={isPending}>
                                            Abaikan
                                        </Button>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {totalPages > 1 && (
                <div className="flex items-center justify-between border-t pt-4">
                    <p className="text-sm text-muted-foreground">Halaman {page} dari {totalPages}</p>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                            Sebelumnya
                        </Button>
                        <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
                            Berikutnya
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
