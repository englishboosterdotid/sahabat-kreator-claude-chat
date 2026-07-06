export const CONTENT_PILLARS = [
  "Edukasi",
  "Promosi",
  "Storytelling",
  "Behind the Scenes",
  "User Generated Content",
  "Trend/Relatable",
] as const;

export type ContentPillar = (typeof CONTENT_PILLARS)[number];