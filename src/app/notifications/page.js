"use client";

import { useState } from "react";
import { useNotifications } from "@/context/NotificationContext";
import Link from "next/link";
import { Plus, Edit, Trash2, Eye, X } from "lucide-react";

export default function NotificationsPage() {
  const { notifications, logs, deleteNotification } = useNotifications();
  const [activeTab, setActiveTab] = useState("time-based");
  
  // For Log Modal
  const [selectedLog, setSelectedLog] = useState(null);

  const renderNotificationTable = (data) => {
    if (data.length === 0) {
      return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "50vh", gap: "1rem" }}>
          <div style={{ color: "var(--text-muted)", marginBottom: "1rem", textAlign: "center" }}>
            <BellOffIcon size={48} style={{ margin: "0 auto", marginBottom: "1rem", opacity: 0.5 }} />
            <p>You haven't created any notifications here yet.</p>
          </div>
          <Link href={activeTab === "bulk" ? "/notifications/add?mode=bulk" : "/notifications/add"} className="btn btn-primary">
            Create your first {activeTab === "bulk" ? "Bulk Campaign" : "Notification"}
          </Link>
        </div>
      );
    }

    return (
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "900px" }}>
          <thead>
            <tr style={{ backgroundColor: "var(--dark)", color: "white", textAlign: "left" }}>
              <th style={{ padding: "0.75rem 1rem", fontSize: "0.75rem", textTransform: "uppercase" }}>ID</th>
              <th style={{ padding: "0.75rem 1rem", fontSize: "0.75rem", textTransform: "uppercase" }}>User Type</th>
              <th style={{ padding: "0.75rem 1rem", fontSize: "0.75rem", textTransform: "uppercase" }}>Name</th>
              <th style={{ padding: "0.75rem 1rem", fontSize: "0.75rem", textTransform: "uppercase" }}>Trigger / Conditions</th>
              <th style={{ padding: "0.75rem 1rem", fontSize: "0.75rem", textTransform: "uppercase" }}>Action</th>
              <th style={{ padding: "0.75rem 1rem", fontSize: "0.75rem", textTransform: "uppercase", textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((n) => (
              <tr key={n.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                <td style={{ padding: "1rem", fontWeight: "600", color: "var(--primary)" }}>#{n.id}</td>
                <td style={{ padding: "1rem" }}>{n.category || "Client"}</td>
                <td style={{ padding: "1rem", fontWeight: "500" }}>{n.description}</td>
                <td style={{ padding: "1rem", color: "var(--text-muted)" }}>{n.trigger}</td>
                <td style={{ padding: "1rem", color: "var(--text-muted)" }}>{n.action}</td>
                <td style={{ padding: "1rem", textAlign: "right" }}>
                  <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
                    <Link href={`/notifications/add?id=${n.id}${activeTab === "bulk" ? "&mode=bulk" : ""}`} className="btn btn-outline" style={{ padding: "0.25rem 0.5rem", display: "inline-flex" }} title="Edit">
                      <Edit size={16} />
                    </Link>
                    <button 
                      className="btn btn-outline" 
                      style={{ padding: "0.25rem 0.5rem", color: "var(--danger)", borderColor: "transparent" }} 
                      title="Delete"
                      onClick={() => deleteNotification(n.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const filteredNotifications = notifications.filter(n => n.campaignType === (activeTab === "time-based" ? "timebased" : "bulk"));

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: "600", color: "var(--dark)" }}>Notifications</h1>
        
        {activeTab !== "log" && (
          <Link href={activeTab === "bulk" ? "/notifications/add?mode=bulk" : "/notifications/add"} className="btn btn-primary">
            <span>Add New {activeTab === "bulk" ? "Bulk" : "Trigger"}</span> <Plus size={18} />
          </Link>
        )}
      </div>

      <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
        <button 
          className={`btn ${activeTab === "time-based" ? "btn-primary" : "btn-outline"}`}
          onClick={() => setActiveTab("time-based")}
        >
          Time Based
        </button>
        <button 
          className={`btn ${activeTab === "bulk" ? "btn-primary" : "btn-outline"}`}
          onClick={() => setActiveTab("bulk")}
        >
          Bulk
        </button>
        <button 
          className={`btn ${activeTab === "log" ? "btn-primary" : "btn-outline"}`}
          onClick={() => setActiveTab("log")}
        >
          Log
        </button>
      </div>

      {(activeTab === "time-based" || activeTab === "bulk") && (
        <div className="card" style={{ padding: "1.5rem", minHeight: "60vh" }}>
          {renderNotificationTable(filteredNotifications)}
        </div>
      )}

      {activeTab === "log" && (
        <div className="card" style={{ padding: "1.5rem", minHeight: "60vh" }}>
          {logs.length === 0 ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "50vh" }}>
              <p style={{ color: "var(--text-muted)" }}>No logs available yet.</p>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "800px" }}>
                <thead>
                  <tr style={{ backgroundColor: "var(--dark)", color: "white", textAlign: "left" }}>
                    <th style={{ padding: "0.75rem 1rem", fontSize: "0.75rem", textTransform: "uppercase" }}>ID</th>
                    <th style={{ padding: "0.75rem 1rem", fontSize: "0.75rem", textTransform: "uppercase" }}>Type</th>
                    <th style={{ padding: "0.75rem 1rem", fontSize: "0.75rem", textTransform: "uppercase" }}>Notifications Sent Till Now</th>
                    <th style={{ padding: "0.75rem 1rem", fontSize: "0.75rem", textTransform: "uppercase", textAlign: "right" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                      <td style={{ padding: "1rem", fontWeight: "600", color: "var(--primary)" }}>#{log.id}</td>
                      <td style={{ padding: "1rem", textTransform: "capitalize" }}>{log.campaignType}</td>
                      <td style={{ padding: "1rem", fontWeight: "500" }}>{log.sentCount.toLocaleString()}</td>
                      <td style={{ padding: "1rem", textAlign: "right" }}>
                        <button 
                          className="btn btn-outline" 
                          style={{ padding: "0.25rem 0.75rem", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
                          onClick={() => setSelectedLog(log)}
                        >
                          <Eye size={16} /> View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* View Log Modal */}
      {selectedLog && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div className="card" style={{ width: "600px", maxHeight: "80vh", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#f8fafc" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: "600", color: "var(--dark)", margin: 0 }}>
                Delivery Log: #{selectedLog.id}
              </h3>
              <button className="btn btn-outline" style={{ padding: "0.5rem", border: "none", color: "var(--text-muted)" }} onClick={() => setSelectedLog(null)}>
                <X size={20} />
              </button>
            </div>
            <div style={{ padding: "1.5rem", overflowY: "auto", flex: 1 }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid var(--border-color)", textAlign: "left" }}>
                    <th style={{ padding: "0.75rem", fontSize: "0.85rem", color: "#64748b" }}>User ID</th>
                    <th style={{ padding: "0.75rem", fontSize: "0.85rem", color: "#64748b" }}>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedLog.deliveries.map((delivery, idx) => (
                    <tr key={idx} style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <td style={{ padding: "0.75rem", fontWeight: "500" }}>{delivery.userId}</td>
                      <td style={{ padding: "0.75rem", color: "var(--text-muted)", fontSize: "0.9rem" }}>{new Date(delivery.timestamp).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// A simple BellOffIcon since I didn't import it at the top
function BellOffIcon({ size, style }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
      <path d="M18.63 13A17.89 17.89 0 0 1 18 8"></path>
      <path d="M6.26 6.26A5.86 5.86 0 0 0 6 8c0 7-3 9-3 9h14"></path>
      <path d="M18 8a6 6 0 0 0-9.33-5"></path>
      <line x1="1" y1="1" x2="23" y2="23"></line>
    </svg>
  );
}
