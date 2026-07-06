"use client";

import { useState, useRef } from "react";
import { getUploadUrlAction } from "../../application/use-cases/get-upload-url";

type UploadedMedia = { type: "image" | "video"; url: string };

export function MediaUploader({ onUploaded }: { onUploaded: (media: UploadedMedia) => void }) {
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setError(null);
        setProgress(0);

        try {
            const { uploadUrl, publicUrl } = await getUploadUrlAction(file.name, file.type);

            await new Promise<void>((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.upload.onprogress = (event) => {
                    if (event.lengthComputable) setProgress(Math.round((event.loaded / event.total) * 100));
                };
                xhr.onload = () => (xhr.status === 200 ? resolve() : reject(new Error("Upload gagal")));
                xhr.onerror = () => reject(new Error("Upload gagal"));
                xhr.open("PUT", uploadUrl);
                xhr.setRequestHeader("Content-Type", file.type);
                xhr.send(file);
            });

            onUploaded({ type: file.type.startsWith("video") ? "video" : "image", url: publicUrl });
        } catch (err) {
            setError(err instanceof Error ? err.message : "Gagal upload.");
        } finally {
            setIsUploading(false);
            if (inputRef.current) inputRef.current.value = "";
        }
    }

    return (
        <div className="space-y-2">
            <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime"
                onChange={handleFileChange}
                disabled={isUploading}
                className="text-sm"
            />
            {isUploading && <p className="text-xs text-muted-foreground">Mengunggah... {progress}%</p>}
            {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
    );
}