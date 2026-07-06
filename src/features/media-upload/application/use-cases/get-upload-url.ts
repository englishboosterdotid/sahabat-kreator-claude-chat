"use server";

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2Client } from "@/shared/infrastructure/storage/r2-client";
import { withWorkspacePermission } from "@/shared/lib/guards/with-workspace-permission";
import { nanoid } from "nanoid";

export const getUploadUrlAction = withWorkspacePermission(
    ["owner", "admin", "member"],
    async (ctx, fileName: string, contentType: string) => {
        const allowedTypes = ["image/jpeg", "image/png", "image/webp", "video/mp4", "video/quicktime"];
        if (!allowedTypes.includes(contentType)) {
            throw new Error("Tipe file tidak didukung. Gunakan JPG, PNG, WebP, MP4, atau MOV.");
        }

        const key = `${ctx.teamId}/${nanoid()}-${fileName}`;

        const command = new PutObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME,
            Key: key,
            ContentType: contentType,
        });

        const uploadUrl = await getSignedUrl(r2Client, command, { expiresIn: 300 }); // 5 menit
        const publicUrl = `https://${process.env.R2_PUBLIC_URL}/${key}`;

        return { uploadUrl, publicUrl };
    }
);