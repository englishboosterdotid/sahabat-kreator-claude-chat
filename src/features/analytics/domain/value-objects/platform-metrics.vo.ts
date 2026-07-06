export type PlatformMetrics =
    | { platform: "facebook"; like: number; comment: number; share: number }
    | { platform: "instagram"; like: number; comment: number; share: number; reach: number; saved: number; views: number; interaction: number }
    | { platform: "threads"; like: number; replies: number; views: number; repost: number; quotes: number; share: number }
    | { platform: "tiktok"; like: number; comment: number; share: number; reach: number; views: number; watched: number; favourite: number; newFollower: number }
    | { platform: "youtube"; like: number; dislike: number; comment: number; views: number; favourite: number }
    | { platform: "linkedin"; like: number; comment: number };

/** Ambil "total interaksi" secara adil lintas platform — hanya jumlahkan field yang memang ada di platform tsb. */
export function getTotalInteraction(metrics: Record<string, number>): number {
    const interactionFields = ["like", "comment", "share", "replies", "repost", "quotes", "saved", "favourite", "interaction"];
    return interactionFields.reduce((sum, field) => sum + (metrics[field] ?? 0), 0);
}

export function getReachOrViews(metrics: Record<string, number>): number {
    return metrics.reach ?? metrics.views ?? metrics.impression ?? 0;
}