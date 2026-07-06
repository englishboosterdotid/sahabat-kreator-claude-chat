import { DashboardOverview } from "@/features/dashboard/presentation/components/dashboard/dashboard-overview";
import { getDashboardSummary } from "@/features/dashboard/application/use-cases/get-dashboard-summary";
import { RecommendationList } from "@/features/content-recommendation/presentation/recommendation-list";

import { Button } from "@/shared/presentation/components/ui/button";
import { PageContainer } from "@/shared/presentation/components/ui/page-container";
import { PageHeader } from "@/shared/presentation/components/ui/page-header";

export default async function DashboardPage({ params }: { params: Promise<{ orgSlug: string; workspaceSlug: string }> }) {
  const { orgSlug, workspaceSlug } = await params;

  const summary = await getDashboardSummary();

  return (
    <PageContainer>
      <PageHeader
        title="Dashboard"
        description={`Ringkasan aktivitas workspace ${workspaceSlug}.`}
        action={
          <Button size="md">
            Create Content
          </Button>
        }
      />

      <DashboardOverview summary={summary} />
      
      <div className="space-y-3 mt-8">
        <h2 className="text-lg font-medium">Rekomendasi Untuk Kamu</h2>
        <RecommendationList orgSlug={orgSlug} workspaceSlug={workspaceSlug} />
      </div>
    </PageContainer>
    
  );
}