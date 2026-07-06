import { getTwoStepOptions } from "@/features/social-integration/infrastructure/repliz/repliz-client";
import { PageSelector } from "@/features/social-integration/presentation/components/page-selector";
import { PageContainer } from "@/shared/presentation/components/ui/page-container";
import { PageHeader } from "@/shared/presentation/components/ui/page-header";

export default async function SelectPagePage({
    params,
    searchParams,
}: {
    params: Promise<{ orgSlug: string; workspaceSlug: string }>;
    searchParams: Promise<{ platform: string; token: string; reconnectAccountId?: string }>;
}) {
    const { orgSlug, workspaceSlug } = await params;
    const { platform, token, reconnectAccountId } = await searchParams;
    const basePath = `/${orgSlug}/${workspaceSlug}`;

    const { docs: pages } = await getTwoStepOptions(platform, token);

    return (
        <PageContainer>
            <PageHeader
                title="Pilih Akun"
                description="Pilih akun yang ingin dihubungkan."
            />
            <PageSelector platform={platform} pages={pages} reconnectAccountId={reconnectAccountId} basePath={basePath} />
        </PageContainer>
    );
}