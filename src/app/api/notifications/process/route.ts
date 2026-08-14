import { db } from "@/lib/database";
import { triggerBackendNotification } from "@/app/actions/notifications";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const now = new Date();
    const currentTimeStr = now.toTimeString().substring(0, 5); // "HH:mm"
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    console.log(`[CRON] Checking for medicines due at ${currentTimeStr}`);

    // Find medicines where time matches AND not notified today
    const dueMedicines = await db.medicine.findMany({
      where: {
        time: currentTimeStr,
        OR: [
          { lastNotifiedAt: null },
          { lastNotifiedAt: { lt: today } }
        ]
      },
      include: {
        user: true
      }
    });

    console.log(`[CRON] Found ${dueMedicines.length} medicines due.`);

    const results = await Promise.all(dueMedicines.map(async (med) => {
      if (!med.userId) return { id: med.id, status: "no_user" };

      const message = `Time to take your medication: ${med.name} (${med.dosage})`;
      const success = await triggerBackendNotification(med.userId, message);

      if (success) {
        await db.medicine.update({
          where: { id: med.id },
          data: { lastNotifiedAt: now }
        });
        return { id: med.id, status: "sent" };
      }
      
      return { id: med.id, status: "failed" };
    }));

    return NextResponse.json({ 
      success: true, 
      processed: dueMedicines.length,
      results 
    });
  } catch (error) {
    console.error("[CRON] Fatal error processing notifications:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
