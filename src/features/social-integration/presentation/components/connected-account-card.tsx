"use client";

import { useState } from "react";
import { initiateReconnectAction } from "../../application/use-cases/initiate-reconnect";
import { removeConnectionAction } from "../../application/use-cases/remove-connection";

type Connection = {
    id: string;
    replizAccountId: string;
    externalName: string;
    externalUsername: string | null;
    externalPicture: string | null;
    isConnected: boolean;
    platform: string;
};

export function ConnectedAccountCard({
    connection, orgSlug, workspaceSlug,
}: { connection: Connection; orgSlug: string; workspaceSlug: string }) {
    const [isLoading, setIsLoading] = useState(false);

    async function handleReconnect() {
        setIsLoading(true);
        const { authorizeUrl } = await initiateReconnectAction(connection.platform as any, connection.id, orgSlug, workspaceSlug);
        window.location.href = authorizeUrl;
    }

    async function handleRemove() {
        if (!confirm(`Putuskan akun "${connection.externalName}"? Konten terjadwal dari akun ini bisa terpengaruh.`)) return;
        setIsLoading(true);
        await removeConnectionAction({ connectionId: connection.id, replizAccountId: connection.replizAccountId });
        window.location.reload(); // sederhana untuk sekarang — bisa diganti refresh state kalau halaman jadi client-side penuh
    }

    return (
        <div className="flex items-center justify-between rounded-lg border p-3">
            <div className="flex items-center gap-3">
                {connection.externalPicture ? (
                    <img src={connection.externalPicture} alt="" className="size-9 rounded-full object-cover" />
                ) : (
                    <div className="flex size-9 items-center justify-center rounded-full bg-accent text-xs">
                        {connection.externalName.charAt(0)}
                    </div>
                )}
                <div>
                    <p className="text-sm font-medium">{connection.externalName}</p>
                    {connection.externalUsername && <p className="text-xs text-muted-foreground">@{connection.externalUsername}</p>}
                </div>
            </div>

            <div className="flex items-center gap-2">
                {!connection.isConnected && (
                    <button onClick={handleReconnect} disabled={isLoading} className="text-xs font-medium text-amber-600 hover:underline">
                        Sambungkan Ulang
                    </button>
                )}
                <button onClick={handleRemove} disabled={isLoading} className="text-xs text-muted-foreground hover:text-destructive">
                    Putuskan
                </button>
            </div>
        </div>
    );
}