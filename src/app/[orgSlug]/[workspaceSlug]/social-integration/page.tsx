import { listConnectionsAction } from "@/features/social-integration/application/use-cases/list-connections";

import {
  ONE_STEP_PLATFORMS,
  TWO_STEP_PLATFORMS,
} from "@/features/social-integration/domain/value-objects/repliz-platform.vo";

import { PlatformBlock } from "@/features/social-integration/presentation/blocks/platform-block";

import { PageContainer } from "@/shared/presentation/components/ui/page-container";
import { PageHeader } from "@/shared/presentation/components/ui/page-header";

export default async function SocialIntegrationPage({
  params,
}: {
  params: Promise<{
    orgSlug: string;
    workspaceSlug: string;
  }>;
}) {
  const { orgSlug, workspaceSlug } = await params;

  const connections = await listConnectionsAction();

  const platforms = [
    ...ONE_STEP_PLATFORMS,
    ...TWO_STEP_PLATFORMS,
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Social Integration"
        description="Hubungkan akun media sosial untuk mulai menjadwalkan konten."
      />

      <div className="space-y-8">
        {platforms.map((platform) => (
          <PlatformBlock
            key={platform}
            platform={platform}
            orgSlug={orgSlug}
            workspaceSlug={workspaceSlug}
            connections={connections.filter(
              (c) => c.platform === platform
            )}
          />
        ))}
      </div>
    </PageContainer>
  );
}