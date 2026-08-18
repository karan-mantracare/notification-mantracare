"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Building,
  Box,
  Gift,
  Map,
  BrainCircuit,
  FileText,
  BarChart,
  FolderOpen,
  Bell,
  LogOut,
  Menu,
  Mail,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/" },
  { label: "Email", icon: Mail, href: "/email" },
  { label: "Notifications", icon: Bell, href: "/notifications" },
];

export default function Sidebar({ isOpen, setIsOpen }) {
  const pathname = usePathname();

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-header">
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div
            style={{
              width: "30px",
              height: "30px",
              backgroundColor: "var(--primary)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
            }}
          >
            M
          </div>
          <span>MantraCare</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item, idx) => (
          <Link
            key={idx}
            href={item.href}
            className={`nav-item ${pathname.includes(item.href) && item.href !== "#" ? "active" : ""}`}
            onClick={() => setIsOpen(false)}
          >
            <div className="nav-item-content">
              <item.icon size={20} />
              <span>{item.label}</span>
            </div>
            {/* > Chevron could go here */}
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button
          className="btn btn-primary"
          style={{ width: "100%", padding: "0.75rem", fontWeight: "600" }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
