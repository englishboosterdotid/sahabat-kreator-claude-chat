import { z } from "zod";

// ─── Knowledge Base Input Schemas ──────────────────────────────────────────────

export const addKnowledgeEntrySchema = z.object({
    title: z.string().min(3, "Judul minimal 3 karakter"),
    content: z.string().min(10, "Isi minimal 10 karakter"),
    category: z.enum(["product", "pricing", "policy", "faq", "other"]),
    tags: z.array(z.string()),
    isPinned: z.boolean(),
});

export const updateKnowledgeEntrySchema = z.object({
    id: z.string(),
    title: z.string().min(3, "Judul minimal 3 karakter"),
    content: z.string().min(10, "Isi minimal 10 karakter"),
    category: z.enum(["product", "pricing", "policy", "faq", "other"]),
    tags: z.array(z.string()),
    isPinned: z.boolean(),
});

// ─── Brand Voice Input Schemas ─────────────────────────────────────────────────

export const saveBrandVoiceSchema = z.object({
    brandName: z.string().optional(),
    tagline: z.string().optional(),
    industry: z.string().optional(),
    toneDescription: z.string(),
    personalityTraits: z.array(z.string()),
    dos: z.array(z.string()),
    donts: z.array(z.string()),
    targetAudience: z.string(),
    sampleContent: z.string().optional(),
    aiAnalysisSummary: z.string().optional(),
});

// ─── Schedule Content Input Schemas ────────────────────────────────────────────

export const scheduleContentSchema = z.object({
    generatedContentId: z.string(),
    connectionId: z.string(),
    scheduleAt: z.string().refine((v) => !isNaN(Date.parse(v)), { message: "Tanggal jadwal tidak valid" }),
    mediaUrls: z
        .array(z.object({ type: z.enum(["image", "video"]), url: z.string() }))
        .optional(),
});

// ─── Manage Comment Input Schemas ──────────────────────────────────────────────

export const replyCommentSchema = z.object({
    commentId: z.string(),
    text: z.string().min(1, "Balasan tidak boleh kosong"),
});

export const updateCommentStatusSchema = z.object({
    commentId: z.string(),
    status: z.enum(["pending", "resolved", "ignored"]),
});

// ─── Manage Chat Input Schemas ─────────────────────────────────────────────────

export const sendChatMessageSchema = z.object({
    type: z.enum(["text", "image", "video", "audio", "document", "button"]),
    text: z.string().optional(),
    image: z
        .object({
            type: z.enum(["image", "video", "audio", "document"]),
            url: z.string(),
            thumbnail: z.string().optional(),
        })
        .optional(),
    video: z
        .object({
            type: z.enum(["image", "video", "audio", "document"]),
            url: z.string(),
            thumbnail: z.string().optional(),
        })
        .optional(),
    audio: z
        .object({
            type: z.enum(["image", "video", "audio", "document"]),
            url: z.string(),
            thumbnail: z.string().optional(),
        })
        .optional(),
    document: z
        .object({
            type: z.enum(["image", "video", "audio", "document"]),
            url: z.string(),
            thumbnail: z.string().optional(),
        })
        .optional(),
    button: z.object({ label: z.string(), url: z.string() }).optional(),
});
