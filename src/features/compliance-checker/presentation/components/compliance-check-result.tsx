import { RISK_LEVEL_LABELS } from "../../domain/value-objects/risk-category.vo";
import type { ComplianceCheckResult } from "../../domain/entities/compliance-issue.entity";

export function ComplianceCheckResultView({ result }: { result: ComplianceCheckResult }) {
  const overall = RISK_LEVEL_LABELS[result.overallRisk];

  return (
    <div className="space-y-3 rounded-lg border p-4">
      <div className="flex items-center gap-2">
        <span className="rounded-full px-2 py-0.5 text-xs font-medium text-white" style={{ backgroundColor: overall.color }}>
          {overall.label}
        </span>
        <p className="text-xs text-muted-foreground">{result.summary}</p>
      </div>

      {result.issues.length === 0 ? (
        <p className="text-xs text-green-700">Tidak ada pola klaim berisiko yang terdeteksi.</p>
      ) : (
        <div className="space-y-2">
          {result.issues.map((issue, i) => {
            const risk = RISK_LEVEL_LABELS[issue.riskLevel];
            return (
              <div key={i} className="space-y-1 rounded-md bg-accent/30 p-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-medium" style={{ color: risk.color }}>{risk.label}</span>
                  <span className="text-muted-foreground">"{issue.phrase}"</span>
                </div>
                <p className="text-muted-foreground">{issue.reason}</p>
                <p className="italic">💡 Alternatif: {issue.suggestion}</p>
              </div>
            );
          })}
        </div>
      )}

      <p className="border-t pt-2 text-xs text-muted-foreground">
        ⚠️ Ini bukan nasihat hukum atau jaminan lolos BPOM — cuma flag pola yang umumnya berisiko. Keputusan akhir tetap tanggung jawab kamu.
      </p>
    </div>
  );
}