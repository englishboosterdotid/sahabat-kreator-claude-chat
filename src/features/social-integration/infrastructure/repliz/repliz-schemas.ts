import { z } from "zod";

/**
 * Zod schemas mirroring the Repliz API response shapes.
 *
 * Use these on the boundary (in Repliz client functions) to validate that the
 * external API actually returns what we expect. If a field is renamed upstream
 * or a value drifts, the parse fails here instead of surfacing as an obscure
 * downstream bug.
 *
 * These schemas are intentionally permissive about unknown fields — we want
 * to fail loudly only on shape mismatches, not on missing future fields.
 */

// ─── Account ────────────────────────────────────────────────────────────────────

export const replizAccountDetailSchema = z
    .object({
        id: z.string(),
        generatedId: z.string(),
        name: z.string(),
        username: z.string().nullable(),
        picture: z.string().nullable(),
        isConnected: z.boolean(),
        type: z.string(),
    })
    .passthrough();

export const replizAccountListDocSchema = replizAccountDetailSchema.extend({
    userId: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export const replizAccountListResponseSchema = z.object({
    docs: z.array(replizAccountListDocSchema),
    totalDocs: z.number(),
    totalPages: z.number(),
    page: z.number(),
});

// ─── Content ────────────────────────────────────────────────────────────────────

export const replizContentOwnerSchema = z
    .object({
        id: z.string(),
        name: z.string(),
        picture: z.string().optional(),
    })
    .passthrough();

export const replizContentMediaSchema = z
    .object({
        type: z.enum(["image", "video"]),
        thumbnail: z.string().optional(),
        url: z.string(),
    })
    .passthrough();

export const replizContentSchema = z
    .object({
        id: z.string(),
        title: z.string().optional().default(""),
        description: z.string().optional().default(""),
        topic: z.string().optional().default(""),
        type: z.string(),
        owner: replizContentOwnerSchema.optional(),
        medias: z.array(replizContentMediaSchema).optional().default([]),
        url: z.string().optional().default(""),
        createdAt: z.string(),
        hasAutomation: z.boolean().optional().default(false),
    })
    .passthrough();

export const replizContentListResponseSchema = z.object({
    docs: z.array(replizContentSchema),
    nextToken: z.string().optional(),
});

// ─── Chat ───────────────────────────────────────────────────────────────────────

/**
 * Repliz can return chats in two shapes:
 *  - `replizChatListSchema` — the bare-bones entry returned in list endpoints
 *  - `replizChatDetailSchema` — what `getOneChat` returns (it embeds `account`
 *    and the wider structure). Both are passthrough so extra fields are
 *    preserved at runtime but the known-shape parts are typed.
 */
export const replizChatListSchema = z.object({
    id: z.string(),
    recipient: replizContentOwnerSchema.optional(),
    senderId: z.string().optional(),
    senderName: z.string().optional(),
    senderPicture: z.string().optional(),
    unreadCount: z.number().optional(),
    lastMessage: z
        .object({
            text: z.string().optional(),
            sendAt: z.string().optional(),
            type: z.string().optional(),
        })
        .optional(),
    updatedAt: z.string().optional(),
    createdAt: z.string().optional(),
});

export const replizChatSchema = z
    .object({
        id: z.string(),
        accountId: z.string().optional(),
        senderId: z.string().optional(),
        userId: z.string().optional(),
        senderName: z.string().optional(),
        senderPicture: z.string().optional(),
        unreadCount: z.number().optional(),
        lastMessage: z.any().optional(),
        account: replizAccountListDocSchema.optional(),
        createdAt: z.string().optional(),
        updatedAt: z.string().optional(),
    })
    .passthrough();

export const replizChatListResponseSchema = z.object({
    docs: z.array(replizChatListSchema),
    totalDocs: z.number().optional(),
    totalPages: z.number().optional(),
    page: z.number().optional(),
});

export const replizChatMessageSchema = z
    .object({
        id: z.string(),
        isFromMe: z.boolean(),
        senderId: z.string(),
        messageId: z.string(),
        type: z.enum(["text", "image", "video", "audio", "document", "button"]),
        status: z.enum(["sent", "delivered", "read", "failed"]),
        text: z.string().optional(),
        attachment: z.any().optional(),
        button: z.any().optional(),
        sendAt: z.string(),
        fromSenderAt: z.string().optional(),
    })
    .passthrough();

export const replizChatMessagesResponseSchema = z.object({
    docs: z.array(replizChatMessageSchema),
    totalDocs: z.number().optional(),
    totalPages: z.number().optional(),
    page: z.number().optional(),
});

// ─── Comment ───────────────────────────────────���────────────────────────────────

/**
 * Repliz comments embed a `from` (who wrote the comment), the `content` (the
 * post the comment is on), and an `account` (the workspace/brand account).
 * `_id` and `id` are both kept to handle Repliz's habit of using either.
 */
export const replizCommentSchema = z
    .object({
        _id: z.string(),
        id: z.string().optional(),
        status: z.enum(["pending", "resolved", "ignored"]).optional(),
        account: replizContentOwnerSchema.extend({
            username: z.string().optional(),
        }),
        content: replizContentSchema,
        comment: z.string().optional(),
        text: z.string().optional(),
        reply: z.string().optional(),
        from: replizContentOwnerSchema,
        createdAt: z.string(),
        author: replizContentOwnerSchema.optional(),
        postId: z.string().optional(),
        isReplied: z.boolean().optional(),
        isApproved: z.boolean().optional(),
    })
    .passthrough();

export const replizCommentListResponseSchema = z.object({
    docs: z.array(replizCommentSchema),
    totalDocs: z.number().optional(),
    totalPages: z.number().optional(),
    page: z.number().optional(),
});