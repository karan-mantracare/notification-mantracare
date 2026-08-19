"use client";

import { createContext, useContext, useState } from "react";

const NotificationContext = createContext();

const initialNotifications = [
  {
    id: 10045,
    userType: "Client",
    name: "Welcome Series 1",
    description: "Welcome Series 1",
    type: "App",
    appNotificationType: "App Screen",
    actionScreen: "Home",
    action: "Open App> Home",
    emailProvider: "Sendgrid",
    senderEmail: "donotreply@mantra.care",
    emailSubject: "",
    emailContent: "",
    smsContent: "",
    service: "Therapy",
    orderPurchased: "Yes",
    trigger: "signup success",
    displayTrigger: "Instantly on signup success [Therapy]",
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
    visibleToAll: true,
    selectedServices: ["Therapy"],
    selectedCorporates: [],
    appTextContent: "Welcome to Mantra Care!",
    campaignType: "timebased",
    category: "Client",
  },
  {
    id: 10046,
    userType: "Client",
    name: "Follow up after 2 days",
    description: "Follow up after 2 days",
    type: "Email",
    appNotificationType: "App Screen",
    actionScreen: "Home",
    action: "Email Notification",
    emailProvider: "Sendgrid",
    senderEmail: "donotreply@mantra.care",
    emailSubject: "Checking in on your progress!",
    emailContent: "<p>Hi {{client_name}}, it's been 2 days. How are you doing?</p>",
    smsContent: "",
    service: "Therapy",
    orderPurchased: "Yes",
    trigger: "signup success",
    displayTrigger: "2 Days post signup success [Therapy]",
    timing: "2 Days",
    eventType: "One-time",
    scheduleDate: "",
    scheduleTime: "",
    scheduleTimezone: "IST (GMT+5:30)",
    recurringFrequency: "Weekly",
    recurringDays: [],
    recurringTime: "",
    recurringTimezone: "IST (GMT+5:30)",
    monthlySchedules: [{ id: 1, date: "", time: "", timezone: "IST (GMT+5:30)" }],
    visibleToAll: true,
    selectedServices: ["Therapy"],
    selectedCorporates: [],
    appTextContent: "",
    campaignType: "timebased",
    category: "Client",
  },
  {
    id: 10048,
    userType: "Client",
    name: "End of year sale",
    description: "End of year sale",
    type: "SMS",
    appNotificationType: "App Screen",
    actionScreen: "Home",
    action: "SMS Notification",
    emailProvider: "Sendgrid",
    senderEmail: "donotreply@mantra.care",
    emailSubject: "",
    emailContent: "",
    smsContent: "Get 50% off all sessions this week! Use code YEAR50.",
    service: "All",
    orderPurchased: "Yes",
    trigger: "thankyou page", // unused for bulk
    displayTrigger: "Bulk [All Corporates] - One-time: 2026-12-01 at 10:00 IST (GMT+5:30)",
    timing: "Instantly",
    eventType: "One-time",
    scheduleDate: "2026-12-01",
    scheduleTime: "10:00",
    scheduleTimezone: "IST (GMT+5:30)",
    recurringFrequency: "Weekly",
    recurringDays: [],
    recurringTime: "",
    recurringTimezone: "IST (GMT+5:30)",
    monthlySchedules: [{ id: 1, date: "", time: "", timezone: "IST (GMT+5:30)" }],
    visibleToAll: true,
    selectedServices: [],
    selectedCorporates: [],
    appTextContent: "",
    campaignType: "bulk",
    category: "Client",
  }
];

const initialTriggers = [
  {
    id: 1,
    name: "thankyou page",
    eventType: "Page View",
    filterField: "Page URL",
    filterCondition: "contains thanks",
    tags: 1,
    lastEdited: "3 years ago"
  },
  {
    id: 2,
    name: "order completed",
    eventType: "Purchase",
    filterField: "Order Status",
    filterCondition: "equals complete",
    tags: 2,
    lastEdited: "1 year ago"
  },
  {
    id: 3,
    name: "signup success",
    eventType: "Sign Up",
    filterField: "Account Source",
    filterCondition: "any",
    tags: 0,
    lastEdited: "2 months ago"
  }
];

const initialLogs = [
  {
    id: 10045,
    campaignType: "timebased",
    sentCount: 1542,
    deliveries: [
      { userId: "USR-001", timestamp: "2026-08-18 10:30:00" },
      { userId: "USR-089", timestamp: "2026-08-18 11:15:00" }
    ]
  },
  {
    id: 10048,
    campaignType: "bulk",
    sentCount: 8900,
    deliveries: [
      { userId: "USR-402", timestamp: "2026-08-17 09:00:00" },
      { userId: "USR-511", timestamp: "2026-08-17 09:00:05" }
    ]
  }
];

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [logs, setLogs] = useState(initialLogs);
  const [triggers, setTriggers] = useState(initialTriggers);

  const addNotification = (newNotification) => {
    setNotifications((prev) => {
      const maxId = prev.length > 0 ? Math.max(...prev.map(n => n.id)) : 10044;
      return [
        ...prev,
        {
          id: maxId + 1,
          ...newNotification,
        },
      ];
    });
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const updateNotification = (id, updatedNotification) => {
    setNotifications((prev) => 
      prev.map(n => n.id === id ? { ...n, ...updatedNotification } : n)
    );
  };

  const addTrigger = (newTrigger) => {
    setTriggers((prev) => {
      const maxId = prev.length > 0 ? Math.max(...prev.map(t => t.id)) : 0;
      return [
        ...prev,
        {
          id: maxId + 1,
          ...newTrigger,
        },
      ];
    });
  };

  const deleteTrigger = (id) => {
    setTriggers((prev) => prev.filter((t) => t.id !== id));
  };

  const updateTrigger = (id, updatedTrigger) => {
    setTriggers((prev) => 
      prev.map(t => t.id === id ? { ...t, ...updatedTrigger } : t)
    );
  };

  return (
    <NotificationContext.Provider
      value={{ 
        notifications, logs, triggers, 
        addNotification, deleteNotification, updateNotification,
        addTrigger, deleteTrigger, updateTrigger
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
