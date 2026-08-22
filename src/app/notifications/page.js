"use client";

import { useState, useRef, useEffect } from "react";
import { useNotifications } from "@/context/NotificationContext";
import Link from "next/link";
import { Plus, Edit, Trash2, Eye, X, BellOff, Activity, LayoutTemplate } from "lucide-react";
import toast from "react-hot-toast";

export default function NotificationsPage() {
  const { notifications, logs, deleteNotification } = useNotifications();
  const [activeTab, setActiveTab] = useState("notifications"); // "notifications", "log"

  useEffect(() => {
    const savedTab = sessionStorage.getItem("notificationsActiveTab");
    if (savedTab && savedTab !== "triggers") {
      setActiveTab(savedTab);
    }
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    sessionStorage.setItem("notificationsActiveTab", tab);
  };

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
          <Link href="/notifications/add" className="btn btn-primary">
            Create your first Notification
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
              <tr key={n.id} className="table-row">
                <td style={{ fontWeight: "600", color: "var(--primary)" }}>#{n.id}</td>
                <td>{n.category || "Client"}</td>
                <td style={{ fontWeight: "500" }}>{n.description}</td>
                <td style={{ color: "var(--text-muted)" }}>{n.displayTrigger || n.trigger}</td>
                <td style={{ color: "var(--text-muted)" }}>{n.action}</td>
                <td style={{ textAlign: "right" }}>
                  <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
                    <Link href={`/notifications/add?id=${n.id}`} className="btn btn-outline" style={{ padding: "0.25rem 0.5rem", display: "inline-flex" }} title="Edit">
                      <Edit size={16} />
                    </Link>
                    <button
                      className="btn btn-outline"
                      style={{ padding: "0.25rem 0.5rem", color: "var(--danger)", borderColor: "transparent" }}
                      title="Delete"
                      onClick={() => {
                        deleteNotification(n.id);
                        toast.success("Notification deleted");
                      }}
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

  const filteredNotifications = notifications.filter(n => {
    if (activeTab === "notifications") {
      return true;
    }
    return false;
  });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: "600", color: "var(--dark)" }}>Notifications</h1>

        {activeTab === "notifications" && (
          <Link href="/notifications/add" className="btn btn-primary">
            <span>Add New Notification</span> <Plus size={18} />
          </Link>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.5rem" }}>
        <div style={{ display: "inline-flex", backgroundColor: "#f1f5f9", padding: "0.25rem", borderRadius: "0.5rem", width: "fit-content" }}>
          <button
            style={{ padding: "0.5rem 1.25rem", borderRadius: "0.375rem", fontSize: "0.9rem", fontWeight: "500", color: activeTab === "notifications" ? "var(--dark)" : "var(--text-muted)", backgroundColor: activeTab === "notifications" ? "white" : "transparent", boxShadow: activeTab === "notifications" ? "0 1px 3px rgba(0,0,0,0.1)" : "none", transition: "all 0.2s" }}
            onClick={() => handleTabChange("notifications")}
          >
            Notification
          </button>
          <button
            style={{ padding: "0.5rem 1.25rem", borderRadius: "0.375rem", fontSize: "0.9rem", fontWeight: "500", color: activeTab === "log" ? "var(--dark)" : "var(--text-muted)", backgroundColor: activeTab === "log" ? "white" : "transparent", boxShadow: activeTab === "log" ? "0 1px 3px rgba(0,0,0,0.1)" : "none", transition: "all 0.2s" }}
            onClick={() => handleTabChange("log")}
          >
            Log
          </button>
        </div>
      </div>

      {activeTab === "triggers" && (
        <div style={{ backgroundColor: "white", borderRadius: "8px", overflow: "hidden", border: "1px solid var(--border-color)", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", marginBottom: "2rem" }}>
          <div style={{ padding: "1rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-color)" }}>
            <h2 style={{ fontSize: "1.1rem", fontWeight: "500", margin: 0, color: "var(--dark)" }}>Triggers</h2>
            <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
              <button style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </button>
              <button
                style={{ backgroundColor: "#e8f0fe", color: "#1a73e8", border: "none", padding: "0.5rem 1.2rem", borderRadius: "4px", fontSize: "0.9rem", fontWeight: "500", cursor: "pointer" }}
                onClick={() => setIsCreatingTrigger(true)}
              >
                New
              </button>
            </div>
          </div>

          {triggers.length === 0 ? (
            <div style={{ padding: "4rem 1rem", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
              <LayoutTemplate size={48} style={{ color: "var(--text-muted)", opacity: 0.5, marginBottom: "0.5rem" }} />
              <h3 style={{ color: "var(--dark)", fontSize: "1.2rem", fontWeight: "600" }}>No triggers configured</h3>
              <p style={{ color: "var(--text-muted)", maxWidth: "400px" }}>This container has no triggers. Create one to define when your notifications should be sent.</p>
              <button className="btn btn-primary" onClick={() => setIsCreatingTrigger(true)} style={{ marginTop: "1rem" }}>
                Create New Trigger
              </button>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.9rem" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border-color)", color: "var(--text-muted)" }}>
                    <th style={{ padding: "1rem 1.5rem", width: "40px" }}>
                      <input type="checkbox" style={{ cursor: "pointer", width: "16px", height: "16px" }} />
                    </th>
                    <th style={{ padding: "1rem 1.5rem", fontWeight: "500" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "4px", cursor: "pointer" }}>
                        Name
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5"></path><polyline points="5 12 12 5 19 12"></polyline></svg>
                      </div>
                    </th>
                    <th style={{ padding: "1rem 1.5rem", fontWeight: "500" }}>Event Type</th>
                    <th style={{ padding: "1rem 1.5rem", fontWeight: "500" }}>Filter</th>
                    <th style={{ padding: "1rem 1.5rem", fontWeight: "500" }}>Tags</th>
                    <th style={{ padding: "1rem 1.5rem", fontWeight: "500" }}>Last Edited</th>
                  </tr>
                </thead>
                <tbody>
                  {triggers.map(trigger => (
                    <tr key={trigger.id} className="table-row">
                      <td>
                        <input type="checkbox" style={{ cursor: "pointer", width: "16px", height: "16px" }} />
                      </td>
                      <td style={{ color: "var(--primary)", cursor: "pointer", fontWeight: "600" }}>{trigger.name}</td>
                      <td style={{ color: "var(--text-main)" }}>{trigger.eventType}</td>
                      <td>
                        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                          <span style={{ backgroundColor: "#f1f5f9", padding: "0.2rem 0.6rem", borderRadius: "4px", color: "var(--dark)", fontSize: "0.85rem", fontWeight: "500" }}>{trigger.filterField}</span>
                          <span style={{ color: "var(--text-main)" }}>{trigger.filterCondition}</span>
                        </div>
                      </td>
                      <td style={{ color: "var(--text-main)" }}>{trigger.tags}</td>
                      <td style={{ color: "var(--text-muted)" }}>{trigger.lastEdited}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === "notifications" && (
        <div className="card" style={{ padding: "1.5rem", minHeight: "60vh" }}>
          {renderNotificationTable(filteredNotifications)}
        </div>
      )}

      {activeTab === "log" && (
        <div className="card" style={{ padding: "1.5rem", minHeight: "60vh" }}>
          {logs.length === 0 ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "50vh", gap: "1rem" }}>
              <div style={{ color: "var(--text-muted)", marginBottom: "1rem", textAlign: "center" }}>
                <Activity size={48} style={{ margin: "0 auto", marginBottom: "1rem", opacity: 0.5 }} />
                <h3 style={{ color: "var(--dark)", fontSize: "1.2rem", fontWeight: "600", marginBottom: "0.5rem" }}>No activity logs yet</h3>
                <p>Logs will appear here once notifications are triggered.</p>
              </div>
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
