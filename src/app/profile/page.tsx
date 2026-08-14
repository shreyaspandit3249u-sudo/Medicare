import PushNotificationManager from "@/components/PushNotificationManager";
import { auth } from "@/auth";
import SignOutButton from "@/components/SignOutButton";
import SystemCheck from "@/components/SystemCheck";
import { redirect } from "next/navigation";

export default async function Profile() {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/login");
  }

  const userInitial = session.user.name ? session.user.name.charAt(0).toUpperCase() : (session.user.email ? session.user.email.charAt(0).toUpperCase() : "U");

  return (
    <div className="profile-container pb-12">
      <h1 className="page-title text-3xl font-bold mb-2">Profile</h1>
      <p className="page-subtitle text-muted mb-8">Manage your health assistant settings.</p>
      
      <div className="card glass-panel mb-8" style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "32px 24px" }}>
        <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "linear-gradient(135deg, var(--primary) 0%, #4f46e5 100%)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "bold", fontSize: "2rem", marginBottom: "16px", boxShadow: "0 10px 25px rgba(37, 99, 235, 0.2)" }}>
          {userInitial}
        </div>
        <h2 style={{ fontSize: "1.25rem", fontWeight: "700" }}>{session.user.name || "User"}</h2>
        <p className="text-muted text-sm">{session.user.email}</p>
        
        <SignOutButton />
      </div>

      <div className="mb-8">
        <h3 className="section-title text-sm font-bold uppercase tracking-wider text-muted mb-4">Reminders</h3>
        <PushNotificationManager />
      </div>

      <div className="card glass-panel">
        <h3 className="card-title text-sm font-bold uppercase tracking-wider text-muted mb-4">System Settings</h3>
        <div className="flex-row justify-between" style={{ padding: "16px 0" }}>
          <span className="font-medium">Dark Mode</span>
          <span className="text-primary font-semibold">System Default</span>
        </div>
      </div>

      <SystemCheck />
    </div>
  );
}
