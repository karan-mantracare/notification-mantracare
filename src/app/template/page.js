"use client";

import { useState } from "react";
import { Plus, Mail, MessageSquare, MoreVertical, X, Smartphone } from "lucide-react";

const NOTIFICATION_TEMPLATES = {
  "Signup": { 
    subject: "Welcome to MantraCare!", 
    email: "<h1>Welcome to MantraCare!</h1><p>Hi {{client_name}},</p><p>We are thrilled to have you on board. Explore our app to get started.</p>",
    text: "Welcome to MantraCare, {{client_name}}! We are thrilled to have you on board. Explore our app to get started."
  },
  "Meeting Scheduled": { 
    subject: "Your Meeting is Scheduled", 
    email: "<h1>Meeting Scheduled</h1><p>Hi {{client_name}},</p><p>Your meeting with {{provider_name}} is scheduled for {{session_date}} at {{session_time}}.</p>",
    text: "Hi {{client_name}}, your meeting with {{provider_name}} is scheduled for {{session_date}} at {{session_time}}."
  },
  "Meeting Link (email with link)": { 
    subject: "Your Meeting Link", 
    email: "<h1>Meeting Link</h1><p>Hi {{client_name}},</p><p>Here is your meeting link: <a href='{{session_link}}'>Join Session</a></p>",
    text: "Hi {{client_name}}, here is your meeting link: {{session_link}}"
  },
  "Profile Edited": { 
    subject: "Profile Updated", 
    email: "<h1>Profile Updated</h1><p>Hi {{client_name}},</p><p>Your profile has been successfully updated.</p>",
    text: "Hi {{client_name}}, your profile has been successfully updated."
  },
  "Password Reset": { 
    subject: "Password Reset Request", 
    email: "<h1>Password Reset</h1><p>Hi {{client_name}},</p><p>You requested a password reset. Please click the link to reset your password.</p>",
    text: "Hi {{client_name}}, you requested a password reset. Please click the link sent to your email."
  },
  "Invite Code Added": { 
    subject: "Invite Code Applied", 
    email: "<h1>Invite Code Applied</h1><p>Hi {{client_name}},</p><p>Your invite code has been successfully added to your account.</p>",
    text: "Hi {{client_name}}, your invite code has been successfully added to your account."
  },
  "Dependent Added": { 
    subject: "Dependent Added", 
    email: "<h1>Dependent Added</h1><p>Hi {{client_name}},</p><p>A new dependent has been added to your plan.</p>",
    text: "Hi {{client_name}}, a new dependent has been added to your plan."
  },
  "Dependent Joined the Plan": { 
    subject: "Dependent Joined", 
    email: "<h1>Dependent Joined</h1><p>Hi {{client_name}},</p><p>Your dependent has successfully joined the plan.</p>",
    text: "Hi {{client_name}}, your dependent has successfully joined the plan."
  },
  "Session Completed - Share Feedback": { 
    subject: "How was your session?", 
    email: "<h1>Session Completed</h1><p>Hi {{client_name}},</p><p>We hope you had a great session with {{provider_name}}. Please share your feedback.</p>",
    text: "Hi {{client_name}}, we hope you had a great session with {{provider_name}}. Please share your feedback in the app."
  }
};

export default function TemplatePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [activeTab, setActiveTab] = useState("email");

  const templatesList = Object.entries(NOTIFICATION_TEMPLATES).map(([name, data]) => ({
    name,
    ...data
  })).filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.subject.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div style={{ padding: "0 2rem 2rem 2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: "600", color: "var(--dark)", margin: 0 }}>Notification Templates</h1>
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
            <select style={{ padding: "0.6rem 1rem", borderRadius: "6px", border: "1px solid var(--border-color)", outline: "none", fontSize: "0.9rem", color: "var(--dark)", backgroundColor: "white" }}>
              <option>All Types</option>
              <option>Email</option>
              <option>SMS / App</option>
            </select>
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
