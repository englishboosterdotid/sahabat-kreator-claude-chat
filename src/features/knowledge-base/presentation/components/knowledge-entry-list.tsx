"use client";

import { KnowledgeEntryCard } from "./knowledge-entry-card";

type Entry = {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  isPinned: boolean;
};

export function KnowledgeEntryList({ entries, onDeleted }: { entries: Entry[]; onDeleted: () => void }) {
  if (entries.length === 0) {
    return <p className="text-sm text-muted-foreground">Belum ada knowledge entry. Tambahkan fakta pertama tentang brand kamu.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {entries.map((entry) => (
        <KnowledgeEntryCard key={entry.id} entry={entry} onDeleted={onDeleted} />
      ))}
    </div>
  );
}