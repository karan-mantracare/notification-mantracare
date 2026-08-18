export default function Dashboard() {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: "600", color: "var(--dark)" }}>Dashboard</h1>
      </div>
      <div className="card" style={{ padding: "4rem 2rem", textAlign: "center", color: "var(--text-muted)", minHeight: "60vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
        <h3 style={{ fontSize: "1.5rem", fontWeight: "600", color: "var(--dark)", marginBottom: "0.5rem" }}>Dashboard</h3>
        <p style={{ marginBottom: "1.5rem" }}>Welcome to the MantraCare Dashboard. This page is currently under construction.</p>
      </div>
    </div>
  );
}
