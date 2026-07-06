export const ONE_STEP_PLATFORMS = ["instagram", "threads", "tiktok"] as const;
export const TWO_STEP_PLATFORMS = ["facebook", "youtube", "linkedin"] as const;

export type ReplizPlatform = (typeof ONE_STEP_PLATFORMS)[number] | (typeof TWO_STEP_PLATFORMS)[number];

export function isTwoStepPlatform(platform: string): boolean {
    return (TWO_STEP_PLATFORMS as readonly string[]).includes(platform);
}

export const REPLIZ_PLATFORM_LABELS: Record<ReplizPlatform, string> = {
    instagram: "Instagram",
    threads: "Threads",
    tiktok: "TikTok",
    facebook: "Facebook",
    youtube: "YouTube",
    linkedin: "LinkedIn",
};