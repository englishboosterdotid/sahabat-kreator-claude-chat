"use client";

import { useState } from "react";
import { Input } from "@/shared/presentation/components/ui/input";
import { Label } from "@/shared/presentation/components/ui/label";
import { Button } from "@/shared/presentation/components/ui/button";
import { KNOWLEDGE_CATEGORY_LABELS } from "../../domain/value-objects/knowledge-category.vo";
import { addKnowledgeEntryAction } from "../../application/use-cases/add-knowledge-entry";

const CATEGORIES = ["product", "pricing", "policy", "faq", "other"] as const;

export function KnowledgeEntryForm({ onSaved }: { onSaved: () => void }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("product");
  const [tags, setTags] = useState("");
  const [isPinned, setIsPinned] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    try {
      await addKnowledgeEntryAction({
        title,
        content,
        category,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        isPinned,
      });
      setTitle("");
      setContent("");
      setTags("");
      setIsPinned(false);
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border p-4">
      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="space-y-1.5">
        <Label htmlFor="title">Judul</Label>
        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Contoh: Paket Berlangganan Bulanan" />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="category">Kategori</Label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value as typeof category)}
          className="h-10 w-full rounded-md border bg-background px-3 text-sm"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{KNOWLEDGE_CATEGORY_LABELS[c]}</option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="content">Isi</Label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={5}
          placeholder="Tulis fakta lengkap — harga, spesifikasi, kebijakan, dst. Semakin detail, semakin akurat AI nanti."
          className="w-full rounded-md border bg-background p-3 text-sm outline-none focus:border-foreground/40"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="tags">Tags (pisahkan koma)</Label>
        <Input id="tags" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="harga, bulanan, promo" />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={isPinned} onChange={(e) => setIsPinned(e.target.checked)} />
        Selalu sertakan (pin) — dipakai untuk fakta yang wajib selalu dipatuhi AI
      </label>

      <Button type="submit" isLoading={isSaving}>Simpan</Button>
    </form>
  );
}