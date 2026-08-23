"use client";

import { useState, useRef, useEffect } from "react";
import { useNotifications } from "@/context/NotificationContext";
import Link from "next/link";
import { Plus, Edit, Trash2, Eye, X, BellOff, Activity, LayoutTemplate, Bell, FileText } from "lucide-react";
import toast from "react-hot-toast";

export default function NotificationsPage() {
  const { notifications, logs, deleteNotification, selectedCompany } = useNotifications();
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
            <tr style={{ backgroundColor: "#f8fafc", borderBottom: "1px solid var(--border-color)", textAlign: "left" }}>
              <th style={{ padding: "1rem 1.5rem", fontWeight: "600", color: "#64748b", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>ID</th>
              <th style={{ padding: "1rem 1.5rem", fontWeight: "600", color: "#64748b", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>User Type</th>
              <th style={{ padding: "1rem 1.5rem", fontWeight: "600", color: "#64748b", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Name</th>
              <th style={{ padding: "1rem 1.5rem", fontWeight: "600", color: "#64748b", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Trigger / Conditions</th>
              <th style={{ padding: "1rem 1.5rem", fontWeight: "600", color: "#64748b", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Action</th>
              <th style={{ padding: "1rem 1.5rem", fontWeight: "600", color: "#64748b", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((n) => (
              <tr key={n.id} style={{ borderBottom: "1px solid var(--border-color)", transition: "background-color 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f8fafc"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}>
                <td style={{ padding: "1rem 1.5rem", fontWeight: "600", color: "var(--primary)" }}>#{n.id}</td>
                <td style={{ padding: "1rem 1.5rem" }}>{n.category || "Client"}</td>
                <td style={{ padding: "1rem 1.5rem", fontWeight: "500" }}>{n.description}</td>
                <td style={{ padding: "1rem 1.5rem", color: "var(--text-muted)" }}>{n.displayTrigger || n.trigger}</td>
                <td style={{ padding: "1rem 1.5rem", color: "var(--text-muted)" }}>{n.action}</td>
                <td style={{ padding: "1rem 1.5rem", textAlign: "right" }}>
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
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: "600", color: "var(--dark)", margin: 0 }}>Notifications</h1>
          <p style={{ color: "var(--text-muted)", margin: "0.25rem 0 0 0", fontSize: "0.9rem" }}>Showing notifications for {selectedCompany}</p>
        </div>

        {activeTab === "notifications" && (
          <Link href="/notifications/add" className="btn btn-primary">
            <span>Add New Notification</span> <Plus size={18} />
          </Link>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", borderBottom: "1px solid var(--border-color)", width: "100%", gap: "2rem" }}>
          <button
            style={{ 
              display: "flex", alignItems: "center", gap: "0.5rem",
              padding: "0.75rem 0.5rem", 
              fontSize: "1rem", 
              fontWeight: "500", 
              color: activeTab === "notifications" ? "var(--primary)" : "#64748b", 
              backgroundColor: "transparent", 
              border: "none",
              borderBottom: activeTab === "notifications" ? "2px solid var(--primary)" : "2px solid transparent",
              cursor: "pointer",
              transition: "all 0.2s",
              marginBottom: "-1px"
            }}
            onClick={() => handleTabChange("notifications")}
          >
            <Bell size={18} /> Notification
          </button>
          <button
            style={{ 
              display: "flex", alignItems: "center", gap: "0.5rem",
              padding: "0.75rem 0.5rem", 
              fontSize: "1rem", 
              fontWeight: "500", 
              color: activeTab === "log" ? "var(--primary)" : "#64748b", 
              backgroundColor: "transparent", 
              border: "none",
              borderBottom: activeTab === "log" ? "2px solid var(--primary)" : "2px solid transparent",
              cursor: "pointer",
              transition: "all 0.2s",
              marginBottom: "-1px"
            }}
            onClick={() => handleTabChange("log")}
          >
            <FileText size={18} /> Log
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
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "1000px" }}>
                <thead>
                  <tr style={{ backgroundColor: "#f8fafc", borderBottom: "1px solid var(--border-color)", textAlign: "left" }}>
                    <th style={{ padding: "1rem 1.5rem", fontWeight: "600", color: "#64748b", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Log ID</th>
                    <th style={{ padding: "1rem 1.5rem", fontWeight: "600", color: "#64748b", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Notification ID</th>
                    <th style={{ padding: "1rem 1.5rem", fontWeight: "600", color: "#64748b", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Sent To</th>
                    <th style={{ padding: "1rem 1.5rem", fontWeight: "600", color: "#64748b", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Service Type</th>
                    <th style={{ padding: "1rem 1.5rem", fontWeight: "600", color: "#64748b", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Event</th>
                    <th style={{ padding: "1rem 1.5rem", fontWeight: "600", color: "#64748b", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Timestamp</th>
                    <th style={{ padding: "1rem 1.5rem", fontWeight: "600", color: "#64748b", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", textAlign: "right" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log, index) => (
                    <tr key={log.id} style={{ borderBottom: index !== logs.length - 1 ? "1px solid var(--border-color)" : "none", transition: "background-color 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f8fafc"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}>
                      <td style={{ padding: "1rem 1.5rem", fontWeight: "600", color: "var(--dark)" }}>#{log.id}</td>
                      <td style={{ padding: "1rem 1.5rem", color: "var(--primary)", fontWeight: "500" }}>#{log.notificationId}</td>
                      <td style={{ padding: "1rem 1.5rem" }}>{log.sentTo}</td>
                      <td style={{ padding: "1rem 1.5rem", color: "var(--text-muted)" }}>{log.serviceType}</td>
                      <td style={{ padding: "1rem 1.5rem" }}>
                        <span style={{ 
                          padding: "0.25rem 0.5rem", 
                          borderRadius: "4px", 
                          fontSize: "0.8rem", 
                          fontWeight: "500",
                          backgroundColor: log.event === "Failed" ? "#fee2e2" : log.event === "Received" ? "#dcfce7" : log.event === "Viewed" ? "#f3e8ff" : log.event === "Skipped" ? "#fef3c7" : "#e0f2fe",
                          color: log.event === "Failed" ? "#991b1b" : log.event === "Received" ? "#166534" : log.event === "Viewed" ? "#6b21a8" : log.event === "Skipped" ? "#92400e" : "#075985"
                        }}>
                          {log.event}
                        </span>
                      </td>
                      <td style={{ padding: "1rem 1.5rem", color: "var(--text-muted)", fontSize: "0.9rem" }}>{log.timestamp}</td>
                      <td style={{ padding: "1rem 1.5rem", textAlign: "right" }}>
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
          <div className="card" style={{ width: "500px", display: "flex", flexDirection: "column", padding: 0, overflow: "hidden", backgroundColor: "white" }}>
            <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#f8fafc" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: "600", color: "var(--dark)", margin: 0 }}>
                Delivery Log: #{selectedLog.id}
              </h3>
              <button className="btn btn-outline" style={{ padding: "0.5rem", border: "none", color: "var(--text-muted)" }} onClick={() => setSelectedLog(null)}>
                <X size={20} />
              </button>
            </div>
            <div style={{ padding: "2rem 1.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "100px 1fr", gap: "1rem", alignItems: "center" }}>
                <span style={{ fontWeight: "600", color: "var(--text-muted)", fontSize: "0.9rem" }}>Event Status:</span>
                <span style={{ 
                  padding: "0.25rem 0.75rem", 
                  borderRadius: "4px", 
                  fontSize: "0.85rem", 
                  fontWeight: "600",
                  width: "fit-content",
                  backgroundColor: selectedLog.event === "Failed" ? "#fee2e2" : selectedLog.event === "Received" ? "#dcfce7" : selectedLog.event === "Viewed" ? "#f3e8ff" : selectedLog.event === "Skipped" ? "#fef3c7" : "#e0f2fe",
                  color: selectedLog.event === "Failed" ? "#991b1b" : selectedLog.event === "Received" ? "#166534" : selectedLog.event === "Viewed" ? "#6b21a8" : selectedLog.event === "Skipped" ? "#92400e" : "#075985"
                }}>
                  {selectedLog.event}
                </span>
              </div>
              
              <div style={{ display: "grid", gridTemplateColumns: "100px 1fr", gap: "1rem", alignItems: "flex-start" }}>
                <span style={{ fontWeight: "600", color: "var(--text-muted)", fontSize: "0.9rem" }}>Timestamp:</span>
                <div style={{ color: "var(--dark)" }}>
                  {selectedLog.event === "Sent" && <span>Date and time of sent: <br/><strong>{selectedLog.timestamp}</strong></span>}
                  {selectedLog.event === "Received" && <span>Date and time request received: <br/><strong>{selectedLog.timestamp}</strong></span>}
                  {selectedLog.event === "Viewed" && <span>Date and time user viewed it: <br/><strong>{selectedLog.timestamp}</strong></span>}
                  {selectedLog.event === "Failed" && <span>Attempt date and time: <br/><strong>{selectedLog.timestamp}</strong></span>}
                  {selectedLog.event === "Skipped" && <span>Date and time skipped: <br/><strong>{selectedLog.timestamp}</strong></span>}
                </div>
              </div>

              {selectedLog.templateId && (
                <div style={{ display: "grid", gridTemplateColumns: "100px 1fr", gap: "1rem", alignItems: "flex-start" }}>
                  <span style={{ fontWeight: "600", color: "var(--text-muted)", fontSize: "0.9rem" }}>Template ID:</span>
                  <div style={{ color: "var(--dark)", fontWeight: "500" }}>
                    {selectedLog.templateId}
                  </div>
                </div>
              )}

              {(selectedLog.event === "Failed" || selectedLog.event === "Skipped") && (selectedLog.error || selectedLog.reason) && (
                <div style={{ display: "grid", gridTemplateColumns: "100px 1fr", gap: "1rem", alignItems: "flex-start" }}>
                  <span style={{ fontWeight: "600", color: "var(--text-muted)", fontSize: "0.9rem" }}>{selectedLog.event === "Skipped" ? "Reason:" : "Error Details:"}</span>
                  <div style={{ color: selectedLog.event === "Skipped" ? "#92400e" : "var(--danger)", backgroundColor: selectedLog.event === "Skipped" ? "#fef3c7" : "#fee2e2", padding: "0.75rem", borderRadius: "6px", fontSize: "0.9rem", border: selectedLog.event === "Skipped" ? "1px solid #fde68a" : "1px solid #fecaca" }}>
                    {selectedLog.error || selectedLog.reason}
                  </div>
                </div>
              )}
            </div>
            <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid var(--border-color)", backgroundColor: "#f8fafc", textAlign: "right" }}>
              <button className="btn btn-primary" onClick={() => setSelectedLog(null)}>Close</button>
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
