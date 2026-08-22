"use client";

import { useState } from "react";
import { Plus, Mail, MessageSquare, MoreVertical, X, Smartphone } from "lucide-react";
import { useNotifications } from "@/context/NotificationContext";
import CustomSelect from "@/components/CustomSelect";

export default function TemplatePage() {
  const { templates, selectedCompany } = useNotifications();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [activeTab, setActiveTab] = useState("email");

  const templatesList = Object.entries(templates).map(([name, data]) => ({
    name,
    ...data
  })).filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.subject.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div style={{ padding: "0 2rem 2rem 2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: "600", color: "var(--dark)", margin: 0 }}>Notification Templates</h1>
          <p style={{ color: "var(--text-muted)", margin: "0.25rem 0 0 0", fontSize: "0.9rem" }}>Showing templates for {selectedCompany}</p>
        </div>
      </div>

      <div className="card" style={{ padding: "1.5rem", marginBottom: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <div style={{ position: "relative", width: "300px" }}>
            <input 
              type="text" 
              placeholder="Search templates..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: "100%", padding: "0.6rem 1rem 0.6rem 2.5rem", borderRadius: "6px", border: "1px solid var(--border-color)", outline: "none", fontSize: "0.9rem" }}
            />
            <svg style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </div>
          <div style={{ display: "flex", gap: "1rem" }}>
            <CustomSelect
              value="All Types"
              onChange={() => {}}
              options={["All Types", "Email", "SMS / App"]}
              style={{ width: "150px" }}
            />
          </div>
        </div>

        {templatesList.length === 0 ? (
          <div style={{ padding: "4rem", textAlign: "center", color: "var(--text-muted)" }}>
            No templates found matching "{searchQuery}"
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
            {templatesList.map((template, idx) => (
              <div 
                key={idx} 
                style={{ border: "1px solid var(--border-color)", borderRadius: "8px", overflow: "hidden", backgroundColor: "white", transition: "box-shadow 0.2s, transform 0.2s", cursor: "pointer" }} 
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.05)"; e.currentTarget.style.transform = "translateY(-2px)"; }} 
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}
                onClick={() => { setSelectedTemplate(template); setActiveTab("email"); }}
              >
                <div style={{ padding: "1.25rem", borderBottom: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: "600", color: "var(--dark)", marginBottom: "0.5rem" }}>{template.name}</h3>
                    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                      <span style={{ fontSize: "0.75rem", fontWeight: "500", color: "#64748b", display: "flex", alignItems: "center", gap: "0.25rem", backgroundColor: "#f1f5f9", padding: "0.25rem 0.5rem", borderRadius: "4px" }}>
                        <Mail size={12} /> Email
                      </span>
                      <span style={{ fontSize: "0.75rem", fontWeight: "500", color: "#64748b", display: "flex", alignItems: "center", gap: "0.25rem", backgroundColor: "#f1f5f9", padding: "0.25rem 0.5rem", borderRadius: "4px" }}>
                        <MessageSquare size={12} /> SMS / App
                      </span>
                    </div>
                  </div>
                  <button style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: "0.25rem" }}>
                    <MoreVertical size={16} />
                  </button>
                </div>
                <div style={{ padding: "1.25rem", backgroundColor: "#f8fafc" }}>
                  <div style={{ marginBottom: "0.75rem" }}>
                    <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: "600", color: "#94a3b8", display: "block", marginBottom: "0.25rem" }}>Subject</span>
                    <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--dark)", fontWeight: "500" }}>{template.subject}</p>
                  </div>
                  <div>
                    <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: "600", color: "#94a3b8", display: "block", marginBottom: "0.25rem" }}>Preview</span>
                    <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-main)", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden", lineHeight: "1.5" }}>
                      {template.text}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedTemplate && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(15, 23, 42, 0.4)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => setSelectedTemplate(null)}>
          <div style={{ width: "650px", backgroundColor: "white", borderRadius: "8px", boxShadow: "0 10px 25px rgba(0,0,0,0.1)", display: "flex", flexDirection: "column", maxHeight: "85vh", animation: "slideInUp 0.3s ease-out" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ fontSize: "1.25rem", fontWeight: "600", margin: 0, color: "var(--dark)" }}>{selectedTemplate.name}</h2>
              <button style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }} onClick={() => setSelectedTemplate(null)}>
                <X size={20} />
              </button>
            </div>
            
            <div style={{ borderBottom: "1px solid var(--border-color)", display: "flex", backgroundColor: "#f8fafc" }}>
              <button 
                style={{ padding: "1rem 1.5rem", background: "none", border: "none", borderBottom: activeTab === "email" ? "2px solid #1a73e8" : "2px solid transparent", color: activeTab === "email" ? "#1a73e8" : "var(--text-muted)", fontWeight: activeTab === "email" ? "600" : "500", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem" }}
                onClick={() => setActiveTab("email")}
              >
                <Mail size={16} /> Email
              </button>
              <button 
                style={{ padding: "1rem 1.5rem", background: "none", border: "none", borderBottom: activeTab === "sms" ? "2px solid #1a73e8" : "2px solid transparent", color: activeTab === "sms" ? "#1a73e8" : "var(--text-muted)", fontWeight: activeTab === "sms" ? "600" : "500", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem" }}
                onClick={() => setActiveTab("sms")}
              >
                <MessageSquare size={16} /> SMS
              </button>
              <button 
                style={{ padding: "1rem 1.5rem", background: "none", border: "none", borderBottom: activeTab === "text" ? "2px solid #1a73e8" : "2px solid transparent", color: activeTab === "text" ? "#1a73e8" : "var(--text-muted)", fontWeight: activeTab === "text" ? "600" : "500", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem" }}
                onClick={() => setActiveTab("text")}
              >
                <Smartphone size={16} /> Text Notification
              </button>
            </div>

            <div style={{ padding: "1.5rem", overflowY: "auto", flex: 1, backgroundColor: "#fcfcfc" }}>
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ display: "block", fontSize: "0.8rem", textTransform: "uppercase", fontWeight: "600", color: "#64748b", marginBottom: "0.5rem", letterSpacing: "0.5px" }}>Subject</label>
                <div style={{ padding: "0.75rem 1rem", backgroundColor: "white", border: "1px solid var(--border-color)", borderRadius: "6px", color: "var(--dark)", fontWeight: "500" }}>
                  {selectedTemplate.subject}
                </div>
              </div>
              
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", textTransform: "uppercase", fontWeight: "600", color: "#64748b", marginBottom: "0.5rem", letterSpacing: "0.5px" }}>Message Preview</label>
                <div style={{ padding: "1rem", backgroundColor: "white", border: "1px solid var(--border-color)", borderRadius: "6px", color: "var(--text-main)", minHeight: "200px", lineHeight: "1.6" }}>
                  {activeTab === "email" ? (
                    <div dangerouslySetInnerHTML={{ __html: selectedTemplate.email }} />
                  ) : (
                    <div style={{ whiteSpace: "pre-wrap" }}>{selectedTemplate.text}</div>
                  )}
                </div>
              </div>
            </div>
            
            <div style={{ padding: "1.25rem 1.5rem", borderTop: "1px solid var(--border-color)", display: "flex", justifyContent: "flex-end" }}>
              <button className="btn btn-outline" onClick={() => setSelectedTemplate(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
