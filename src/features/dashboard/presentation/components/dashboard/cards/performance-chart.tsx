import { ChartCard } from "@/shared/presentation/components/ui/chart-card";
import { SegmentedControl } from "@/shared/presentation/components/ui/segmented-control";

export function PerformanceChart() {
  return (
    <ChartCard
      title="Performa Bulanan"
      description="30 hari terakhir"
      toolbar={
        <SegmentedControl
          value="month"
          options={[
            { label: "Minggu", value: "week" },
            { label: "Bulan", value: "month" },
          ]}
        />
      }
    >
      <div className="h-64" />
    </ChartCard>
  );
}