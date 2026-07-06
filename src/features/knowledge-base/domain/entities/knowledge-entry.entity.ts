export type KnowledgeEntry = {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  isPinned: boolean;
};

export function formatKnowledgeForPrompt(entries: KnowledgeEntry[]): string {
  if (entries.length === 0) return "";
  const formatted = entries
    .map((e) => `[${e.category.toUpperCase()}] ${e.title}\n${e.content}`)
    .join("\n\n");
  return `Referensi fakta brand (WAJIB dipatuhi, jangan mengarang di luar ini):\n\n${formatted}`;
}