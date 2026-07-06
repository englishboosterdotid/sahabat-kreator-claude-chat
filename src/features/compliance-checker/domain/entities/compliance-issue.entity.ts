export type ComplianceIssue = {
  phrase: string;         // bagian teks yang di-flag
  category: string;       // "klaim_medis" | "klaim_berlebihan" | "superlatif_tanpa_bukti" | "kata_terlarang"
  riskLevel: "low" | "medium" | "high";
  reason: string;         // kenapa ini berisiko
  suggestion: string;     // alternatif kalimat yang lebih aman
};

export type ComplianceCheckResult = {
  issues: ComplianceIssue[];
  overallRisk: "low" | "medium" | "high";
  summary: string;
};