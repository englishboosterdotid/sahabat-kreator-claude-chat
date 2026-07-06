import { CommentsPage } from "@/features/comments/presentation/comments-page";
import { PageContainer } from "@/shared/presentation/components/ui/page-container";
import { PageHeader } from "@/shared/presentation/components/ui/page-header";

export default function Page() {
    return (
        <PageContainer>
            <PageHeader
                title="Komentar"
                description="Moderasi komentar dari semua akun terhubung."
            />
            <CommentsPage />
        </PageContainer>
    );
}