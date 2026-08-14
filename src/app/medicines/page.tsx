import { getMedicines } from "@/app/actions/medicine";
import MedicineClientActions from "@/components/MedicineClientActions";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Medicine } from "@prisma/client";

export default async function Medicines() {
  const medicines = await getMedicines();
  const now = Date.now();

  return (
    <>
      <h1 className="page-title">Medicines</h1>
      <p className="page-subtitle">Manage your prescriptions and reminders.</p>
      
      <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "16px" }}>
        {medicines.length === 0 ? (
          <p className="text-muted text-sm text-center py-8">You haven&apos;t tracked any medicines yet.</p>
        ) : (
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          medicines.map((med: any) => {
            const isExpiringSoon = med.expiryDate && new Date(med.expiryDate).getTime() - now < 30 * 24 * 60 * 60 * 1000;
            const isLowStock = med.stock !== null && med.stock < 5;
            
            return (
              <div key={med.id} className="card card-elevated" style={{ padding: "20px" }}>
                <div className="flex-row justify-between" style={{ alignItems: "flex-start", marginBottom: "12px" }}>
                  <div>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <span className="card-title" style={{ fontSize: "1.125rem" }}>{med.name}</span>
                      <span className="text-sm font-medium" style={{ color: "var(--md-sys-color-primary)" }}>{med.time}</span>
                    </div>
                    <p className="text-sm text-muted" style={{ marginTop: "2px" }}>{med.dosage} • {med.frequency}</p>
                    
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "8px", alignItems: "center" }}>
                      {med.expiryDate && (
                        <span className="text-xs font-medium" style={{ padding: "4px 10px", background: "var(--md-sys-color-surface-variant)", color: "var(--md-sys-color-on-surface-variant)", borderRadius: "6px", display: "inline-flex", whiteSpace: "nowrap" }}>
                          Exp: {new Date(med.expiryDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </span>
                      )}
                      {med.stock !== null && (
                         <span className="text-xs font-medium" style={{ padding: "4px 10px", background: "var(--md-sys-color-surface-variant)", color: "var(--md-sys-color-on-surface-variant)", borderRadius: "6px", display: "inline-flex", whiteSpace: "nowrap" }}>
                           Stock: {med.stock}
                         </span>
                      )}
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px", alignItems: "flex-end" }}>
                    {isLowStock && <span className="badge badge-warning" style={{ background: "var(--md-sys-color-error-container)", color: "var(--md-sys-color-on-error-container)" }}>Low Stock</span>}
                    {isExpiringSoon && <span className="badge badge-danger">Expiring Soon</span>}
                  </div>
                </div>
                
                <div style={{ borderTop: "1px solid var(--md-sys-color-outline-variant)", paddingTop: "4px" }}>
                   <MedicineClientActions medicineId={med.id} />
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  );
}
