"use client";

import { createContext, useContext, useState } from "react";

const NotificationContext = createContext();

// Mock Initial Data based on the wireframe
const initialNotifications = [
  {
    id: 10045,
    category: "Client",
    description: "Welcome Series 1",
    action: "App Notification",
    service: "Therapy",
    trigger: "Instantly on signup [Therapy]",
    campaignType: "timebased" // Adding field to distinguish
  },
  {
    id: 10046,
    category: "Client",
    description: "Follow up after 2 days",
    action: "Email Notification",
    service: "Therapy",
    trigger: "2 Days post signup [Therapy]",
    campaignType: "timebased"
  },
  {
    id: 10047,
    category: "Provider",
    description: "New policies update",
    action: "App Notification",
    service: "All",
    trigger: "Instantly on order purchase [All]",
    campaignType: "timebased"
  },
  {
    id: 10048,
    category: "Client",
    description: "End of year sale",
    action: "Email Notification",
    service: "All",
    trigger: "Bulk [All Corporates] - One-time: 2026-12-01 at 10:00 IST (GMT+5:30)",
    campaignType: "bulk"
  },
  {
    id: 10049,
    category: "Client",
    description: "Weekly wellness tips",
    action: "SMS Notification",
    service: "Physio, Diet",
    trigger: "Bulk [Physio, Diet | EY, Google] - Recurring (Weekly): Mon at 09:00 IST (GMT+5:30)",
    campaignType: "bulk"
  },
  {
    id: 10050,
    category: "Provider",
    description: "Monthly check-in reminder",
    action: "App Notification",
    service: "All",
    trigger: "Bulk [All Corporates] - Recurring (Monthly): 1 date(s)",
    campaignType: "bulk"
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
