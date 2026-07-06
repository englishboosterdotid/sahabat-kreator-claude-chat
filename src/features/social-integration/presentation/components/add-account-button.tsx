"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/shared/presentation/components/ui/button";

import { initiateConnectAction } from "../../application/use-cases/initiate-connect";
import type { ReplizPlatform } from "../../domain/value-objects/repliz-platform.vo";

type Props = {
  platform: ReplizPlatform;
  orgSlug: string;
  workspaceSlug: string;
};

export function AddAccountButton({
  platform,
  orgSlug,
  workspaceSlug,
}: Props) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    try {
      setLoading(true);

      const { authorizeUrl } = await initiateConnectAction(
        platform,
        orgSlug,
        workspaceSlug
      );

      window.location.href = authorizeUrl;
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      variant="outline"
      size="md"
      isLoading={loading}
      onClick={handleClick}
      className="w-full border-dashed"
    >
      {!loading && <Plus className="size-4" />}
      Connect Account
    </Button>
  );
}