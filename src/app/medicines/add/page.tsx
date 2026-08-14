"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addMedicine } from "@/app/actions/medicine";

export default function AddMedicinePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    
    try {
      const result = await addMedicine(formData);
      if (result.success) {
        router.push("/");
        router.refresh();
      } else {
        setError(result.error || "Failed to add medicine");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="main-content" style={{ paddingTop: "20px" }}>
      <header style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: "500", color: "var(--md-sys-color-on-surface)" }}>Add Medicine</h1>
        <p className="text-sm" style={{ color: "var(--md-sys-color-on-surface-variant)" }}>Enter the details of your new medication.</p>
      </header>

      <form action={handleSubmit} className="card card-elevated" style={{ padding: "24px" }}>
        {error && (
          <div style={{ background: "var(--md-sys-color-error-container)", color: "var(--md-sys-color-on-error-container)", padding: "12px", borderRadius: "8px", marginBottom: "16px", fontSize: "0.875rem" }}>
            {error}
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Medicine Name *</label>
          <input type="text" name="name" required className="input-field" placeholder="e.g. Paracetamol" />
        </div>

        <div className="form-group">
          <label className="form-label">Dosage *</label>
          <input type="text" name="dosage" required className="input-field" placeholder="e.g. 500mg" />
        </div>

        <div className="form-group">
          <label className="form-label">Scheduled Time *</label>
          <input type="time" name="time" required className="input-field" />
        </div>

        <div className="form-group">
          <label className="form-label">Frequency</label>
          <select name="frequency" className="input-field">
            <option value="Daily">Daily</option>
            <option value="Twice daily">Twice daily</option>
            <option value="Three times daily">Three times daily</option>
            <option value="Every 4 hours">Every 4 hours</option>
            <option value="As needed">As needed</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Instructions</label>
          <textarea name="instructions" className="input-field" style={{ minHeight: "80px", resize: "none" }} placeholder="e.g. Take after food"></textarea>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div className="form-group">
            <label className="form-label">Current Stock</label>
            <input type="number" name="stock" className="input-field" placeholder="e.g. 30" />
          </div>
          <div className="form-group">
            <label className="form-label">Expiry Date</label>
            <input type="date" name="expiryDate" className="input-field" />
          </div>
        </div>

        <div style={{ marginTop: "24px" }}>
          <button type="submit" disabled={loading} className="btn-primary" style={{ width: "100%" }}>
            {loading ? (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "spin 1s linear infinite" }}>
                   <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
                </svg>
                Adding...
              </>
            ) : "Save Medicine"}
          </button>
        </div>
      </form>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
