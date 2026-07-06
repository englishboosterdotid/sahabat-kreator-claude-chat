export type MomentumEvent = {
  id: string;
  date: string; // YYYY-MM-DD
  name: string;
  category: "national_holiday" | "religious" | "commercial" | "cultural" | "payday";
  description: string | null;
  contentAngleHint: string | null;
  isTentative: boolean;
};

export function daysUntil(dateStr: string): number {
  const target = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}