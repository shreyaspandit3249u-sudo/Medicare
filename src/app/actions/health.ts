"use server";

import { db } from "@/lib/database";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

export async function getHealthMetrics(type?: string, limit: number = 10) {
  const session = await auth();
  if (!session?.user?.id) return [];

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = { userId: session.user.id };
    if (type) where.type = type;

    return await db.healthMetric.findMany({
      where,
      orderBy: { recordedAt: "desc" },
      take: limit,
    });
  } catch (error) {
    console.error("Failed to fetch health metrics:", error);
    return [];
  }
}

export async function logHealthMetric(type: string, value: string, unit: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    await db.healthMetric.create({
      data: {
        type,
        value,
        unit,
        userId: session.user.id,
      },
    });

    revalidatePath("/health");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to log health metric:", error);
    return { success: false, error: "Failed to log health metric" };
  }
}
