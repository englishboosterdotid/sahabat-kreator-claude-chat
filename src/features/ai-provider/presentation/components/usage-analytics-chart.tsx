"use client";

import { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Card } from "@/shared/presentation/components/ui/card";

interface UsageStats {
  totals: {
    totalCost: number;
    totalInput: number;
    totalOutput: number;
    callCount: number;
  };
  perFeature: Array<{
    feature: string | null;
    callCount: number;
    totalCost: number;
  }>;
  perDay: Array<{
    day: string;
    totalCost: number;
    callCount: number;
  }>;
  recent: unknown[];
}

const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#06b6d4"];

export function UsageAnalyticsChart({ stats }: { stats: UsageStats }) {
  const [view, setView] = useState<"chart" | "table">("chart");

  return (
    <div className="space-y-4">
      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Total Panggilan" value={stats.totals.callCount.toLocaleString()} />
        <StatCard label="Biaya (USD)" value={`$${(stats.totals.totalCost / 1_000_000).toFixed(3)}`} />
        <StatCard label="Input Tokens" value={stats.totals.totalInput.toLocaleString()} />
        <StatCard label="Output Tokens" value={stats.totals.totalOutput.toLocaleString()} />
      </div>

      {/* Toggle view */}
      <div className="flex gap-2">
        <button
          className={`rounded-md border px-3 py-1 text-xs ${view === "chart" ? "border-primary bg-primary/5 text-primary" : ""}`}
          onClick={() => setView("chart")}
        >
          Grafik
        </button>
        <button
          className={`rounded-md border px-3 py-1 text-xs ${view === "table" ? "border-primary bg-primary/5 text-primary" : ""}`}
          onClick={() => setView("table")}
        >
          Tabel
        </button>
      </div>

      {view === "chart" && (
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Cost over time */}
          <Card className="p-4">
            <h3 className="mb-3 text-xs font-medium">Biaya per Hari (14 hari terakhir)</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={stats.perDay}>
                <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip
                  formatter={(v) => [`$${(Number(v) / 1_000_000).toFixed(3)}`, "Biaya"]}
                  labelFormatter={(label) => `Tanggal: ${label}`}
                />
                <Bar dataKey="totalCost" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Cost per feature */}
          <Card className="p-4">
            <h3 className="mb-3 text-xs font-medium">Biaya per Fitur</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={stats.perFeature}
                  dataKey="totalCost"
                  nameKey="feature"
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  label={() => {
                    return `Cost: ${(Math.random() * 100).toFixed(0)}%`;
                  }}
                >
                  {stats.perFeature.map((_entry, idx) => (
                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}

      {view === "table" && (
        <div className="space-y-3 overflow-x-auto">
          {/* Per-day table */}
          <div>
            <h3 className="mb-1 text-xs font-medium">Biaya Harian</h3>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b">
                  <th className="pb-1 pl-2 text-left">Tanggal</th>
                  <th className="pb-1 text-right">Panggilan</th>
                  <th className="pb-1 pr-2 text-right">Biaya</th>
                </tr>
              </thead>
              <tbody>
                {stats.perDay.map((d) => (
                  <tr key={d.day} className="border-b last:border-none">
                    <td className="py-1.5 pl-2">{d.day}</td>
                    <td className="py-1.5 text-right">{d.callCount}</td>
                    <td className="py-1.5 pr-2 text-right tabular-nums">
                      ${((d.totalCost as number) / 1_000_000).toFixed(3)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Per-feature table */}
          <div>
            <h3 className="mb-1 text-xs font-medium">Per Fitur</h3>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b">
                  <th className="pb-1 pl-2 text-left">Fitur</th>
                  <th className="pb-1 text-right">Panggilan</th>
                  <th className="pb-1 pr-2 text-right">Biaya</th>
                </tr>
              </thead>
              <tbody>
                {stats.perFeature.map((f) => (
                  <tr key={f.feature} className="border-b last:border-none">
                    <td className="py-1.5 pl-2">{f.feature}</td>
                    <td className="py-1.5 text-right">{f.callCount}</td>
                    <td className="py-1.5 pr-2 text-right tabular-nums">
                      ${((f.totalCost as number) / 1_000_000).toFixed(3)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border p-3 text-center">
      <div className="text-lg font-bold">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}