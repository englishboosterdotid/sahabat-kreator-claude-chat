"use server";

export type PillarDistribution = {
  pillarName: string;
  actualPercent: number;
  targetPercent: number;
  gap: number;
};

// TODO: replace stub once pillar config + targets are modeled.
// Group generated_content rows by selectedPillar over the last N days
// and compare against the per-pillar target distribution.
export async function getPillarDistributionAction(days: number): Promise<PillarDistribution[]> {
  void days;
  return [];
}
