"use client";

import { logMedicine, deleteMedicine } from "@/app/actions/medicine";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function MedicineClientActions({ medicineId }: { medicineId: string }) {
  const router = useRouter();

  const handleLog = async (status: "taken" | "skipped") => {
    await logMedicine(medicineId, status);
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this medicine?")) {
      const result = await deleteMedicine(medicineId);
      if (result.success) {
        router.refresh();
      }
    }
  };

  return (
    <div className="flex flex-col gap-2" style={{ marginTop: "12px", width: "100%" }}>
      <div className="flex-row gap-2">
        <button 
          onClick={() => handleLog("taken")}
          className="btn-primary" 
          style={{ padding: "10px 16px", flex: 2, fontSize: "0.875rem" }}
        >
          Check-in
        </button>
        <button 
          onClick={() => handleLog("skipped")}
          className="btn-primary" 
          style={{ background: "transparent", border: "1px solid var(--md-sys-color-outline)", color: "var(--md-sys-color-on-surface)", padding: "10px 16px", flex: 1, fontSize: "0.875rem", boxShadow: "none" }}
        >
          Skip
        </button>
      </div>
      
      <div className="flex-row gap-4" style={{ marginTop: "4px", padding: "0 4px" }}>
        <Link 
          href={`/medicines/${medicineId}/edit`}
          className="text-xs font-semibold"
          style={{ color: "var(--md-sys-color-primary)", display: "flex", alignItems: "center", gap: "4px" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
          Edit
        </Link>
        <button 
          onClick={handleDelete}
          className="text-xs font-semibold"
          style={{ color: "var(--md-sys-color-error)", display: "flex", alignItems: "center", gap: "4px", background: "none", border: "none", padding: 0, cursor: "pointer", font: "inherit" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          Remove
        </button>
      </div>
    </div>
  );
}
