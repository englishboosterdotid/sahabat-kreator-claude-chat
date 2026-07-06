import { KnowledgeBasePage } from "@/features/knowledge-base/presentation/knowledge-base-page";
import { PageContainer } from "@/shared/presentation/components/ui/page-container";
import { PageHeader } from "@/shared/presentation/components/ui/page-header";

export default function Page() {
  return (
    <PageContainer>
      <PageHeader
        title="Knowledge Base"
        description="Fakta tentang brand kamu — AI akan patuh ke data ini saat generate konten."
      />
      <KnowledgeBasePage />
    </PageContainer>
  );
}