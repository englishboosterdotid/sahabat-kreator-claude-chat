export const SCHEDULE_STATUS_LABELS: Record<string, { label: string; color: string }> = {
    pending: { label: "Terjadwal", color: "#D97706" },
    process: { label: "Sedang Diproses", color: "#2563EB" },
    success: { label: "Terbit", color: "#059669" },
    error: { label: "Gagal", color: "#DC2626" },
};

// Sumber: dokumentasi resmi createSchedule Repliz
export const SUPPORTED_TYPES_BY_PLATFORM: Record<string, string[]> = {
    facebook: ["text", "image", "video", "reel", "album", "link", "story"],
    instagram: ["image", "video", "album", "story"],
    threads: ["text", "image", "video", "album"],
    tiktok: ["image", "video", "album"],
    youtube: ["video"],
    linkedin: ["image", "video", "album"],
};

export function isTypeSupportedForPlatform(type: string, platform: string): boolean {
    return SUPPORTED_TYPES_BY_PLATFORM[platform]?.includes(type) ?? false;
}

export function getSupportedTypesLabel(platform: string): string {
    return SUPPORTED_TYPES_BY_PLATFORM[platform]?.join(", ") ?? "tidak diketahui";
}