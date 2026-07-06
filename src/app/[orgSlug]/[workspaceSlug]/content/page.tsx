import { ContentListPage } from "@/features/content-management/presentation/content-list-page";
import { PageContainer } from "@/shared/presentation/components/ui/page-container";
import { PageHeader } from "@/shared/presentation/components/ui/page-header";

export default function Page() {
    return (
        <PageContainer>
            <PageHeader
                title="Daftar Konten"
                description="Konten yang dipublikasikan dari semua akun terhubung."
            />
            <ContentListPage />
        </PageContainer>
    );
}