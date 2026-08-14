"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getMedicineById, updateMedicine } from "@/app/actions/medicine";

export default function EditMedicinePage() {
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [medicine, setMedicine] = useState<any>(null);

  useEffect(() => {
    async function fetchMedicine() {
      if (!id) return;
      const data = await getMedicineById(id as string);
      if (data) {
        setMedicine(data);
      } else {
        setError("Medicine not found");
      }
      setLoading(false);
    }
    fetchMedicine();
  }, [id]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    try {
      const result = await updateMedicine(id as string, formData);
      if (result.success) {
        router.push("/medicines");
        router.refresh();
      } else {
        setError(result.error || "Failed to update medicine");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="main-content flex items-center justify-center py-20">
        <div style={{ width: "40px", height: "40px", border: "4px solid var(--md-sys-color-primary-container)", borderTopColor: "var(--md-sys-color-primary)", borderRadius: "50%", animation: "spin 1s linear infinite" }}></div>
      </div>
    );
  }

  if (error && !medicine) {
    return (
      <div className="main-content py-10 text-center">
        <p className="text-danger mb-4">{error}</p>
        <button onClick={() => router.back()} className="btn-primary" style={{ margin: "0 auto" }}>Go Back</button>
      </div>
    );
  }

  return (
    <div className="main-content" style={{ paddingTop: "20px" }}>
      <header style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: "500", color: "var(--md-sys-color-on-surface)" }}>Edit Medicine</h1>
        <p className="text-sm" style={{ color: "var(--md-sys-color-on-surface-variant)" }}>Modify the details of your medication.</p>
      </header>

      <form onSubmit={handleSubmit} className="card card-elevated" style={{ padding: "24px" }}>
        {error && (
          <div style={{ background: "var(--md-sys-color-error-container)", color: "var(--md-sys-color-on-error-container)", padding: "12px", borderRadius: "8px", marginBottom: "16px", fontSize: "0.875rem" }}>
            {error}
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Medicine Name *</label>
          <input type="text" name="name" required className="input-field" defaultValue={medicine.name} placeholder="e.g. Paracetamol" />
        </div>

        <div className="form-group">
          <label className="form-label">Dosage *</label>
          <input type="text" name="dosage" required className="input-field" defaultValue={medicine.dosage} placeholder="e.g. 500mg" />
        </div>

        <div className="form-group">
          <label className="form-label">Scheduled Time *</label>
          <input type="time" name="time" required className="input-field" defaultValue={medicine.time} />
        </div>

        <div className="form-group">
          <label className="form-label">Frequency</label>
          <select name="frequency" className="input-field" defaultValue={medicine.frequency || "Daily"}>
            <option value="Daily">Daily</option>
            <option value="Twice daily">Twice daily</option>
            <option value="Three times daily">Three times daily</option>
            <option value="Every 4 hours">Every 4 hours</option>
            <option value="As needed">As needed</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Instructions</label>
          <textarea name="instructions" className="input-field" style={{ minHeight: "80px", resize: "none" }} defaultValue={medicine.instructions || ""} placeholder="e.g. Take after food"></textarea>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div className="form-group">
            <label className="form-label">Current Stock</label>
            <input type="number" name="stock" className="input-field" defaultValue={medicine.stock || ""} placeholder="e.g. 30" />
          </div>
          <div className="form-group">
            <label className="form-label">Expiry Date</label>
            <input type="date" name="expiryDate" className="input-field" defaultValue={medicine.expiryDate ? new Date(medicine.expiryDate).toISOString().split('T')[0] : ""} />
          </div>
        </div>

        <div className="flex-row gap-3" style={{ marginTop: "24px" }}>
          <button type="button" onClick={() => router.back()} className="btn-primary" style={{ flex: 1, background: "transparent", border: "1px solid var(--md-sys-color-outline)", color: "var(--md-sys-color-on-surface)", boxShadow: "none" }}>
            Cancel
          </button>
          <button type="submit" disabled={saving} className="btn-primary" style={{ flex: 1 }}>
            {saving ? "Saving..." : "Update Details"}
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
