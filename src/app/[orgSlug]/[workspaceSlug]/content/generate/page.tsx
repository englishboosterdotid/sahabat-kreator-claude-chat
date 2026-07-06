import { ContentGenerationWizard } from "@/features/content-generation/presentation/content-generation-wizard";
import { getMomentumByIdAction } from "@/features/momentum-calendar/application/use-cases/get-momentum-by-id";
import { PageContainer } from "@/shared/presentation/components/ui/page-container";
import { PageHeader } from "@/shared/presentation/components/ui/page-header";

export default async function ContentGeneratePage({
  searchParams,
}: {
  searchParams: Promise<{ momentumId?: string; prefillText?: string }>;
}) {
  const { momentumId, prefillText } = await searchParams;

  let prefillBrief: string | undefined = prefillText;
  if (momentumId) {
    const momentum = await getMomentumByIdAction(momentumId);
    if (momentum) {
      prefillBrief = `Konten untuk momen "${momentum.name}". ${momentum.contentAngleHint ?? ""}`;
    }
  }

  return (
    <PageContainer>
      <PageHeader
        title="Generate Konten"
        description="Isi brief, pilih ide, dan dapatkan caption siap pakai."
      />
      <ContentGenerationWizard prefillBrief={prefillBrief} />
    </PageContainer>
  );
}