"use client";

import { logHealthMetric } from "@/app/actions/health";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function WaterAction({ currentCount }: { currentCount: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    setLoading(true);
    try {
      await logHealthMetric("water", "1", "glass");
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", width: "100%" }}>
      <div style={{ background: "var(--md-sys-color-tertiary-container)", color: "var(--md-sys-color-on-tertiary-container)", padding: "12px", borderRadius: "16px" }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path></svg>
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
        <strong style={{ fontSize: "1.5rem", color: "var(--md-sys-color-on-surface)" }}>{currentCount}</strong>
        <span style={{ fontSize: "1rem", color: "var(--md-sys-color-on-surface-variant)" }}>/8</span>
      </div>
      <button 
        onClick={handleAdd}
        disabled={loading}
        className="btn-primary" 
        style={{ width: "100%", height: "40px", borderRadius: "12px", fontSize: "0.875rem" }}
      >
        {loading ? (
           <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "spin 1s linear infinite" }}>
              <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
           </svg>
        ) : "+ Hydrate"}
      </button>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export function HeartRateAction({ latestBpm }: { latestBpm: string }) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [bpm, setBpm] = useState(latestBpm === "--" ? "" : latestBpm);
  const [loading, setLoading] = useState(false);

  const handleLog = async () => {
    if (!bpm || isNaN(Number(bpm))) return;

    setLoading(true);
    try {
      await logHealthMetric("heart_rate", bpm, "bpm");
      setIsEditing(false);
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", width: "100%" }}>
      <div style={{ background: "var(--md-sys-color-error-container)", color: "var(--md-sys-color-on-error-container)", padding: "12px", borderRadius: "16px" }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
      </div>

      {isEditing ? (
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "8px" }}>
          <input 
            type="number"
            value={bpm}
            onChange={(e) => setBpm(e.target.value)}
            className="input-field"
            style={{ textAlign: "center", height: "40px", padding: "0", borderRadius: "8px" }}
            placeholder="bpm"
            autoFocus
          />
          <div style={{ display: "flex", gap: "4px" }}>
            <button 
              onClick={handleLog}
              disabled={loading}
              className="btn-primary" 
              style={{ flex: 1, height: "32px", fontSize: "0.75rem", borderRadius: "8px" }}
            >
              {loading ? "..." : "Save"}
            </button>
            <button 
              onClick={() => setIsEditing(false)}
              className="btn-primary" 
              style={{ flex: 1, height: "32px", fontSize: "0.75rem", borderRadius: "8px", background: "transparent", color: "var(--md-sys-color-primary)", border: "1px solid var(--md-sys-color-outline)", boxShadow: "none" }}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
            <strong style={{ fontSize: "1.5rem", color: "var(--md-sys-color-on-surface)" }}>{latestBpm}</strong>
            <span style={{ fontSize: "0.75rem", color: "var(--md-sys-color-on-surface-variant)" }}>bpm</span>
          </div>
          <button 
            onClick={() => setIsEditing(true)}
            className="btn-primary" 
            style={{ width: "100%", height: "40px", borderRadius: "12px", fontSize: "0.875rem", background: "var(--md-sys-color-secondary)", color: "var(--md-sys-color-on-secondary)" }}
          >
            Log Pulse
          </button>
        </>
      )}
    </div>
  );
}
