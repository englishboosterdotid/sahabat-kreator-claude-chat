import { getRecommendationsAction } from "../application/use-cases/get-recommendations";
import { RecommendationCard } from "./components/recommendation-card";

export async function RecommendationList({ orgSlug, workspaceSlug }: { orgSlug: string; workspaceSlug: string }) {
  const recommendations = await getRecommendationsAction(orgSlug, workspaceSlug);

  if (recommendations.length === 0) {
    return <p className="text-sm text-muted-foreground">Semua terlihat baik — tidak ada rekomendasi mendesak saat ini.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {recommendations.map((rec, i) => <RecommendationCard key={i} rec={rec} />)}
    </div>
  );
}