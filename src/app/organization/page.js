"use client";

import { useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const initialOrgs = [
  { id: "ORG-001", name: "MantraCare", website: "mantra.care" },
  { id: "ORG-002", name: "MantraAssist", website: "mantraassist.com" },
  { id: "ORG-003", name: "EyeMantra", website: "eyemantra.in" },
];

export default function OrganizationPage() {
  const router = useRouter();
  const [organizations, setOrganizations] = useState(initialOrgs);

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this organization?")) {
      setOrganizations(organizations.filter(org => org.id !== id));
      toast.success("Organization deleted successfully");
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: "600", color: "var(--dark)", margin: 0 }}>Organizations</h1>
          <p style={{ color: "var(--text-muted)", margin: "0.25rem 0 0 0", fontSize: "0.9rem" }}>Manage your clients and reporting endpoints</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => toast.error("Add Organization feature not implemented yet")}
        >
          <Plus size={18} /> Add Organization
        </button>
      </div>

      <div className="card" style={{ padding: "0", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ backgroundColor: "#f8fafc", borderBottom: "1px solid var(--border-color)" }}>
                <th style={{ padding: "1rem 1.5rem", fontWeight: "600", color: "#64748b", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>ID</th>
                <th style={{ padding: "1rem 1.5rem", fontWeight: "600", color: "#64748b", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Client Name</th>
                <th style={{ padding: "1rem 1.5rem", fontWeight: "600", color: "#64748b", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Website</th>
                <th style={{ padding: "1rem 1.5rem", fontWeight: "600", color: "#64748b", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", textAlign: "right" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {organizations.map((org, index) => (
                <tr key={org.id} style={{ borderBottom: index !== organizations.length - 1 ? "1px solid var(--border-color)" : "none", transition: "background-color 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f8fafc"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}>
                  <td style={{ padding: "1rem 1.5rem", color: "var(--dark)", fontWeight: "500" }}>{org.id}</td>
                  <td style={{ padding: "1rem 1.5rem", color: "var(--dark)" }}>{org.name}</td>
                  <td style={{ padding: "1rem 1.5rem" }}>
                    <a href={`https://${org.website}`} target="_blank" rel="noreferrer" style={{ color: "var(--primary)", textDecoration: "none" }}>{org.website}</a>
                  </td>
                  <td style={{ padding: "1rem 1.5rem", display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                    <button 
                      className="btn btn-outline"
                      style={{ padding: "0.35rem", height: "auto" }}
                      title="Edit"
                      onClick={() => router.push(`/organization/edit?id=${org.id}`)}
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      className="btn btn-outline"
                      style={{ padding: "0.35rem", height: "auto", color: "var(--danger)", borderColor: "var(--danger)" }}
                      title="Delete"
                      onClick={() => handleDelete(org.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {organizations.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)" }}>
                    No organizations found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
