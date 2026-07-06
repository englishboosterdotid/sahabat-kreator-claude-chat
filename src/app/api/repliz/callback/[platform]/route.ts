import { NextRequest, NextResponse } from "next/server";
import { getPendingConnection, clearPendingConnection } from "@/features/social-integration/infrastructure/pending-connection-cookie";
import { connectOneStep, reconnectOneStep, exchangeToken, getOneAccount } from "@/features/social-integration/infrastructure/repliz/repliz-client";
import { isTwoStepPlatform } from "@/features/social-integration/domain/value-objects/repliz-platform.vo";
import { db } from "@/shared/infrastructure/database/client";
import { replizConnection } from "@/shared/infrastructure/database/schema";
import { organization } from "@/shared/infrastructure/database/schema/auth-schema";
import { eq, and } from "drizzle-orm";
import { nanoid } from "nanoid";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ platform: string }> }
) {
    const { platform } = await params;
    const code = request.nextUrl.searchParams.get("code");

    const pending = await getPendingConnection();
    if (!pending || pending.platform !== platform || !code) {
        return NextResponse.redirect(new URL("/social-integration?error=invalid_callback", process.env.NEXT_PUBLIC_APP_URL ?? request.url));
    }

    const basePath = `/${pending.orgSlug}/${pending.workspaceSlug}`;

    try {
        const orgRow = await db.select({ id: organization.id }).from(organization).where(eq(organization.slug, pending.orgSlug));
        if (!orgRow.length) throw new Error(`Organization "${pending.orgSlug}" tidak ditemukan.`);
        const organizationId = orgRow[0].id;

        if (isTwoStepPlatform(platform)) {
            const { token } = await exchangeToken(platform, code);
            const redirectUrl = new URL(`${basePath}/social-integration/select-page`, process.env.NEXT_PUBLIC_APP_URL ?? request.url);
            redirectUrl.searchParams.set("platform", platform);
            redirectUrl.searchParams.set("token", token);
            if (pending.reconnectAccountId) redirectUrl.searchParams.set("reconnectAccountId", pending.reconnectAccountId);
            return NextResponse.redirect(redirectUrl);
        }

        if (pending.reconnectAccountId) {
            await reconnectOneStep(platform, pending.reconnectAccountId, code);
            await db
                .update(replizConnection)
                .set({ isConnected: true, lastCheckedAt: new Date() })
                .where(and(eq(replizConnection.id, pending.reconnectAccountId), eq(replizConnection.teamId, pending.workspaceId)));
        } else {
            const { accountId } = await connectOneStep(platform, code);
            const accountDetail = await getOneAccount(accountId);
            await db.insert(replizConnection).values({
                id: nanoid(),
                organizationId,
                teamId: pending.workspaceId,
                platform,
                replizAccountId: accountId,
                externalName: accountDetail.name,
                externalUsername: accountDetail.username,
                externalPicture: accountDetail.picture,
                connectedByUserId: pending.userId,
                isConnected: true,
            });
        }

        await clearPendingConnection();
        return NextResponse.redirect(new URL(`${basePath}/social-integration?connected=${platform}`, process.env.NEXT_PUBLIC_APP_URL ?? request.url));
    } catch (error) {
        await clearPendingConnection();
        const message = error instanceof Error ? error.message : "unknown_error";
        return NextResponse.redirect(new URL(`${basePath}/social-integration?error=${encodeURIComponent(message)}`, process.env.NEXT_PUBLIC_APP_URL ?? request.url));
    }
}