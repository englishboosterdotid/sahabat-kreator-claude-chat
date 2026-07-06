import { InboxPage } from "@/features/inbox/presentation/inbox-page";
import { PageContainer } from "@/shared/presentation/components/ui/page-container";
import { PageHeader } from "@/shared/presentation/components/ui/page-header";

export default function Page() {
    return (
        <PageContainer>
            <PageHeader
                title="Inbox"
                description="Balas pesan dari semua akun terhubung."
            />
            <InboxPage />
        </PageContainer>
    );
}