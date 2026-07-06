import { Button } from "@/shared/presentation/components/ui/button";
import type { ContentIdea } from "../../domain/entities/content-idea.entity";

export function ContentIdeaCard({
  idea,
  onSelect,
}: {
  idea: ContentIdea;
  onSelect: (idea: ContentIdea) => void;
}) {
  return (
    <div className="space-y-2 rounded-lg border p-4">
      <span className="inline-block rounded-full bg-accent px-2 py-0.5 text-xs font-medium">
        {idea.pillar}
      </span>
      <p className="text-sm font-medium">{idea.hook}</p>
      <p className="text-xs text-muted-foreground">{idea.angle}</p>
      <Button type="button" variant="outline" onClick={() => onSelect(idea)}>
        Pakai ide ini
      </Button>
    </div>
  );
}