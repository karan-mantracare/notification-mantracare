"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useNotifications } from "@/context/NotificationContext";
import dynamic from "next/dynamic";
import { ArrowLeft, Save, Smartphone, Mail, MessageSquare, Info, Monitor, X, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import "react-quill-new/dist/quill.snow.css";

// Dynamically import ReactQuill to prevent SSR issues
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const APP_SCREENS = [
  "Pain Areas", "Depression", "Physic Neck", "Anxiety", "Stress",
  "Adolescent", "Workplace", "Sleep", "Parenting", "Grief",
  "Acceptance", "Postpartum", "Sexuality", "Eating Disorder",
  "Emotional Wellbeing", "UserStats"
]
const CORPORATES = ["EY", "Google", "Microsoft", "Amazon", "Apple", "Netflix", "Accenture", "Deloitte"];
const TIMEZONES = ["IST (GMT+5:30)", "EST (GMT-5:00)", "PST (GMT-8:00)", "GMT (GMT+0:00)"];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const EMAIL_PROVIDERS = {
  Sendgrid: ["donotreply@mantra.care", "support@mantra.care", "provider@mantra.care"],
  Brevo: ["donotreply@mantra.care", "donotreply@mantracare.com", "provider@mantra.care", "provider@mantracare.com"],
  SES: ["donotreply@mantra.care", "donotreply@mantracare.org", "provider@mantra.care", "provider@mantracare.org"]
};

function AddNotificationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");
  const isBulk = searchParams.get("mode") === "bulk";
  const { notifications, triggers, addNotification, updateNotification } = useNotifications();

  const [formData, setFormData] = useState({
    userType: "Client",
    name: "",
    description: "",
    type: "App",
    actionScreen: APP_SCREENS[0],
    emailProvider: "Sendgrid",
    senderEmail: "donotreply@mantra.care",
    emailSubject: "",
    emailContent: "",
    smsContent: "",
    service: "Therapy",
    orderPurchased: "Yes",
    trigger: triggers && triggers.length > 0 ? triggers[0].name : "On signup",
    timing: "Instantly",
    eventType: "One-time",
    scheduleDate: "",
    scheduleTime: "",
    scheduleTimezone: "IST (GMT+5:30)",
    recurringFrequency: "Weekly",
    recurringDays: [],
    recurringTime: "",
    recurringTimezone: "IST (GMT+5:30)",
    monthlySchedules: [{ id: 1, date: "", time: "", timezone: "IST (GMT+5:30)" }],
    visibleToAll: false,
    selectedServices: [],
    selectedCorporates: [],
  });

  const [isBasicDetailsOpen, setIsBasicDetailsOpen] = useState(true);
  const [isTriggerOpen, setIsTriggerOpen] = useState(true);
  const [isContentSetupOpen, setIsContentSetupOpen] = useState(true);
  const [isConditionsOpen, setIsConditionsOpen] = useState(true);

  const [serviceDropdownOpen, setServiceDropdownOpen] = useState(false);
  const [corporateDropdownOpen, setCorporateDropdownOpen] = useState(false);

  const corporateDropdownRef = useRef(null);
  const serviceDropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (corporateDropdownRef.current && !corporateDropdownRef.current.contains(event.target)) {
        setCorporateDropdownOpen(false);
      }
      if (serviceDropdownRef.current && !serviceDropdownRef.current.contains(event.target)) {
        setServiceDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [emailInputMode, setEmailInputMode] = useState("Text");
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewMode, setPreviewMode] = useState("laptop");

  useEffect(() => {
    if (editId) {
      const existing = notifications.find(n => n.id === Number(editId));
      if (existing) {
        setFormData(prev => ({
          ...prev,
          ...existing,
          userType: existing.userType || existing.category || "Client",
          name: existing.name || existing.description || "",
        }));
      }
    }
  }, [editId, notifications]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!formData.name) return alert("Please enter a name");

    if (formData.type === "Email") {
      if (!formData.emailSubject.trim()) return alert("Please enter an email subject");

      // React Quill often leaves empty paragraph tags when "empty"
      const strippedContent = formData.emailContent.replace(/(<([^>]+)>)/gi, "").trim();
      if (!strippedContent) return alert("Please enter the email content");
    }

    if (formData.type === "SMS" && !formData.smsContent.trim()) {
      return alert("Please enter the SMS content");
    }

    let formattedTrigger = "";
    if (isBulk) {
      const parts = [];
      if (formData.selectedServices.length > 0) parts.push(formData.selectedServices.join(", "));
      if (formData.visibleToAll) {
        parts.push("All Corporates");
      } else if (formData.selectedCorporates.length > 0) {
        parts.push(formData.selectedCorporates.join(", "));
      }

      const audienceStr = parts.length > 0 ? parts.join(" | ") : "Unspecified";

      let timingStr = "";
      if (formData.eventType === "One-time") {
        timingStr = `One-time: ${formData.scheduleDate || "-"} at ${formData.scheduleTime || "-"} ${formData.scheduleTimezone}`;
      } else {
        if (formData.recurringFrequency === "Daily") {
          timingStr = `Recurring (Daily): at ${formData.recurringTime || "-"} ${formData.recurringTimezone}`;
        } else if (formData.recurringFrequency === "Weekly") {
          const daysStr = formData.recurringDays.length ? formData.recurringDays.join(", ") : "No days";
          timingStr = `Recurring (Weekly): ${daysStr} at ${formData.recurringTime || "-"} ${formData.recurringTimezone}`;
        } else {
          timingStr = `Recurring (Monthly): ${formData.monthlySchedules.length} date(s)`;
        }
      }

      formattedTrigger = `Bulk [${audienceStr}] - ${timingStr}`;
    } else {
      const parts = [];
      if (formData.selectedServices.length > 0) parts.push(formData.selectedServices.join(", "));
      if (formData.visibleToAll) {
        parts.push("All Corporates");
      } else if (formData.selectedCorporates.length > 0) {
        parts.push(formData.selectedCorporates.join(", "));
      }

      const audienceStr = parts.length > 0 ? `[${parts.join(" | ")}]` : "";

      formattedTrigger = formData.timing === "Instantly"
        ? `Instantly on ${formData.trigger.toLowerCase()} ${audienceStr}`.trim()
        : `${formData.timing} post ${formData.trigger.toLowerCase()} ${audienceStr}`.trim();
    }

    const payload = {
      ...formData,
      category: formData.userType,
      description: formData.name,
      action: formData.type === "App" ? `Open App> ${formData.actionScreen}` : `${formData.type} Notification`,
      trigger: formattedTrigger,
      campaignType: isBulk ? "bulk" : "timebased",
    };

    if (editId) {
      updateNotification(Number(editId), payload);
    } else {
      addNotification(payload);
    }

    router.push("/notifications");
  };

  return (
    <div>
      <div style={{ position: "sticky", top: 0, zIndex: 50, backgroundColor: "rgba(248, 250, 252, 0.9)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", gap: "1rem", padding: "1rem 0", marginBottom: "1rem", borderBottom: "1px solid var(--border-color)", margin: "-1.5rem -1.5rem 1.5rem -1.5rem", paddingLeft: "1.5rem", paddingRight: "1.5rem" }}>
        <Link href="/notifications" className="btn btn-outline" style={{ padding: "0.5rem" }}>
          <ArrowLeft size={18} />
        </Link>
        <h1 style={{ fontSize: "1.5rem", fontWeight: "600", color: "var(--dark)" }}>
          {isBulk ? "Add Bulk Campaign" : (editId ? "Edit Notification" : "Add New Notification")}
        </h1>

        <div style={{ marginLeft: "auto" }}>
          <button className="btn btn-primary" onClick={handleSave}>
            <Save size={18} /> Save Notification
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "1.5rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

          {/* Basic Details */}
          <div className="card" style={{ padding: "0", overflow: "hidden" }}>
            <div 
              style={{ padding: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", backgroundColor: "white", borderBottom: isBasicDetailsOpen ? "1px solid var(--border-color)" : "none" }}
              onClick={() => setIsBasicDetailsOpen(!isBasicDetailsOpen)}
            >
              <h2 style={{ fontSize: "1.1rem", margin: 0, color: "var(--dark)", fontWeight: "600" }}>Basic Details</h2>
              <button style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "flex" }}>
                {isBasicDetailsOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
            </div>

            <div className={`accordion-content ${isBasicDetailsOpen ? "open" : ""}`}>
              <div className="accordion-content-inner" style={{ padding: "1.5rem" }}>
                <div className="input-group">
                  <label>User Type</label>
                  <div style={{ display: "flex", gap: "1.5rem" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: "normal", cursor: "pointer" }}>
                      <input type="radio" name="userType" value="Client" checked={formData.userType === "Client"} onChange={handleChange} style={{ width: "16px", height: "16px", accentColor: "var(--primary)" }} />
                      Client
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: "normal", cursor: "pointer" }}>
                      <input type="radio" name="userType" value="Provider" checked={formData.userType === "Provider"} onChange={handleChange} style={{ width: "16px", height: "16px", accentColor: "var(--primary)" }} />
                      Provider
                    </label>
                  </div>
                </div>

                <div className="input-group">
                  <label>Name</label>
                  <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Welcome Series 1" />
                </div>

                <div className="input-group">
                  <label>Description</label>
                  <textarea className="form-control" name="description" value={formData.description} onChange={handleChange} rows="3" placeholder="Internal description..."></textarea>
                </div>
              </div>
            </div>
          </div>

          {/* Trigger */}
          {!isBulk && (
            <div className="card" style={{ padding: "0", overflow: "hidden" }}>
              <div 
                style={{ padding: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", backgroundColor: "white", borderBottom: isTriggerOpen ? "1px solid var(--border-color)" : "none" }}
                onClick={() => setIsTriggerOpen(!isTriggerOpen)}
              >
                <h2 style={{ fontSize: "1.1rem", margin: 0, color: "var(--dark)", fontWeight: "600" }}>Trigger</h2>
                <button style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "flex" }}>
                  {isTriggerOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
              </div>

              <div className={`accordion-content ${isTriggerOpen ? "open" : ""}`}>
                <div className="accordion-content-inner" style={{ padding: "1.5rem" }}>
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label>Trigger Event</label>
                    <select className="form-control" name="trigger" value={formData.trigger} onChange={handleChange} style={{ maxWidth: "400px" }}>
                      {triggers && triggers.length > 0 ? (
                        triggers.map(t => (
                          <option key={t.id} value={t.name}>{t.name}</option>
                        ))
                      ) : (
                        <option value="">No triggers available</option>
                      )}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Content Setup */}
          <div className="card" style={{ padding: "0", overflow: "hidden" }}>
            <div 
              style={{ padding: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", backgroundColor: "white", borderBottom: isContentSetupOpen ? "1px solid var(--border-color)" : "none" }}
              onClick={() => setIsContentSetupOpen(!isContentSetupOpen)}
            >
              <h2 style={{ fontSize: "1.1rem", margin: 0, color: "var(--dark)", fontWeight: "600" }}>Content Setup</h2>
              <button style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "flex" }}>
                {isContentSetupOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
            </div>

            <div className={`accordion-content ${isContentSetupOpen ? "open" : ""}`}>
              <div className="accordion-content-inner" style={{ padding: "1.5rem" }}>
                <div className="input-group">
                  <label>Type</label>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  className={`btn ${formData.type === "App" ? "btn-primary" : "btn-outline"}`}
                  onClick={() => setFormData({ ...formData, type: "App" })}
                >
                  <Smartphone size={16} /> App Notification
                </button>
                <button
                  className={`btn ${formData.type === "Email" ? "btn-primary" : "btn-outline"}`}
                  onClick={() => setFormData({ ...formData, type: "Email" })}
                >
                  <Mail size={16} /> Email
                </button>
                <button
                  className={`btn ${formData.type === "SMS" ? "btn-primary" : "btn-outline"}`}
                  onClick={() => setFormData({ ...formData, type: "SMS" })}
                >
                  <MessageSquare size={16} /> SMS
                </button>
              </div>
            </div>

            {formData.type === "App" && (
              <div style={{ marginTop: "1.5rem" }}>
                <div className="input-group">
                  <label>Action (Screen)</label>
                  <select className="form-control" name="actionScreen" value={formData.actionScreen} onChange={handleChange} style={{ maxWidth: "400px" }}>
                    {APP_SCREENS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            )}

            {formData.type === "Email" && (
              <div style={{ marginTop: "1rem" }}>
                <div className="input-group">
                  <label>Sender Email</label>
                  <select className="form-control" name="senderEmail" value={formData.senderEmail} onChange={handleChange} style={{ maxWidth: "400px" }}>
                    {EMAIL_PROVIDERS[formData.emailProvider].map(email => (
                      <option key={email} value={email}>{email}</option>
                    ))}
                  </select>
                </div>

                <div className="input-group">
                  <label>Email Subject</label>
                  <input type="text" className="form-control" name="emailSubject" value={formData.emailSubject} onChange={handleChange} placeholder="Enter subject line..." />
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "0.5rem" }}>
                  <label style={{ fontWeight: "500", fontSize: "0.875rem" }}>Email Content</label>
                  <div style={{ display: "flex", backgroundColor: "#f1f5f9", borderRadius: "4px", padding: "2px" }}>
                    <button
                      style={{ padding: "0.25rem 0.75rem", fontSize: "0.75rem", borderRadius: "2px", backgroundColor: emailInputMode === "Text" ? "white" : "transparent", boxShadow: emailInputMode === "Text" ? "0 1px 2px rgba(0,0,0,0.1)" : "none", color: emailInputMode === "Text" ? "var(--dark)" : "var(--text-muted)" }}
                      onClick={() => setEmailInputMode("Text")}
                    >
                      Visual
                    </button>
                    <button
                      style={{ padding: "0.25rem 0.75rem", fontSize: "0.75rem", borderRadius: "2px", backgroundColor: emailInputMode === "HTML" ? "white" : "transparent", boxShadow: emailInputMode === "HTML" ? "0 1px 2px rgba(0,0,0,0.1)" : "none", color: emailInputMode === "HTML" ? "var(--dark)" : "var(--text-muted)" }}
                      onClick={() => setEmailInputMode("HTML")}
                    >
                      Code
                    </button>
                  </div>
                </div>

                {emailInputMode === "Text" ? (
                  <div style={{ border: "1px solid var(--border-color)", borderRadius: "0.375rem", overflow: "hidden" }}>
                    <ReactQuill
                      theme="snow"
                      value={formData.emailContent}
                      onChange={(content) => setFormData({ ...formData, emailContent: content })}
                      style={{ height: "200px", border: "none" }}
                    />
                  </div>
                ) : (
                  <textarea
                    className="form-control"
                    style={{ minHeight: "240px", width: "100%", fontFamily: "monospace", padding: "1rem", whiteSpace: "pre-wrap" }}
                    value={formData.emailContent}
                    onChange={(e) => setFormData({ ...formData, emailContent: e.target.value })}
                    placeholder={`<!DOCTYPE html>\n<html>\n  <head></head>\n  <body>\n    <h1>Hello World</h1>\n    <p>Your content here.</p>\n  </body>\n</html>`}
                  />
                )}
              </div>
            )}

            {formData.type === "SMS" && (
              <div style={{ marginTop: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <label style={{ fontWeight: "500", fontSize: "0.875rem" }}>SMS Content</label>
                  <span style={{ fontSize: "0.75rem", color: formData.smsContent.length > 160 ? "var(--danger)" : "var(--text-muted)" }}>
                    {formData.smsContent.length}/160 characters
                  </span>
                </div>
                <textarea
                  className="form-control"
                  style={{ minHeight: "150px", width: "100%", resize: "vertical" }}
                  value={formData.smsContent}
                  onChange={(e) => setFormData({ ...formData, smsContent: e.target.value })}
                  placeholder="Enter SMS message..."
                />
              </div>
            )}
              </div>
            </div>
          </div>

          {/* Conditions */}
          <div className="card" style={{ padding: "0", overflow: "visible" }}>
            <div 
              style={{ padding: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", backgroundColor: "white", borderBottom: isConditionsOpen ? "1px solid var(--border-color)" : "none" }}
              onClick={() => setIsConditionsOpen(!isConditionsOpen)}
            >
              <h2 style={{ fontSize: "1.1rem", margin: 0, color: "var(--dark)", fontWeight: "600" }}>
                {isBulk ? "Conditions & Scheduling" : "Conditions"}
              </h2>
              <button style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "flex" }}>
                {isConditionsOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
            </div>

            <div className={`accordion-content ${isConditionsOpen ? "open" : ""}`}>
              <div className="accordion-content-inner" style={{ padding: "1.5rem" }}>

              <div style={{ display: "grid", gridTemplateColumns: isBulk ? "1fr" : "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem", paddingBottom: "1.5rem", borderBottom: "1px solid var(--border-color)", alignItems: "end" }}>
                {!isBulk && (
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label style={{ display: "block", fontSize: "0.75rem", fontWeight: "600", color: "#64748b", textTransform: "uppercase", marginBottom: "0.5rem" }}>Send Timing</label>
                    <select className="form-control" name="timing" value={formData.timing} onChange={handleChange}>
                      <option value="Instantly">Instantly</option>
                      <option value="1 Day">1 Day</option>
                      <option value="2 Days">2 Days</option>
                      <option value="7 Days">7 Days</option>
                      <option value="14 Days">14 Days</option>
                      <option value="30 Days">30 Days</option>
                    </select>
                  </div>
                )}

                {/* Toggle Row */}
                <div style={{ backgroundColor: "#f8fafc", borderRadius: "0.5rem", padding: "1rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid var(--border-color)" }}>
                  <div>
                    <div style={{ fontWeight: "600", color: "var(--dark)", marginBottom: "0.2rem", fontSize: "0.95rem" }}>Visible to all corporates</div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Enable to show this event to every corporate division</div>
                  </div>
                  <label style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      style={{ display: "none" }}
                      checked={formData.visibleToAll}
                      onChange={(e) => setFormData({ ...formData, visibleToAll: e.target.checked })}
                    />
                    <div style={{ width: "40px", height: "22px", backgroundColor: formData.visibleToAll ? "var(--primary)" : "#cbd5e1", borderRadius: "20px", position: "relative", transition: "background-color 0.2s" }}>
                      <div style={{ width: "18px", height: "18px", backgroundColor: "white", borderRadius: "50%", position: "absolute", top: "2px", left: formData.visibleToAll ? "20px" : "2px", transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
                    </div>
                  </label>
                </div>
              </div>

              {/* Dropdowns Row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>

                {/* Corporates Dropdown */}
                <div style={{ position: "relative" }} ref={corporateDropdownRef}>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: "600", color: "#64748b", textTransform: "uppercase", marginBottom: "0.5rem" }}>
                    Target Corporates
                  </label>
                  <div
                    style={{
                      padding: "0.75rem 1rem",
                      border: "1px solid var(--border-color)",
                      borderRadius: "0.5rem",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      cursor: formData.visibleToAll ? "not-allowed" : "pointer",
                      backgroundColor: formData.visibleToAll ? "#f1f5f9" : "white",
                      color: formData.visibleToAll ? "#94a3b8" : "var(--dark)"
                    }}
                    onClick={() => !formData.visibleToAll && setCorporateDropdownOpen(!corporateDropdownOpen)}
                  >
                    <span style={{ fontSize: "0.9rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {formData.selectedCorporates.length > 0 
                        ? `${formData.selectedCorporates.length} selected`
                        : "Select corporates"}
                    </span>
                    <ChevronDown size={16} color="var(--text-muted)" />
                  </div>
                  
                  {corporateDropdownOpen && !formData.visibleToAll && (
                    <div style={{ position: "absolute", top: "100%", left: 0, right: 0, marginTop: "4px", backgroundColor: "white", border: "1px solid var(--border-color)", borderRadius: "0.5rem", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)", zIndex: 10, maxHeight: "250px", overflowY: "auto" }}>
                      <div style={{ padding: "0.5rem", borderBottom: "1px solid #f1f5f9" }}>
                        <input type="text" placeholder="Search..." style={{ width: "100%", padding: "0.5rem", border: "1px solid var(--border-color)", borderRadius: "4px", outline: "none", fontSize: "0.85rem" }} />
                      </div>
                      {CORPORATES.map(corp => (
                        <label key={corp} style={{ display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer", fontSize: "0.9rem", color: "var(--dark)", padding: "0.75rem 1rem", borderBottom: "1px solid #f8fafc", transition: "background-color 0.1s" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f8fafc"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}>
                          <input 
                            type="checkbox"
                            checked={formData.selectedCorporates.includes(corp)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData({ ...formData, selectedCorporates: [...formData.selectedCorporates, corp] });
                              } else {
                                setFormData({ ...formData, selectedCorporates: formData.selectedCorporates.filter(c => c !== corp) });
                              }
                            }}
                            style={{ width: "16px", height: "16px", accentColor: "var(--primary)", cursor: "pointer" }}
                          />
                          {corp}
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Services Dropdown */}
                <div style={{ position: "relative" }} ref={serviceDropdownRef}>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: "600", color: "#64748b", textTransform: "uppercase", marginBottom: "0.5rem" }}>
                    Visible to Services (B2C)
                  </label>
                  <div
                    style={{
                      padding: "0.75rem 1rem",
                      border: "1px solid var(--border-color)",
                      borderRadius: "0.5rem",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      cursor: "pointer",
                      backgroundColor: "white"
                    }}
                    onClick={() => setServiceDropdownOpen(!serviceDropdownOpen)}
                  >
                    <span style={{ fontSize: "0.9rem", color: "var(--dark)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {formData.selectedServices.length > 0 
                        ? `${formData.selectedServices.length} selected`
                        : "Select services"}
                    </span>
                    <ChevronDown size={16} color="var(--text-muted)" />
                  </div>
                  
                  {serviceDropdownOpen && (
                    <div style={{ position: "absolute", top: "100%", left: 0, right: 0, marginTop: "4px", backgroundColor: "white", border: "1px solid var(--border-color)", borderRadius: "0.5rem", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)", zIndex: 10, maxHeight: "250px", overflowY: "auto" }}>
                      {["Therapy", "Psychiatry", "Couples", "Teen", "Diet", "Physio", "Sleep", "Yoga"].map(service => (
                        <label key={service} style={{ display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer", fontSize: "0.9rem", color: "var(--dark)", padding: "0.75rem 1rem", borderBottom: "1px solid #f8fafc", transition: "background-color 0.1s" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f8fafc"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}>
                          <input 
                            type="checkbox"
                            checked={formData.selectedServices.includes(service)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData({ ...formData, selectedServices: [...formData.selectedServices, service] });
                              } else {
                                setFormData({ ...formData, selectedServices: formData.selectedServices.filter(s => s !== service) });
                              }
                            }}
                            style={{ width: "16px", height: "16px", accentColor: "var(--primary)", cursor: "pointer" }}
                          />
                          {service}
                        </label>
                      ))}
                    </div>
                  )}
                </div>

              </div>
                <div style={{ marginBottom: "2rem" }}>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: "600", color: "#64748b", textTransform: "uppercase", marginBottom: "0.5rem" }}>
                    Event Type
                  </label>
                  <div style={{ display: "flex", gap: "1rem" }}>
                    <div
                      onClick={() => setFormData({ ...formData, eventType: "One-time" })}
                      style={{
                        flex: 1,
                        padding: "1rem",
                        border: formData.eventType === "One-time" ? "2px solid var(--dark)" : "1px solid var(--border-color)",
                        borderRadius: "0.5rem",
                        cursor: "pointer",
                        backgroundColor: formData.eventType === "One-time" ? "#f0f9ff" : "white",
                      }}
                    >
                      <div style={{ fontWeight: "600", color: formData.eventType === "One-time" ? "var(--primary)" : "var(--dark)", marginBottom: "0.25rem" }}>One-time</div>
                      <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Single occurrence</div>
                    </div>
                    <div
                      onClick={() => setFormData({ ...formData, eventType: "Recurring" })}
                      style={{
                        flex: 1,
                        padding: "1rem",
                        border: formData.eventType === "Recurring" ? "2px solid var(--dark)" : "1px solid var(--border-color)",
                        borderRadius: "0.5rem",
                        cursor: "pointer",
                        backgroundColor: formData.eventType === "Recurring" ? "#f0f9ff" : "white",
                      }}
                    >
                      <div style={{ fontWeight: "600", color: formData.eventType === "Recurring" ? "var(--primary)" : "var(--dark)", marginBottom: "0.25rem" }}>Recurring</div>
                      <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Multiple sessions</div>
                    </div>
                  </div>
                </div>

                {/* Schedule Details */}
                {formData.eventType === "One-time" ? (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
                    <div className="input-group" style={{ marginBottom: 0 }}>
                      <label style={{ fontSize: "0.75rem", fontWeight: "600", color: "#64748b", textTransform: "uppercase" }}>Date</label>
                      <input type="date" className="form-control" value={formData.scheduleDate} onChange={(e) => setFormData({ ...formData, scheduleDate: e.target.value })} />
                    </div>
                    <div className="input-group" style={{ marginBottom: 0 }}>
                      <label style={{ fontSize: "0.75rem", fontWeight: "600", color: "#64748b", textTransform: "uppercase" }}>Time</label>
                      <input type="time" className="form-control" value={formData.scheduleTime} onChange={(e) => setFormData({ ...formData, scheduleTime: e.target.value })} />
                    </div>
                    <div className="input-group" style={{ marginBottom: 0 }}>
                      <label style={{ fontSize: "0.75rem", fontWeight: "600", color: "#64748b", textTransform: "uppercase" }}>Timezone</label>
                      <select className="form-control" value={formData.scheduleTimezone} onChange={(e) => setFormData({ ...formData, scheduleTimezone: e.target.value })}>
                        {TIMEZONES.map(tz => <option key={tz} value={tz}>{tz}</option>)}
                      </select>
                    </div>
                  </div>
                ) : (
                  <div style={{ border: "1px solid var(--border-color)", borderRadius: "0.5rem", padding: "1.5rem", backgroundColor: "#f8fafc" }}>
                    <h3 style={{ fontSize: "0.95rem", fontWeight: "600", color: "var(--dark)", display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem" }}>
                      <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "var(--primary)" }} />
                      SCHEDULE
                    </h3>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
                      <div className="input-group" style={{ marginBottom: 0 }}>
                        <label style={{ fontSize: "0.75rem", fontWeight: "600", color: "#64748b", textTransform: "uppercase" }}>Frequency</label>
                        <select className="form-control" value={formData.recurringFrequency} onChange={(e) => setFormData({ ...formData, recurringFrequency: e.target.value })}>
                          <option value="Daily">Daily</option>
                          <option value="Weekly">Weekly</option>
                          <option value="Monthly">Monthly</option>
                        </select>
                      </div>

                      <div>
                        {formData.recurringFrequency === "Daily" && (
                          <div style={{ backgroundColor: "#eff6ff", borderRadius: "0.375rem", padding: "1rem", border: "1px solid #bfdbfe" }}>
                            <div style={{ fontSize: "0.75rem", fontWeight: "600", color: "var(--primary)", textTransform: "uppercase", marginBottom: "0.25rem" }}>Daily Schedule</div>
                            <div style={{ fontSize: "0.875rem", color: "var(--primary)" }}>This event will repeat every single day (Mon-Sun).</div>
                          </div>
                        )}
                        {formData.recurringFrequency === "Weekly" && (
                          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                            <label style={{ fontSize: "0.75rem", fontWeight: "600", color: "#64748b", textTransform: "uppercase" }}>Days</label>
                            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                              {DAYS.map(day => (
                                <button
                                  key={day}
                                  onClick={() => {
                                    const newDays = formData.recurringDays.includes(day)
                                      ? formData.recurringDays.filter(d => d !== day)
                                      : [...formData.recurringDays, day];
                                    setFormData({ ...formData, recurringDays: newDays });
                                  }}
                                  style={{
                                    padding: "0.5rem 1rem",
                                    borderRadius: "0.375rem",
                                    border: "none",
                                    fontWeight: "500",
                                    fontSize: "0.875rem",
                                    backgroundColor: formData.recurringDays.includes(day) ? "var(--primary)" : "white",
                                    color: formData.recurringDays.includes(day) ? "white" : "var(--dark)",
                                    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                                    cursor: "pointer"
                                  }}
                                >
                                  {day}
                                </button>
                              ))}
                            </div>
                            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontStyle: "italic" }}>Select applicable days for the weekly session</span>
                          </div>
                        )}
                        {formData.recurringFrequency === "Monthly" && (
                          <div style={{ backgroundColor: "#eff6ff", borderRadius: "0.375rem", padding: "1rem", border: "1px solid #bfdbfe" }}>
                            <div style={{ fontSize: "0.75rem", fontWeight: "600", color: "var(--primary)", textTransform: "uppercase", marginBottom: "0.25rem" }}>Monthly Schedule</div>
                            <div style={{ fontSize: "0.875rem", color: "var(--primary)" }}>Repeats on the specific dates and times selected below.</div>
                          </div>
                        )}
                      </div>
                    </div>

                    {(formData.recurringFrequency === "Daily" || formData.recurringFrequency === "Weekly") && (
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                        <div className="input-group" style={{ marginBottom: 0 }}>
                          <label style={{ fontSize: "0.75rem", fontWeight: "600", color: "#64748b", textTransform: "uppercase" }}>Time</label>
                          <input type="time" className="form-control" value={formData.recurringTime} onChange={(e) => setFormData({ ...formData, recurringTime: e.target.value })} />
                        </div>
                        <div className="input-group" style={{ marginBottom: 0 }}>
                          <label style={{ fontSize: "0.75rem", fontWeight: "600", color: "#64748b", textTransform: "uppercase" }}>Timezone</label>
                          <select className="form-control" value={formData.recurringTimezone} onChange={(e) => setFormData({ ...formData, recurringTimezone: e.target.value })}>
                            {TIMEZONES.map(tz => <option key={tz} value={tz}>{tz}</option>)}
                          </select>
                        </div>
                      </div>
                    )}

                    {formData.recurringFrequency === "Monthly" && (
                      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        {formData.monthlySchedules.map((schedule, index) => (
                          <div key={schedule.id} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: "1rem", alignItems: "end" }}>
                            <div className="input-group" style={{ marginBottom: 0 }}>
                              <label style={{ fontSize: "0.75rem", fontWeight: "600", color: "#64748b", textTransform: "uppercase" }}>Date</label>
                              <input type="date" className="form-control" value={schedule.date} onChange={(e) => {
                                const newSchedules = [...formData.monthlySchedules];
                                newSchedules[index].date = e.target.value;
                                setFormData({ ...formData, monthlySchedules: newSchedules });
                              }} />
                            </div>
                            <div className="input-group" style={{ marginBottom: 0 }}>
                              <label style={{ fontSize: "0.75rem", fontWeight: "600", color: "#64748b", textTransform: "uppercase" }}>Time</label>
                              <input type="time" className="form-control" value={schedule.time} onChange={(e) => {
                                const newSchedules = [...formData.monthlySchedules];
                                newSchedules[index].time = e.target.value;
                                setFormData({ ...formData, monthlySchedules: newSchedules });
                              }} />
                            </div>
                            <div className="input-group" style={{ marginBottom: 0 }}>
                              <label style={{ fontSize: "0.75rem", fontWeight: "600", color: "#64748b", textTransform: "uppercase" }}>Timezone</label>
                              <select className="form-control" value={schedule.timezone} onChange={(e) => {
                                const newSchedules = [...formData.monthlySchedules];
                                newSchedules[index].timezone = e.target.value;
                                setFormData({ ...formData, monthlySchedules: newSchedules });
                              }}>
                                {TIMEZONES.map(tz => <option key={tz} value={tz}>{tz}</option>)}
                              </select>
                            </div>
                            {formData.monthlySchedules.length > 1 && (
                              <button
                                onClick={() => {
                                  const newSchedules = formData.monthlySchedules.filter((_, i) => i !== index);
                                  setFormData({ ...formData, monthlySchedules: newSchedules });
                                }}
                                style={{ padding: "0.5rem", borderRadius: "0.375rem", border: "1px solid var(--danger)", backgroundColor: "white", color: "var(--danger)", cursor: "pointer", height: "38px" }}
                              >
                                <X size={16} />
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          className="btn btn-outline"
                          style={{ alignSelf: "flex-start", marginTop: "0.5rem" }}
                          onClick={() => setFormData({ ...formData, monthlySchedules: [...formData.monthlySchedules, { id: Date.now(), date: "", time: "", timezone: "IST (GMT+5:30)" }] })}
                        >
                          + Add Schedule
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>

        {/* Right Sidebar - Helper info */}
        <div>
          <div className="card" style={{ padding: "1.5rem", backgroundColor: "#f8fafc", border: "1px dashed var(--border-color)" }}>
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginBottom: "1rem", color: "var(--primary)" }}>
              <Info size={18} />
              <h3 style={{ fontSize: "1rem", fontWeight: "600" }}>Tips</h3>
            </div>
            <ul style={{ fontSize: "0.875rem", color: "var(--text-muted)", paddingLeft: "1.2rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <li>Use <strong>Time Based</strong> triggers to engage users days after an event.</li>
              <li>Keep SMS under 160 characters to avoid multi-part messages.</li>
              <li>Always preview email templates on mobile before saving.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreviewModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div className="card" style={{ width: previewMode === "mobile" ? "375px" : "800px", height: "80vh", display: "flex", flexDirection: "column", transition: "width 0.3s ease" }}>
            <div style={{ padding: "1rem", borderBottom: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button className={`btn ${previewMode === "laptop" ? "btn-primary" : "btn-outline"}`} style={{ padding: "0.5rem" }} onClick={() => setPreviewMode("laptop")} title="Laptop View">
                  <Monitor size={18} />
                </button>
                <button className={`btn ${previewMode === "mobile" ? "btn-primary" : "btn-outline"}`} style={{ padding: "0.5rem" }} onClick={() => setPreviewMode("mobile")} title="Mobile View">
                  <Smartphone size={18} />
                </button>
              </div>
              <button className="btn btn-outline" style={{ padding: "0.5rem", border: "none", color: "var(--text-muted)" }} onClick={() => setShowPreviewModal(false)} title="Close Preview">
                <X size={20} />
              </button>
            </div>

            <div style={{ flex: 1, padding: "2rem", backgroundColor: "#f3f4f6", overflowY: "auto", display: "flex", justifyContent: "center" }}>
              <div style={{ backgroundColor: "white", width: "100%", padding: "2rem", border: "1px solid var(--border-color)", borderRadius: "0.5rem", minHeight: "fit-content", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}>
                {formData.emailSubject && (
                  <div style={{ marginBottom: "1.5rem", paddingBottom: "1rem", borderBottom: "1px solid var(--border-color)" }}>
                    <h2 style={{ fontSize: "1.25rem", color: "var(--dark)", margin: 0 }}>Subject: {formData.emailSubject}</h2>
                  </div>
                )}
                <div
                  className="email-preview-content"
                  style={{ overflowWrap: "break-word", wordBreak: "break-word", whiteSpace: "normal" }}
                  dangerouslySetInnerHTML={{ __html: formData.emailContent || "<p style='color: #9ca3af;'>Empty email content...</p>" }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AddNotificationPage() {
  return (
    <Suspense fallback={<div style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)" }}>Loading form...</div>}>
      <AddNotificationContent />
    </Suspense>
  );
}
