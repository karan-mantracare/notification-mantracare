"use client";

import { useState } from "react";
import { useNotifications } from "@/context/NotificationContext";
import { Activity, BellRing, Settings2, Calendar, FileText, CheckCircle2 } from "lucide-react";
import CustomSelect from "@/components/CustomSelect";

export default function Dashboard() {
  const { notifications, triggers, logs, templates, selectedCompany } = useNotifications();
  
  // Filter states
  const [dateRange, setDateRange] = useState("Last 7 Days");
  const [triggerFilter, setTriggerFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");

  const totalSent = logs.reduce((acc, log) => acc + log.sentCount, 0);
  const activeTriggersCount = triggers.length;
  const templatesCount = Object.keys(templates).length;

  return (
    <div style={{ padding: "0 1rem 2rem 1rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: "700", color: "var(--dark)", margin: 0, letterSpacing: "-0.5px" }}>Dashboard</h1>
          <p style={{ color: "var(--text-muted)", marginTop: "0.25rem", fontSize: "0.95rem" }}>
            Overview for <strong style={{ color: "var(--primary)" }}>{selectedCompany}</strong>
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="card" style={{ padding: "1.25rem", marginBottom: "2rem", display: "flex", gap: "1.5rem", flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Calendar size={18} color="var(--text-muted)" />
          <CustomSelect 
            value={dateRange} 
            onChange={setDateRange}
            options={["Today", "Last 7 Days", "Last 30 Days", "This Year"]}
            style={{ minWidth: "150px" }}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Settings2 size={18} color="var(--text-muted)" />
          <CustomSelect 
            value={triggerFilter} 
            onChange={setTriggerFilter}
            options={[{value: "All", label: "All Triggers"}, ...triggers.map(t => ({ value: t.name, label: t.name }))]}
            style={{ minWidth: "180px" }}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <BellRing size={18} color="var(--text-muted)" />
          <CustomSelect 
            value={typeFilter} 
            onChange={setTypeFilter}
            options={[{value: "All", label: "All Types"}, {value: "Email", label: "Email"}, {value: "SMS", label: "SMS"}, {value: "App", label: "App Notification"}]}
            style={{ minWidth: "150px" }}
          />
        </div>
      </div>

      {/* Metrics */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem", marginBottom: "2.5rem" }}>
        <div className="card" style={{ padding: "1.5rem", display: "flex", alignItems: "center", gap: "1.5rem", borderLeft: "4px solid #3b82f6" }}>
          <div style={{ backgroundColor: "#eff6ff", padding: "1rem", borderRadius: "12px", color: "#3b82f6" }}>
            <Activity size={28} />
          </div>
          <div>
            <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.9rem", fontWeight: "600", textTransform: "uppercase" }}>Total Sent</p>
            <h2 style={{ margin: 0, fontSize: "2rem", fontWeight: "700", color: "var(--dark)" }}>{totalSent.toLocaleString()}</h2>
          </div>
        </div>

        <div className="card" style={{ padding: "1.5rem", display: "flex", alignItems: "center", gap: "1.5rem", borderLeft: "4px solid #10b981" }}>
          <div style={{ backgroundColor: "#ecfdf5", padding: "1rem", borderRadius: "12px", color: "#10b981" }}>
            <Settings2 size={28} />
          </div>
          <div>
            <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.9rem", fontWeight: "600", textTransform: "uppercase" }}>Active Triggers</p>
            <h2 style={{ margin: 0, fontSize: "2rem", fontWeight: "700", color: "var(--dark)" }}>{activeTriggersCount}</h2>
          </div>
        </div>

        <div className="card" style={{ padding: "1.5rem", display: "flex", alignItems: "center", gap: "1.5rem", borderLeft: "4px solid #8b5cf6" }}>
          <div style={{ backgroundColor: "#f5f3ff", padding: "1rem", borderRadius: "12px", color: "#8b5cf6" }}>
            <FileText size={28} />
          </div>
          <div>
            <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.9rem", fontWeight: "600", textTransform: "uppercase" }}>Templates</p>
            <h2 style={{ margin: 0, fontSize: "2rem", fontWeight: "700", color: "var(--dark)" }}>{templatesCount}</h2>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="card" style={{ padding: "1.5rem" }}>
        <h3 style={{ fontSize: "1.2rem", fontWeight: "600", color: "var(--dark)", marginBottom: "1.5rem", marginTop: 0 }}>Recent Campaign Deliveries</h3>
        {logs.length === 0 ? (
          <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)" }}>
            No recent activity for {selectedCompany}.
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "800px" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid var(--border-color)", textAlign: "left" }}>
                  <th style={{ padding: "1rem", fontSize: "0.85rem", color: "#64748b", textTransform: "uppercase" }}>Campaign ID</th>
                  <th style={{ padding: "1rem", fontSize: "0.85rem", color: "#64748b", textTransform: "uppercase" }}>Type</th>
                  <th style={{ padding: "1rem", fontSize: "0.85rem", color: "#64748b", textTransform: "uppercase" }}>Sent Count</th>
                  <th style={{ padding: "1rem", fontSize: "0.85rem", color: "#64748b", textTransform: "uppercase" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "1rem", fontWeight: "600", color: "var(--primary)" }}>#{log.id}</td>
                    <td style={{ padding: "1rem", textTransform: "capitalize", color: "var(--text-main)" }}>{log.campaignType}</td>
                    <td style={{ padding: "1rem", fontWeight: "500", color: "var(--dark)" }}>{log.sentCount.toLocaleString()}</td>
                    <td style={{ padding: "1rem" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", padding: "0.25rem 0.75rem", backgroundColor: "#dcfce7", color: "#15803d", borderRadius: "100px", fontSize: "0.8rem", fontWeight: "600" }}>
                        <CheckCircle2 size={14} /> Delivered
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
