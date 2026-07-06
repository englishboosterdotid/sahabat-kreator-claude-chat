export type RecommendationType = "pillar_gap" | "schedule_gap" | "momentum_upcoming" | "top_performing_pillar";

export type Recommendation = {
  type: RecommendationType;
  priority: number; // makin kecil makin urgent
  title: string;
  description: string;
  actionLabel: string;
  actionUrl: string;
};