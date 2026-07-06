import { ContentPlanPage } from "@/features/content-plan/presentation/content-plan-page";
import { PillarReminderBanner } from "@/features/content-plan/presentation/components/pillar-reminder-banner";
import { PageContainer } from "@/shared/presentation/components/ui/page-container";
import { PageHeader } from "@/shared/presentation/components/ui/page-header";

export default function Page() {
    return (
        <PageContainer>
            <PageHeader
                title="Content Plan"
                description="Jadwalkan draft konten ke akun sosial kamu."
            />
            <PillarReminderBanner />
            <ContentPlanPage />
        </PageContainer>
    );
}