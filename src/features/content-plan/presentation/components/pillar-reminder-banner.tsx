import { getPillarDistributionAction } from "@/features/content-pillar/application/use-cases/get-pillar-distribution";

export async function PillarReminderBanner() {
    const distribution = await getPillarDistributionAction(30);
    const underTarget = distribution.filter((d) => d.gap < -10);

    if (underTarget.length === 0) return null;

    return (
        <div className="rounded-md bg-amber-50 p-3 text-xs text-amber-700">
            Pillar yang masih kurang dari target 30 hari terakhir:{" "}
            {underTarget.map((d) => `${d.pillarName} (${d.actualPercent}% dari target ${d.targetPercent}%)`).join(", ")}.
            Pertimbangkan generate konten dengan pillar ini minggu ini.
        </div>
    );
}