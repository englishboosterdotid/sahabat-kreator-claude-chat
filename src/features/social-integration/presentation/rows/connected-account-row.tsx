"use client";

import { useState } from "react";
import { RefreshCw, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { Avatar } from "@/shared/presentation/components/ui/avatar";
import { Badge } from "@/shared/presentation/components/ui/badge";
import { Button } from "@/shared/presentation/components/ui/button";

import { initiateReconnectAction } from "../../application/use-cases/initiate-reconnect";
import { removeConnectionAction } from "../../application/use-cases/remove-connection";
import { DisconnectAccountDialog } from "../dialogs/disconnect-account-dialog";

type Connection = {
  id: string;
  replizAccountId: string;
  externalName: string;
  externalUsername: string | null;
  externalPicture: string | null;
  isConnected: boolean;
  platform: string;
};

type Props = {
  connection: Connection;
  orgSlug: string;
  workspaceSlug: string;
};

export function ConnectedAccountRow({
  connection,
  orgSlug,
  workspaceSlug,
}: Props) {
  const router = useRouter();
const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function reconnect() {
    try {
      setLoading(true);

      const { authorizeUrl } = await initiateReconnectAction(
        connection.platform as any,
        connection.id,
        orgSlug,
        workspaceSlug
      );

      window.location.href = authorizeUrl;
    } finally {
      setLoading(false);
    }
  }

  async function remove() {
  try {
    setLoading(true);

    await removeConnectionAction({
      connectionId: connection.id,
      replizAccountId: connection.replizAccountId,
    });

    router.refresh();
  } finally {
    setLoading(false);
    setOpen(false);
  }
}
  
  <DisconnectAccountDialog
    open={open}
    onOpenChange={setOpen}
    account={connection.externalName}
    loading={loading}
    onConfirm={remove}
/>

  return (
    <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:shadow-sm">
      <Avatar
        src={connection.externalPicture ?? undefined}
        alt={connection.externalName}
        fallback={connection.externalName}
        size="md"
      />

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate font-semibold">
            {connection.externalName}
          </p>

          <Badge
            variant={connection.isConnected ? "success" : "warning"}
          >
            {connection.isConnected
              ? "Connected"
              : "Reconnect"}
          </Badge>
        </div>

        {connection.externalUsername && (
          <p className="truncate text-sm text-muted-foreground">
            @{connection.externalUsername}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2">
        {!connection.isConnected && (
          <Button
            size="icon"
            variant="outline"
            isLoading={loading}
            onClick={reconnect}
          >
            <RefreshCw className="size-4" />
          </Button>
        )}

        <Button
          size="icon"
          variant="ghost"
          isLoading={loading}
          onClick={() => setOpen(true)}
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
    </div>
  );
}