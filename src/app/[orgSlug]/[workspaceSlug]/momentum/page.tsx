import { getUpcomingMomentumAction } from "@/features/momentum-calendar/application/use-cases/get-upcoming-momentum";
import { MomentumList } from "@/features/momentum-calendar/presentation/components/momentum-list";
import { PageContainer } from "@/shared/presentation/components/ui/page-container";
import { PageHeader } from "@/shared/presentation/components/ui/page-header";

export default async function MomentumPage({
  params,
}: {
  params: Promise<{ orgSlug: string; workspaceSlug: string }>;
}) {
  const { orgSlug, workspaceSlug } = await params;
  const events = await getUpcomingMomentumAction(30);
  const basePath = `/${orgSlug}/${workspaceSlug}`;

  return (
    <PageContainer>
      <PageHeader
        title="Momentum Indonesia"
        description="Momen 30 hari ke depan yang bisa jadi ide konten kamu."
      />
      <MomentumList events={events} basePath={basePath} />
    </PageContainer>
  );
}