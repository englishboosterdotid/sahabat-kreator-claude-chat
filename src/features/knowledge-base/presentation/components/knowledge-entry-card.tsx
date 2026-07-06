"use client";

import { KNOWLEDGE_CATEGORY_LABELS } from "../../domain/value-objects/knowledge-category.vo";
import { deleteKnowledgeEntryAction } from "../../application/use-cases/delete-knowledge-entry";

type Entry = {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  isPinned: boolean;
};

export function KnowledgeEntryCard({ entry, onDeleted }: { entry: Entry; onDeleted: () => void }) {
  async function handleDelete() {
    if (!confirm(`Hapus "${entry.title}"?`)) return;
    await deleteKnowledgeEntryAction(entry.id);
    onDeleted();
  }

  return (
    <div className="space-y-2 rounded-lg border p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          {entry.isPinned && <span className="text-xs">📌</span>}
          <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-medium">
            {KNOWLEDGE_CATEGORY_LABELS[entry.category]}
          </span>
        </div>
        <button onClick={handleDelete} className="text-xs text-muted-foreground hover:text-destructive">
          Hapus
        </button>
      </div>
      <p className="text-sm font-medium">{entry.title}</p>
      <p className="line-clamp-2 text-xs text-muted-foreground">{entry.content}</p>
      {entry.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {entry.tags.map((tag) => (
            <span key={tag} className="rounded bg-accent/60 px-1.5 py-0.5 text-xs text-muted-foreground">
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}