"use client";

import { createContext, useContext, useState, useEffect } from "react";

const NotificationContext = createContext();

const MOCK_DATA = {
  MantraCare: {
    templates: {
      "Signup": { subject: "Welcome to MantraCare!", email: "<h1>Welcome to MantraCare!</h1><p>Hi {{client_name}},</p><p>We are thrilled to have you on board. Explore our app to get started.</p>", text: "Welcome to MantraCare, {{client_name}}! We are thrilled to have you on board. Explore our app to get started." },
      "Meeting Scheduled": { subject: "Your Meeting is Scheduled", email: "<h1>Meeting Scheduled</h1><p>Hi {{client_name}},</p><p>Your meeting with {{provider_name}} is scheduled for {{session_date}} at {{session_time}}.</p>", text: "Hi {{client_name}}, your meeting with {{provider_name}} is scheduled for {{session_date}} at {{session_time}}." },
      "Profile Edited": { subject: "Profile Updated", email: "<h1>Profile Updated</h1><p>Hi {{client_name}},</p><p>Your profile has been successfully updated.</p>", text: "Hi {{client_name}}, your profile has been successfully updated." },
    },
    triggers: [
      { id: 1, name: "thankyou page", eventType: "Page View", filterField: "Page URL", filterCondition: "contains thanks", tags: 1, lastEdited: "3 years ago" },
      { id: 2, name: "order completed", eventType: "Purchase", filterField: "Order Status", filterCondition: "equals complete", tags: 2, lastEdited: "1 year ago" },
      { id: 3, name: "signup success", eventType: "Sign Up", filterField: "Account Source", filterCondition: "any", tags: 0, lastEdited: "2 months ago" }
    ],
    notifications: [
      { id: 10045, userType: "Client", name: "Welcome Series 1", description: "Welcome Series 1", type: "App", appNotificationType: "App Screen", actionScreen: "Home", action: "Open App> Home", emailProvider: "Sendgrid", senderEmail: "donotreply@mantra.care", emailSubject: "", emailContent: "", smsContent: "", service: "Therapy", orderPurchased: "Yes", trigger: "signup success", displayTrigger: "Instantly on signup success [Therapy]", timing: "Instantly", eventType: "One-time", scheduleDate: "", scheduleTime: "", scheduleTimezone: "IST (GMT+5:30)", recurringFrequency: "Weekly", recurringDays: [], recurringTime: "", recurringTimezone: "IST (GMT+5:30)", monthlySchedules: [{ id: 1, date: "", time: "", timezone: "IST (GMT+5:30)" }], visibleToAll: true, selectedServices: ["Therapy"], selectedCorporates: [], appTextContent: "Welcome to Mantra Care!", campaignType: "timebased", category: "Client" },
      { id: 10046, userType: "Client", name: "Follow up after 2 days", description: "Follow up after 2 days", type: "Email", appNotificationType: "App Screen", actionScreen: "Home", action: "Email Notification", emailProvider: "Sendgrid", senderEmail: "donotreply@mantra.care", emailSubject: "Checking in on your progress!", emailContent: "<p>Hi {{client_name}}, it's been 2 days. How are you doing?</p>", smsContent: "", service: "Therapy", orderPurchased: "Yes", trigger: "signup success", displayTrigger: "2 Days post signup success [Therapy]", timing: "2 Days", eventType: "One-time", scheduleDate: "", scheduleTime: "", scheduleTimezone: "IST (GMT+5:30)", recurringFrequency: "Weekly", recurringDays: [], recurringTime: "", recurringTimezone: "IST (GMT+5:30)", monthlySchedules: [{ id: 1, date: "", time: "", timezone: "IST (GMT+5:30)" }], visibleToAll: true, selectedServices: ["Therapy"], selectedCorporates: [], appTextContent: "", campaignType: "timebased", category: "Client" },
    ],
    logs: [
      { id: 1, notificationId: 10045, sentTo: "USR-001 / Device-X", serviceType: "Email", event: "Sent", timestamp: "2026-08-18 10:30:00", error: "", templateId: "TPL-892" },
      { id: 2, notificationId: 10045, sentTo: "USR-001 / Device-X", serviceType: "Email", event: "Viewed", timestamp: "2026-08-18 10:45:00", error: "", templateId: "TPL-892" },
      { id: 3, notificationId: 10046, sentTo: "+91 9876543210", serviceType: "SMS", event: "Failed", timestamp: "2026-08-17 09:00:00", error: "Carrier rejected", templateId: "TPL-893" },
      { id: 4, notificationId: 10046, sentTo: "+91 9876543211", serviceType: "SMS", event: "Received", timestamp: "2026-08-17 09:00:05", error: "", templateId: "TPL-893" },
      { id: 5, notificationId: 10046, sentTo: "+1 415-555-1234", serviceType: "SMS", event: "Skipped", timestamp: "2026-08-22 16:30:00", reason: "Country not Added in provider", templateId: "TPL-893" },
    ],
    emailSettings: {
      providers: [{ id: 1, connectionName: "MantraCare Sendgrid", provider: "Sendgrid", details: { authToken: "sg.mantracare" } }],
      emailIds: [
        { id: 1, email: "clients@mantra.care", providerId: 1, priority: "High" },
        { id: 2, email: "provider@mantra.care", providerId: 1, priority: "Normal" }
      ]
    },
    smsSettings: {
      providers: [{ id: 1, connectionName: "Mantra Twilio", provider: "Twilio", details: { accountSid: "AC...", authToken: "..." } }],
      numbers: [
        { id: 1, number: "+91 9999999999", providerId: 1, priority: "High" }
      ],
      senderIds: [
        { id: 1, route: "Transactional", senderId: "MANTRA", peId: "1234567890" }
      ]
    }
  },
  MantraAssist: {
    templates: {
      "User Signup": { subject: "Welcome to MantraAssist!", email: "<h1>Welcome!</h1><p>Hi {{client_name}},</p><p>Thanks for signing up for our AI Receptionist service.</p>", text: "Hi {{client_name}}, welcome to MantraAssist! Your AI Receptionist is ready." },
      "Number Added": { subject: "Virtual Number Configured", email: "<h1>Number Added</h1><p>Your new virtual number {{number}} is now active.</p>", text: "Your new virtual number {{number}} is now active on MantraAssist." },
      "Credits Topped Up": { subject: "Credits Added Successfully", email: "<h1>Payment Received</h1><p>Your account has been credited with {{credits}}.</p>", text: "Success! {{credits}} credits have been added to your MantraAssist account." },
      "Low Credits Reminder": { subject: "Action Required: Low Credits", email: "<h1>Low Credits Warning</h1><p>You have less than {{credits}} credits remaining. Top up to avoid service interruption.</p>", text: "Warning: Your MantraAssist credits are running low. Please top up soon." },
      "New Team Added": { subject: "Team Member Added", email: "<h1>Team Updated</h1><p>{{member_name}} has been added to your workspace.</p>", text: "{{member_name}} has been added to your workspace." },
    },
    triggers: [
      { id: 4, name: "account created", eventType: "Sign Up", filterField: "Plan", filterCondition: "equals Pro", tags: 1, lastEdited: "1 week ago" },
      { id: 5, name: "low credits", eventType: "Billing", filterField: "Credits", filterCondition: "less than 100", tags: 2, lastEdited: "3 days ago" },
      { id: 6, name: "number added", eventType: "Configuration", filterField: "Status", filterCondition: "equals Active", tags: 0, lastEdited: "2 months ago" }
    ],
    notifications: [
      { id: 2001, userType: "Client", name: "Low Credits Warning", description: "Triggered when credits < 100", type: "Email", appNotificationType: "", actionScreen: "", action: "Email Notification", emailProvider: "Sendgrid", senderEmail: "support@mantraassist.com", emailSubject: "Low Credits", emailContent: "<p>Please recharge your account.</p>", smsContent: "", service: "AI Receptionist", orderPurchased: "Yes", trigger: "low credits", displayTrigger: "Instantly on low credits", timing: "Instantly", eventType: "One-time", scheduleDate: "", scheduleTime: "", scheduleTimezone: "IST (GMT+5:30)", recurringFrequency: "", recurringDays: [], recurringTime: "", recurringTimezone: "", monthlySchedules: [], visibleToAll: true, selectedServices: [], selectedCorporates: [], appTextContent: "", campaignType: "automated", category: "Billing" },
    ],
    logs: [
      { id: 5, notificationId: 2001, sentTo: "MA-112 / Web", serviceType: "App Notification", event: "Sent", timestamp: "2026-08-20 14:20:00", error: "", templateId: "TPL-304" },
      { id: 6, notificationId: 2001, sentTo: "MA-112 / Web", serviceType: "App Notification", event: "Viewed", timestamp: "2026-08-20 15:00:00", error: "", templateId: "TPL-304" },
      { id: 7, notificationId: 2001, sentTo: "+1 415-555-2671", serviceType: "SMS", event: "Skipped", timestamp: "2026-08-22 16:30:00", reason: "Country not Added in provider", templateId: "TPL-305" },
    ],
    emailSettings: {
      providers: [{ id: 1, connectionName: "MantraAssist SES", provider: "SES", details: { clientId: "AKIAIOSFODNN7EXAMPLE", secretKey: "wJalrXU" } }],
      emailIds: [
        { id: 1, email: "contact@mantraassist.com", providerId: 1, priority: "High" }
      ]
    },
    smsSettings: {
      providers: [{ id: 1, connectionName: "MSG91 Main", provider: "MSG91", details: { authToken: "..." } }],
      numbers: [
        { id: 1, number: "+91 8888888888", providerId: 1, priority: "High" }
      ],
      senderIds: []
    }
  },
  EyeMantra: {
    templates: {
      "Appointment Booked": { subject: "Appointment Confirmed", email: "<h1>Booking Confirmed</h1><p>Hi {{client_name}}, your appointment at EyeMantra Hospital PaschimVihar is confirmed.</p>", text: "Hi {{client_name}}, your appointment at EyeMantra Hospital PaschimVihar is confirmed." },
      "Surgery Payment Received": { subject: "Payment Receipt", email: "<h1>Payment Successful</h1><p>We have received your payment for the eye surgery.</p>", text: "We have received your payment for the eye surgery at EyeMantra." },
      "Arrival at Hospital": { subject: "Welcome to EyeMantra", email: "<h1>Welcome</h1><p>Please proceed to the reception for your checkup.</p>", text: "Welcome to EyeMantra! Please proceed to the reception." },
      "Surgery Completed": { subject: "Post-Surgery Instructions", email: "<h1>Surgery Successful</h1><p>Here are your post-surgery care instructions...</p>", text: "Your surgery was successful! Please check your email for care instructions." },
      "Post-Surgery Checkup": { subject: "Checkup Reminder", email: "<h1>Reminder</h1><p>Your post-surgery checkup is scheduled for tomorrow.</p>", text: "Reminder: Your post-surgery checkup is scheduled for tomorrow at EyeMantra." },
      "Feedback Request": { subject: "How was your experience?", email: "<h1>Feedback</h1><p>Please rate your surgery experience.</p>", text: "Please rate your experience at EyeMantra Hospital." },
    },
    triggers: [
      { id: 7, name: "appointment booked", eventType: "Booking", filterField: "Location", filterCondition: "equals PaschimVihar", tags: 3, lastEdited: "5 hours ago" },
      { id: 8, name: "surgery completed", eventType: "Medical", filterField: "Procedure", filterCondition: "any", tags: 1, lastEdited: "1 day ago" },
      { id: 9, name: "payment received", eventType: "Billing", filterField: "Amount", filterCondition: "greater than 0", tags: 0, lastEdited: "1 month ago" }
    ],
    notifications: [
      { id: 3001, userType: "Patient", name: "Pre-surgery instructions", description: "Sent 2 days before surgery", type: "SMS", appNotificationType: "", actionScreen: "", action: "SMS Notification", emailProvider: "", senderEmail: "", emailSubject: "", emailContent: "", smsContent: "Please remember to fast for 12 hours before your eye surgery.", service: "Cataract Surgery", orderPurchased: "Yes", trigger: "appointment booked", displayTrigger: "2 Days before surgery", timing: "Scheduled", eventType: "One-time", scheduleDate: "", scheduleTime: "", scheduleTimezone: "IST (GMT+5:30)", recurringFrequency: "", recurringDays: [], recurringTime: "", recurringTimezone: "", monthlySchedules: [], visibleToAll: true, selectedServices: [], selectedCorporates: [], appTextContent: "", campaignType: "automated", category: "Patient" },
    ],
    logs: [
      { id: 7, notificationId: 3001, sentTo: "PT-998 / iOS", serviceType: "SMS", event: "Received", timestamp: "2026-08-21 08:00:00", error: "", templateId: "TPL-901" },
      { id: 8, notificationId: 3001, sentTo: "PT-999 / Android", serviceType: "SMS", event: "Failed", timestamp: "2026-08-21 08:05:00", error: "Number unreachable", templateId: "TPL-901" },
    ],
    emailSettings: {
      providers: [{ id: 1, connectionName: "EyeMantra Brevo", provider: "Brevo", details: { apiKey: "xkeysib-eyemantra" } }],
      emailIds: [
        { id: 1, email: "appointment@eyemantra.in", providerId: 1, priority: "High" },
        { id: 2, email: "clients@eyemantra.in", providerId: 1, priority: "Normal" }
      ]
    },
    smsSettings: {
      providers: [{ id: 1, connectionName: "BulkSMSGateway Default", provider: "BulkSMSGateway", details: { userName: "...", password: "..." } }],
      numbers: [
        { id: 1, number: "+91 7777777777", providerId: 1, priority: "High" }
      ],
      senderIds: []
    }
  }
};

export function NotificationProvider({ children }) {
  const [selectedCompany, setSelectedCompany] = useState("MantraCare");
  
  const [allData, setAllData] = useState(MOCK_DATA);

  // Derived state for the active company
  const activeData = allData[selectedCompany];
  const templates = activeData.templates;
  const triggers = activeData.triggers;
  const notifications = activeData.notifications;
  const logs = activeData.logs;
  const emailSettings = activeData.emailSettings;
  const smsSettings = activeData.smsSettings;

  const addNotification = (newNotification) => {
    setAllData(prev => {
      const companyData = prev[selectedCompany];
      const maxId = companyData.notifications.length > 0 ? Math.max(...companyData.notifications.map(n => n.id)) : 10000;
      return {
        ...prev,
        [selectedCompany]: {
          ...companyData,
          notifications: [...companyData.notifications, { id: maxId + 1, ...newNotification }]
        }
      };
    });
  };

  const deleteNotification = (id) => {
    setAllData(prev => {
      const companyData = prev[selectedCompany];
      return {
        ...prev,
        [selectedCompany]: {
          ...companyData,
          notifications: companyData.notifications.filter(n => n.id !== id)
        }
      };
    });
  };

  const updateNotification = (id, updatedNotification) => {
    setAllData(prev => {
      const companyData = prev[selectedCompany];
      return {
        ...prev,
        [selectedCompany]: {
          ...companyData,
          notifications: companyData.notifications.map(n => n.id === id ? { ...n, ...updatedNotification } : n)
        }
      };
    });
  };

  const addTrigger = (newTrigger) => {
    setAllData(prev => {
      const companyData = prev[selectedCompany];
      const maxId = companyData.triggers.length > 0 ? Math.max(...companyData.triggers.map(t => t.id)) : 0;
      return {
        ...prev,
        [selectedCompany]: {
          ...companyData,
          triggers: [...companyData.triggers, { id: maxId + 1, ...newTrigger }]
        }
      };
    });
  };

  const deleteTrigger = (id) => {
    setAllData(prev => {
      const companyData = prev[selectedCompany];
      return {
        ...prev,
        [selectedCompany]: {
          ...companyData,
          triggers: companyData.triggers.filter(t => t.id !== id)
        }
      };
    });
  };

  const updateTrigger = (id, updatedTrigger) => {
    setAllData(prev => {
      const companyData = prev[selectedCompany];
      return {
        ...prev,
        [selectedCompany]: {
          ...companyData,
          triggers: companyData.triggers.map(t => t.id === id ? { ...t, ...updatedTrigger } : t)
        }
      };
    });
  };

  const updateEmailSettings = (newEmailSettings) => {
    setAllData(prev => ({
      ...prev,
      [selectedCompany]: {
        ...prev[selectedCompany],
        emailSettings: newEmailSettings
      }
    }));
  };

  const updateSmsSettings = (newSmsSettings) => {
    setAllData(prev => ({
      ...prev,
      [selectedCompany]: {
        ...prev[selectedCompany],
        smsSettings: newSmsSettings
      }
    }));
  };

  const addTemplate = (templateName, templateData) => {
    setAllData(prev => {
      const companyData = prev[selectedCompany];
      return {
        ...prev,
        [selectedCompany]: {
          ...companyData,
          templates: {
            ...companyData.templates,
            [templateName]: templateData
          }
        }
      };
    });
  };

  const updateTemplate = (oldName, newName, templateData) => {
    setAllData(prev => {
      const companyData = prev[selectedCompany];
      const newTemplates = { ...companyData.templates };
      if (oldName !== newName) {
        delete newTemplates[oldName];
      }
      newTemplates[newName] = templateData;
      return {
        ...prev,
        [selectedCompany]: {
          ...companyData,
          templates: newTemplates
        }
      };
    });
  };

  const deleteTemplate = (templateName) => {
    setAllData(prev => {
      const companyData = prev[selectedCompany];
      const newTemplates = { ...companyData.templates };
      delete newTemplates[templateName];
      return {
        ...prev,
        [selectedCompany]: {
          ...companyData,
          templates: newTemplates
        }
      };
    });
  };

  return (
    <NotificationContext.Provider
      value={{ 
        selectedCompany, setSelectedCompany,
        templates, notifications, logs, triggers, emailSettings, smsSettings,
        addNotification, deleteNotification, updateNotification,
        addTrigger, deleteTrigger, updateTrigger,
        updateEmailSettings, updateSmsSettings,
        addTemplate, updateTemplate, deleteTemplate
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};
