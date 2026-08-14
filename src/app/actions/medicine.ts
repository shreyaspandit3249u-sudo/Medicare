"use server";

import { db } from "@/lib/database";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

export async function getMedicines() {
  const session = await auth();
  if (!session?.user?.id) return [];

  try {
    return await db.medicine.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return [];
  }
}

export async function getMedicineById(id: string) {
  const session = await auth();
  if (!session?.user?.id) return null;

  try {
    return await db.medicine.findUnique({
      where: { id, userId: session.user.id },
    });
  } catch (error) {
    console.error("Failed to fetch medicine:", error);
    return null;
  }
}

export async function addMedicine(formData: FormData) {
  const session = await auth();
  
  if (!session?.user?.id) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    const name = formData.get("name") as string;
    const dosage = formData.get("dosage") as string;
    const time = formData.get("time") as string;
    const instructions = formData.get("instructions") as string;
    const frequency = formData.get("frequency") as string;
    const stockStr = formData.get("stock") as string;
    const expiryDateStr = formData.get("expiryDate") as string;
    
    if (!name || !dosage || !time) {
      throw new Error("Missing required fields");
    }

    const stock = stockStr ? parseInt(stockStr, 10) : null;
    const expiryDate = expiryDateStr ? new Date(expiryDateStr) : null;

    await db.medicine.create({
      data: {
        name,
        dosage,
        time,
        instructions: instructions || "As directed",
        frequency: frequency || "Daily",
        stock,
        expiryDate,
        userId: session.user.id,
      },
    });

    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("Failed to add medicine:", error);
    return { success: false, error: "Failed to add medicine" };
  }
}

export async function logMedicine(medicineId: string, status: "taken" | "skipped") {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    // Verify ownership
    const med = await db.medicine.findUnique({ 
      where: { id: medicineId } 
    });

    if (!med || med.userId !== session.user.id) {
      return { success: false, error: "Access denied" };
    }

    await db.medicineLog.create({
      data: {
        medicineId,
        status,
      },
    });
    
    if (status === "taken") {
      if (med.stock !== null && med.stock > 0) {
        await db.medicine.update({
          where: { id: medicineId },
          data: { stock: med.stock - 1 },
        });
      }
    }
    
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to log medicine:", error);
    return { success: false, error: "Failed to log medicine" };
  }
}

export async function updateMedicine(medicineId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    const name = formData.get("name") as string;
    const dosage = formData.get("dosage") as string;
    const time = formData.get("time") as string;
    const instructions = formData.get("instructions") as string;
    const frequency = formData.get("frequency") as string;
    const stockStr = formData.get("stock") as string;
    const expiryDateStr = formData.get("expiryDate") as string;

    const stock = stockStr ? parseInt(stockStr, 10) : null;
    const expiryDate = expiryDateStr ? new Date(expiryDateStr) : null;

    await db.medicine.update({
      where: { id: medicineId, userId: session.user.id },
      data: {
        name,
        dosage,
        time,
        instructions,
        frequency,
        stock,
        expiryDate,
      },
    });

    revalidatePath("/medicines");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to update medicine:", error);
    return { success: false, error: "Failed to update medicine" };
  }
}

export async function deleteMedicine(medicineId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    await db.medicine.delete({
      where: { id: medicineId, userId: session.user.id },
    });

    revalidatePath("/medicines");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete medicine:", error);
    return { success: false, error: "Failed to delete medicine" };
  }
}

export async function getMedicineLogs() {
  const session = await auth();
  if (!session?.user?.id) return [];

  try {
    return await db.medicineLog.findMany({
      where: {
        medicine: { userId: session.user.id }
      },
      include: {
        medicine: true
      },
      orderBy: { loggedAt: "desc" },
      take: 50,
    });
  } catch (error) {
    console.error("Failed to fetch medicine logs:", error);
    return [];
  }
}
