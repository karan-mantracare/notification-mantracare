"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import { NotificationProvider } from "../context/NotificationContext";
import { Menu } from "lucide-react";

export default function LayoutWrapper({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <NotificationProvider>
      <div className="app-layout">
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

        <div className="main-content">
          <header className="top-header">
            <button
              className="mobile-menu-btn"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <Menu size={24} />
            </button>
            <div style={{ marginLeft: "auto", display: "flex", gap: "1rem", alignItems: "center" }}>
              {/* Optional Top Right Content like User Avatar could go here */}
            </div>
          </header>

          <main className="page-content">{children}</main>
        </div>
      </div>
    </NotificationProvider>
  );
}
