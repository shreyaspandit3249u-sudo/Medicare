import { getMedicineLogs } from "@/app/actions/medicine";
import { getHealthMetrics } from "@/app/actions/health";

export default async function HistoryPage() {
  const medicineLogs = await getMedicineLogs();
  const healthMetrics = await getHealthMetrics(undefined, 30); // Get last 30 metrics

  return (
    <div className="main-content" style={{ paddingTop: "20px" }}>
      <header style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: "500", color: "var(--md-sys-color-on-surface)" }}>Activity History</h1>
        <p className="text-sm" style={{ color: "var(--md-sys-color-on-surface-variant)" }}>Review your recent health and medication activity.</p>
      </header>

      <div style={{ display: "grid", gap: "24px" }}>
        {/* Medicine Logs */}
        <section>
          <h2 style={{ fontSize: "1rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--md-sys-color-on-surface-variant)", marginBottom: "12px", marginLeft: "4px" }}>
            Medication Logs
          </h2>
          {medicineLogs.length === 0 ? (
            <div className="card" style={{ background: "var(--md-sys-color-surface-variant)", textAlign: "center", padding: "32px" }}>
              <p className="text-muted text-sm">No medication activity logged yet.</p>
            </div>
          ) : (
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            medicineLogs.map((log: any) => (
              <div key={log.id} className="card card-elevated flex-row justify-between" style={{ padding: "16px", marginBottom: "8px" }}>
                <div>
                  <span className="font-semibold" style={{ display: "block", color: "var(--md-sys-color-on-surface)" }}>{log.medicine.name}</span>
                  <span className="text-xs text-muted">{new Date(log.loggedAt).toLocaleString()}</span>
                </div>
                <span className={`badge ${log.status === 'taken' ? 'badge-primary' : 'badge-warning'}`} style={{ 
                  background: log.status === 'taken' ? 'var(--md-sys-color-primary-container)' : 'var(--md-sys-color-error-container)',
                  color: log.status === 'taken' ? 'var(--md-sys-color-on-primary-container)' : 'var(--md-sys-color-on-error-container)'
                }}>
                  {log.status === 'taken' ? 'Took' : 'Skipped'}
                </span>
              </div>
            ))
          )}
        </section>

        {/* Health Metrics */}
        <section>
          <h2 style={{ fontSize: "1rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--md-sys-color-on-surface-variant)", marginBottom: "12px", marginLeft: "4px" }}>
            Biometric Data
          </h2>
          {healthMetrics.length === 0 ? (
            <div className="card" style={{ background: "var(--md-sys-color-surface-variant)", textAlign: "center", padding: "32px" }}>
              <p className="text-muted text-sm">No health metrics recorded yet.</p>
            </div>
          ) : (
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            healthMetrics.map((metric: any) => (
              <div key={metric.id} className="card card-elevated flex-row justify-between" style={{ padding: "16px", marginBottom: "8px" }}>
                <div>
                  <span className="font-semibold" style={{ display: "block", textTransform: "capitalize", color: "var(--md-sys-color-on-surface)" }}>
                    {metric.type.replace('_', ' ')}
                  </span>
                  <span className="text-xs text-muted">{new Date(metric.recordedAt).toLocaleString()}</span>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span className="font-bold" style={{ fontSize: "1.125rem", color: "var(--md-sys-color-primary)" }}>{metric.value}</span>
                  <span className="text-xs text-muted ml-1">{metric.unit}</span>
                </div>
              </div>
            ))
          )}
        </section>
      </div>
    </div>
  );
}
