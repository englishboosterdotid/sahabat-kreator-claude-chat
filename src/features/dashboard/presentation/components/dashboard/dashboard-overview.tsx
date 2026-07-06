import type { DashboardSummary } from "../../../application/use-cases/get-dashboard-summary";

import { MetricsSection } from "./sections/metrics-section";
import { PerformanceSection } from "./sections/performance-section";
import { RecentContentSection } from "./sections/recent-content-section";

type DashboardOverviewProps = {
  summary: DashboardSummary;
};

export function DashboardOverview({
  summary,
}: DashboardOverviewProps) {
  return (
    <>
      <MetricsSection summary={summary} />

      <PerformanceSection summary={summary} />

      <RecentContentSection summary={summary} />
    </>
  );
}