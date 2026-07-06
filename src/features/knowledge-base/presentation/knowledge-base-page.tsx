"use client";

import { useState, useEffect, useCallback } from "react";
import { KnowledgeEntryForm } from "./components/knowledge-entry-form";
import { KnowledgeEntryList } from "./components/knowledge-entry-list";
import { listKnowledgeEntriesAction } from "../application/use-cases/list-knowledge-entries";

type Entry = {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  isPinned: boolean;
};

export function KnowledgeBasePage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [showForm, setShowForm] = useState(false);

  const refresh = useCallback(async () => {
    const result = await listKnowledgeEntriesAction();
    setEntries(result as Entry[]);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <div className="space-y-6">
      {showForm && (
        <KnowledgeEntryForm
          onSaved={() => {
            setShowForm(false);
            refresh();
          }}
        />
      )}

      <div className="flex justify-end">
        <button
          onClick={() => setShowForm((v) => !v)}
          className="rounded-md bg-foreground px-3 py-1.5 text-sm font-medium text-background"
        >
          {showForm ? "Tutup" : "+ Tambah Entry"}
        </button>
      </div>

      <KnowledgeEntryList entries={entries} onDeleted={refresh} />
    </div>
  );
}