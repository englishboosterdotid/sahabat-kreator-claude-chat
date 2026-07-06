"use server";

import { db } from "@/shared/infrastructure/database/client";
import { indonesiaMomentum } from "@/shared/infrastructure/database/schema";
import { eq } from "drizzle-orm";

export async function getMomentumByIdAction(momentumId: string) {
  if (momentumId.startsWith("payday-")) {
    return {
      name: "Tanggal Gajian",
      contentAngleHint: "Momen 'gajian' — bagus untuk promo, self-reward, treat yourself content",
    };
  }

  const event = await db.query.indonesiaMomentum.findFirst({
    where: eq(indonesiaMomentum.id, momentumId),
  });
  return event ?? null;
}