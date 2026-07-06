export const RECOMMENDATION_ICONS: Record<string, string> = {
  pillar_gap: "📊",
  schedule_gap: "📅",
  momentum_upcoming: "🎉",
  top_performing_pillar: "🔥",
};

// Urutan prioritas default kalau ada banyak rekomendasi bersaing
export const PRIORITY_ORDER: Record<string, number> = {
  pillar_gap: 1,
  schedule_gap: 2,
  momentum_upcoming: 3,
  top_performing_pillar: 4,
};