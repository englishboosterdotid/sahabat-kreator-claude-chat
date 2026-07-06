import { ReactNode } from "react";

import { ContentGrid } from "../ui/content-grid";
import { PageSection } from "../ui/page-section";
import { SectionHeader } from "../ui/section-header";

type StatsBlockItem = {
  id: string;
  content: ReactNode;
};

type StatsBlockProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  items: StatsBlockItem[];
  footerItems?: StatsBlockItem[];
};

export function StatsBlock({
  title,
  description,
  action,
  items,
  footerItems,
}: StatsBlockProps) {
  return (
    <PageSection>
      <SectionHeader
        title={title}
        description={description}
        action={action}
      />

      <ContentGrid>
        {items.map((item) => (
          <div key={item.id}>
            {item.content}
          </div>
        ))}
      </ContentGrid>

      {footerItems && footerItems.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {footerItems.map((item) => (
            <div key={item.id}>
              {item.content}
            </div>
          ))}
        </div>
      )}
    </PageSection>
  );
}