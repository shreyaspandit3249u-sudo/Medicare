import Link from "next/link";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Medicine, HealthMetric } from "@prisma/client";
import Greeting from "@/components/Greeting";
import MedicineClientActions from "@/components/MedicineClientActions";
import { getMedicines } from "@/app/actions/medicine";
import { getHealthMetrics } from "@/app/actions/health";
import PushNotificationManager from "@/components/PushNotificationManager";
import { WaterAction, HeartRateAction } from "@/components/HealthClientActions";

export default async function Home() {
  const medicines = await getMedicines();
  // Group metrics by type logic can be handled here or just fetch latest
  const waterMetrics = await getHealthMetrics("water");
  const heartMetrics = await getHealthMetrics("heart_rate");

  // Basic calculation for UI
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const totalWater = waterMetrics.reduce((sum: number, m: any) => sum + Number(m.value), 0);
  const latestHeartRate = heartMetrics[0]?.value || "--";

  return (
    <>
      <section style={{ marginBottom: "24px" }}>
        <Greeting />
        <p className="page-subtitle" style={{ color: "var(--md-sys-color-on-surface-variant)" }}>Here is your health summary today.</p>
      </section>

      <section>
        <div className="flex-row justify-between" style={{ marginBottom: "12px" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: "500", color: "var(--md-sys-color-on-surface)" }}>Upcoming Medicine</h2>
          <Link href="/medicines" className="text-sm" style={{ color: "var(--md-sys-color-primary)", fontWeight: "600" }}>See all</Link>
        </div>

        {medicines.length === 0 ? (
          <div className="card" style={{ background: "var(--md-sys-color-surface-variant)", border: "1px dashed var(--md-sys-color-outline)" }}>
            <p className="text-muted text-sm">No medicines tracked yet. Click &apos;+&apos; to add.</p>
          </div>
        ) : (
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          medicines.map((med: any) => (
            <div key={med.id} className="card card-elevated" style={{ borderLeft: `4px solid var(--md-sys-color-primary)` }}>
              <div className="card-header">
                <span className="card-title" style={{ color: "var(--md-sys-color-on-surface)" }}>{med.name}</span>
                <span className="badge">{med.time}</span>
              </div>
              <p className="text-sm" style={{ color: "var(--md-sys-color-on-surface-variant)" }}>{med.dosage} • {med.instructions} • {med.frequency}</p>
              <MedicineClientActions medicineId={med.id} />
            </div>
          ))
        )}
      </section>

      <section style={{ marginTop: "32px" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: "500", marginBottom: "12px", color: "var(--md-sys-color-on-surface)" }}>Health Glance</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <div className="card card-elevated" style={{ padding: "16px" }}>
            <WaterAction currentCount={totalWater} />
          </div>
          
          <div className="card card-elevated" style={{ padding: "16px" }}>
            <HeartRateAction latestBpm={latestHeartRate.toString()} />
          </div>
        </div>
      </section>

      {/* Floating Action Button */}
      <Link href="/medicines/add" className="fab" aria-label="Add Medicine">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      </Link>
      
      <PushNotificationManager />
    </>
  );
}
