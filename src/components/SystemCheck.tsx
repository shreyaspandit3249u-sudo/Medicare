"use client";

import { useState } from "react";

interface ResultType {
  processed?: number;
  results?: Array<{id: string, status: string}>;
  [key: string]: unknown;
}

export default function SystemCheck() {
  const [status, setStatus] = useState<"idle" | "running" | "success" | "error">("idle");
  const [result, setResult] = useState<ResultType | null>(null);

  const runCheck = async () => {
    setStatus("running");
    try {
      const res = await fetch("/api/notifications/process");
      const data = await res.json();
      setResult(data);
      if (data.success) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };

  return (
    <div className="card glass-panel" style={{ marginTop: "16px" }}>
      <h3 className="card-title text-sm font-bold uppercase tracking-wider text-muted mb-4">Automation Engine</h3>
      <div className="flex-row justify-between" style={{ alignItems: "center" }}>
        <div>
          <span className="font-medium">Notification Check</span>
          <p className="text-xs text-muted">Manually trigger the medicine reminder engine.</p>
        </div>
        <button 
          onClick={runCheck}
          disabled={status === "running"}
          className="btn-primary"
          style={{ padding: "8px 16px", fontSize: "0.75rem" }}
        >
          {status === "running" ? "Checking..." : "Trigger Hub"}
        </button>
      </div>

      {status === "success" && (
        <div style={{ marginTop: "12px", padding: "8px", background: "var(--md-sys-color-secondary-container)", borderRadius: "8px", fontSize: "0.75rem" }}>
          Processed {result?.processed || 0} medicines.
          {result?.results && result.results.length > 0 && (
             <ul style={{ marginTop: "4px", paddingLeft: "16px" }}>
               {result.results.map((r, i: number) => (
                 <li key={i}>{r.id}: {r.status}</li>
               ))}
            </ul>
          )}
        </div>
      )}

      {status === "error" && (
        <div style={{ marginTop: "12px", padding: "8px", background: "var(--md-sys-color-error-container)", color: "var(--md-sys-color-on-error-container)", borderRadius: "8px", fontSize: "0.75rem" }}>
          Check failed. See console for details.
        </div>
      )}
    </div>
  );
}
