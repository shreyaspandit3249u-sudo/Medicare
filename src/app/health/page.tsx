import { getHealthMetrics } from "@/app/actions/health";
import { WaterAction, HeartRateAction } from "@/components/HealthClientActions";

export default async function Health() {
  const waterMetrics = await getHealthMetrics("water");
  const heartMetrics = await getHealthMetrics("heart_rate");

  const totalWater = waterMetrics.reduce((sum, m) => sum + Number(m.value), 0);
  const latestHeartRate = heartMetrics[0]?.value || "--";

  return (
    <>
      <h1 className="page-title">Medicare+ Health</h1>
      <p className="page-subtitle">Detailed tracking for your vitals and wellness metrics.</p>
      
      <div style={{ display: "grid", gap: "1.5rem", marginTop: "1.5rem", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
        <div className="card glass-panel flex-row justify-between" style={{ alignItems: "center", borderLeft: "4px solid var(--md-sys-color-tertiary)" }}>
          <div style={{ flex: 1 }}>
            <span className="card-title">Water Intake</span>
            <p className="text-muted text-sm mb-4">Daily target: 8 glasses</p>
            <WaterAction currentCount={totalWater} />
          </div>
        </div>

        <div className="card glass-panel flex-row justify-between" style={{ alignItems: "center", borderLeft: "4px solid var(--md-sys-color-error)" }}>
          <div style={{ flex: 1 }}>
            <span className="card-title">Heart Rate</span>
            <p className="text-muted text-sm mb-4">Latest pulse measurement</p>
            <HeartRateAction latestBpm={latestHeartRate.toString()} />
          </div>
        </div>
      </div>
    </>
  );
}
