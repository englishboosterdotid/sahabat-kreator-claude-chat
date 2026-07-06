import { ContentIdeaCard } from "./content-idea-card";
import type { ContentIdea } from "../../domain/entities/content-idea.entity";

export function ContentIdeaList({
  ideas,
  onSelect,
  onRegenerate,
  isRegenerating,
}: {
  ideas: ContentIdea[];
  onSelect: (idea: ContentIdea) => void;
  onRegenerate: () => void;
  isRegenerating: boolean;
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {ideas.map((idea, i) => (
          <ContentIdeaCard key={i} idea={idea} onSelect={onSelect} />
        ))}
      </div>
      <button
        onClick={onRegenerate}
        disabled={isRegenerating}
        className="text-sm text-muted-foreground hover:text-foreground underline"
      >
        {isRegenerating ? "Generate ulang..." : "Kurang cocok? Generate ide lain"}
      </button>
    </div>
  );
}