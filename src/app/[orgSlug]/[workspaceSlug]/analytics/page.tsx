import { AnalyticsPage } from "@/features/analytics/presentation/analytics-page";
import { PageContainer } from "@/shared/presentation/components/ui/page-container";
import { PageHeader } from "@/shared/presentation/components/ui/page-header";

export default function Page() {
    return (
        <PageContainer>
            <PageHeader
                title="Analitik"
                description="Performa konten yang sudah terbit, 30 hari terakhir."
            />
            <AnalyticsPage />
        </PageContainer>
    );
}