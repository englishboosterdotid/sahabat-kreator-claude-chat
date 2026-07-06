import { ContentTransformWizard } from "@/features/content-transform/presentation/content-transform-wizard";
import { PageContainer } from "@/shared/presentation/components/ui/page-container";
import { PageHeader } from "@/shared/presentation/components/ui/page-header";

export default function ContentTransformPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Content Transform"
        description="Buat variasi atau ubah platform dari konten yang sudah ada."
      />
      <ContentTransformWizard />
    </PageContainer>
  );
}