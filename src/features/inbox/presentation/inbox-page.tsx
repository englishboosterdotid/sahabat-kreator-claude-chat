"use client";

import { useState, useEffect, useCallback, useTransition } from "react";
import { listChatsAction, listChatMessagesAction } from "../application/use-cases/list-chats";
import { sendChatMessageAction } from "../application/use-cases/manage-chat";
import { getConnectedAccountsAction } from "@/features/social-integration/application/use-cases/get-connected-accounts";
import type { ReplizChat, ReplizChatMessage } from "@/features/social-integration/infrastructure/repliz/repliz-client";

import { Button } from "@/shared/presentation/components/ui/button";
import { Input } from "@/shared/presentation/components/ui/input";
import { EmptyState } from "@/shared/presentation/components/ui/empty-state";
import { Spinner } from "@/shared/presentation/components/ui/spinner";
import { Badge } from "@/shared/presentation/components/ui/badge";

export function InboxPage() {
    const [connectedAccounts, setConnectedAccounts] = useState<string[]>([]);
    const [chatsPage, setChatsPage] = useState(1);
    const [messagesPage, setMessagesPage] = useState(1);
    const [chatsLoading, setChatsLoading] = useState(true);
    const [messagesLoading, setMessagesLoading] = useState(false);
    const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
    const [replyText, setReplyText] = useState("");
    const [isSending, startTransition] = useTransition();

    const [chats, setChats] = useState<ReplizChat[]>([]);
    const [chatsTotal, setChatsTotal] = useState(1);
    const [selectedChat, setSelectedChat] = useState<ReplizChat | null>(null);
    const [messages, setMessages] = useState<ReplizChatMessage[]>([]);
    const [messagesTotal, setMessagesTotal] = useState(0);
    const [search, setSearch] = useState("");

    useEffect(() => {
        getConnectedAccountsAction()
            .then((res) => setConnectedAccounts(res.accountIds))
            .catch(() => setConnectedAccounts([]));
    }, []);

    const loadChats = useCallback(async () => {
        setChatsLoading(true);
        const result = await listChatsAction({
            page: chatsPage,
            limit: 20,
            accountIds: connectedAccounts,
            search: search.trim() ? search.trim() : undefined,
        });
        setChats(result.docs);
        setChatsTotal(result.totalPages ?? 1);
        setChatsLoading(false);
    }, [chatsPage, search, connectedAccounts]);

    const loadMessages = useCallback(async (chatId: string) => {
        setMessagesLoading(true);
        const result = await listChatMessagesAction(chatId, { page: messagesPage, limit: 50 });
        setMessages(result.docs);
        setMessagesTotal(result.totalDocs ?? 0);
        setMessagesLoading(false);
    }, [messagesPage]);

    useEffect(() => { loadChats(); }, [loadChats]);

    useEffect(() => {
        if (selectedChatId) {
            const chat = chats.find((c) => c.id === selectedChatId);
            setSelectedChat(chat ?? null);
            setMessagesPage(1);
            if (chat) loadMessages(chat.id);
        } else {
            setSelectedChat(null);
            setMessages([]);
        }
    }, [selectedChatId, chats]);

    const selectChat = (chatId: string) => {
        setSelectedChatId(chatId);
    };

    const handleSend = () => {
        if (!replyText.trim() || !selectedChatId) return;
        startTransition(async () => {
            await sendChatMessageAction(selectedChatId, {
                type: "text",
                text: replyText.trim(),
            });
            setReplyText("");
            // Reload messages
            if (selectedChat) loadMessages(selectedChat.id);
        });
    };

    return (
        <div className="flex h-[calc(100vh-8rem)] rounded-lg border overflow-hidden">
            {/* Chat List Sidebar */}
            <div className={`${selectedChatId ? "hidden md:block md:w-80" : "w-full"} flex flex-col border-r`}>
                <div className="p-4 border-b space-y-3">
                    <Input
                        placeholder="Cari chat..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setChatsPage(1); }}
                    />
                    {chatsLoading && <Spinner className="h-3 w-3" />}
                </div>
                <div className="flex-1 overflow-y-auto">
                    {chatsLoading && chats.length === 0 ? (
                        <p className="p-4 text-sm text-muted-foreground">Memuat...</p>
                    ) : chats.length === 0 ? (
                        <EmptyState title="Tidak ada chat" description="Pesan masuk akan muncul di sini." />
                    ) : (
                        chats.map((chat) => (
                            <button
                                key={chat.id}
                                onClick={() => selectChat(chat.id)}
                                className={`w-full text-left p-4 border-b transition-colors hover:bg-muted ${selectedChatId === chat.id ? "bg-muted" : ""}`}
                            >
                                <div className="flex items-start gap-3">
                                    {chat.senderPicture && (
                                        <img src={chat.senderPicture} alt="" className="h-10 w-10 rounded-full object-cover shrink-0" />
                                    )}
                                    <div className="min-w-0 flex-1">
                                        <p className="font-medium text-sm truncate">{chat.senderName}</p>
                                        <p className="text-xs text-muted-foreground truncate">{chat.lastMessage?.text ?? "(Media)"}</p>
                                        <p className="text-xs text-muted-foreground">{new Date(chat.lastMessage?.sendAt ?? chat.updatedAt).toLocaleString("id-ID")}</p>
                                    </div>
                                    {(chat.unreadCount ?? 0) > 0 && (
                                        <Badge variant="danger" className="shrink-0">{chat.unreadCount}</Badge>
                                    )}
                                </div>
                            </button>
                        ))
                    )}
                </div>
                {chatsTotal > 1 && (
                    <div className="p-2 flex justify-between border-t">
                        <Button variant="outline" size="sm" disabled={chatsPage <= 1} onClick={() => setChatsPage(p => p - 1)}>
                            ←
                        </Button>
                        <span className="text-xs text-muted-foreground self-center">{chatsPage}/{chatsTotal}</span>
                        <Button variant="outline" size="sm" disabled={chatsPage >= chatsTotal} onClick={() => setChatsPage(p => p + 1)}>
                            →
                        </Button>
                    </div>
                )}
            </div>

            {/* Chat Detail */}
            <div className={`${!selectedChatId ? "hidden md:flex" : "flex"} flex-1 flex-col min-w-0`}>
                {!selectedChat ? (
                    <div className="flex-1 flex items-center justify-center text-muted-foreground">
                        Pilih percakapan untuk memulai
                    </div>
                ) : (
                    <>
                        <div className="p-4 border-b flex items-center gap-3">
                            {selectedChat.senderPicture && (
                                <img src={selectedChat.senderPicture} alt="" className="h-8 w-8 rounded-full object-cover" />
                            )}
                            <div>
                                <p className="font-medium text-sm">{selectedChat.senderName}</p>
                                <p className="text-xs text-muted-foreground">{selectedChat.account?.name}</p>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {messagesLoading && messages.length === 0 ? (
                                <p className="text-sm text-muted-foreground">Memuat pesan...</p>
                            ) : (
                                messages.map((msg) => (
                                    <div key={msg.id} className={`flex ${msg.isFromMe ? "justify-end" : "justify-start"}`}>
                                        <div className={`max-w-[70%] rounded-lg p-3 text-sm ${
                                            msg.isFromMe ? "bg-primary text-primary-foreground" : "bg-muted"
                                        }`}>
                                            {msg.text && <p>{msg.text}</p>}
                                            {msg.type === "image" && msg.attachment && (
                                                <p className="text-xs opacity-70">[Foto]</p>
                                            )}
                                            <p className="text-xs mt-1 opacity-60 text-right">
                                                {new Date(msg.sendAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        <div className="p-4 border-t flex gap-2">
                            <Input
                                autoFocus
                                placeholder="Tulis pesan..."
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
                            />
                            <Button onClick={handleSend} disabled={isSending || !replyText.trim()}>
                                Kirim
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
