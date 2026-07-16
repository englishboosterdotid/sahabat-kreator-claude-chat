import { PlatformCard } from "../cards/platform-card";

import {
  SOCIAL_PLATFORM_REGISTRY,
} from "../constants/platform-registry";

import { AddAccountButton } from "../components/add-account-button";
import { ConnectedAccountRow } from "../rows/connected-account-row";
import type { ConnectionMeta } from "../../application/use-cases/get-connected-accounts";

type Props = {
  platform: string;
  orgSlug: string;
  workspaceSlug: string;
  connections: ConnectionMeta[];
};

export function PlatformBlock({
  platform,
  orgSlug,
  workspaceSlug,
  connections,
}: Props) {
  const config =
    SOCIAL_PLATFORM_REGISTRY[
      platform as keyof typeof SOCIAL_PLATFORM_REGISTRY
    ];

  return (
    <PlatformCard
      title={config.label}
      icon={<config.icon className="size-6" />}
      count={connections.length}
      footer={
        <AddAccountButton
          platform={platform as any}
          orgSlug={orgSlug}
          workspaceSlug={workspaceSlug}
        />
      }
    >
      {connections.length === 0 ? (
        <div className="py-8 text-center text-sm text-muted-foreground">
          Belum ada akun.
        </div>
      ) : (
        connections.map((connection) => (
          <ConnectedAccountRow
            key={connection.id}
            connection={connection}
            orgSlug={orgSlug}
            workspaceSlug={workspaceSlug}
          />
        ))
      )}
    </PlatformCard>
  );
}