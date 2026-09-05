"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  UtensilsCrossed,
  Package,
  BarChart3,
  LogOut,
  ChevronRight,
} from "lucide-react";
import type { Role } from "@/types";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const NAV_ITEMS: Record<Role, NavItem[]> = {
  OWNER: [
    { label: "Dashboard", href: "/owner", icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: "Orders", href: "/owner/orders", icon: <ShoppingBag className="w-5 h-5" /> },
    { label: "Users", href: "/owner/users", icon: <Users className="w-5 h-5" /> },
    { label: "Menu", href: "/owner/menu", icon: <UtensilsCrossed className="w-5 h-5" /> },
    { label: "Inventory", href: "/owner/inventory", icon: <Package className="w-5 h-5" /> },
    { label: "Reports", href: "/owner/reports", icon: <BarChart3 className="w-5 h-5" /> },
  ],
  ADMIN: [
    { label: "Dashboard", href: "/admin", icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: "Users", href: "/admin/users", icon: <Users className="w-5 h-5" /> },
    { label: "Menu", href: "/admin/menu", icon: <UtensilsCrossed className="w-5 h-5" /> },
    { label: "Reports", href: "/admin/reports", icon: <BarChart3 className="w-5 h-5" /> },
  ],
  SUPERVISOR: [
    { label: "Dashboard", href: "/supervisor", icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: "Orders", href: "/supervisor/orders", icon: <ShoppingBag className="w-5 h-5" /> },
    { label: "Users", href: "/supervisor/users", icon: <Users className="w-5 h-5" /> },
    { label: "Menu", href: "/supervisor/menu", icon: <UtensilsCrossed className="w-5 h-5" /> },
    { label: "Inventory", href: "/supervisor/inventory", icon: <Package className="w-5 h-5" /> },
    { label: "Reports", href: "/supervisor/reports", icon: <BarChart3 className="w-5 h-5" /> },
  ],
};

const ROLE_LABELS: Record<Role, string> = {
  OWNER: "Owner",
  ADMIN: "Admin / Management",
  SUPERVISOR: "Supervisor",
};

interface SidebarProps {
  role: Role;
  userName: string;
}

export function Sidebar({ role, userName }: SidebarProps) {
  const pathname = usePathname();
  const navItems = NAV_ITEMS[role] ?? [];

  return (
    <aside className="fixed inset-y-0 left-0 z-50 w-60 bg-[#1C2333] flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-6 border-b border-white/5">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center shadow-lg flex-shrink-0">
          <span className="text-lg font-black text-white">E</span>
        </div>
        <div className="min-w-0">
          <p className="text-white font-bold text-sm leading-tight truncate">ERICAHLICIOUS</p>
          <p className="text-slate-400 text-xs truncate">{ROLE_LABELS[role]} Dashboard</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="text-slate-500 text-[10px] uppercase tracking-widest font-semibold px-3 pb-2">
          Management
        </p>
        {navItems.map((item) => {
          const isActive =
            item.href === `/${role.toLowerCase()}`
              ? pathname === item.href
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group",
                isActive
                  ? "bg-white/10 text-white"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              )}
            >
              <span
                className={cn(
                  "transition-colors",
                  isActive ? "text-white" : "text-slate-500 group-hover:text-slate-300"
                )}
              >
                {item.icon}
              </span>
              <span className="flex-1">{item.label}</span>
              {isActive && <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
            </Link>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className="px-3 pb-4 border-t border-white/5 pt-4">
        <div className="flex items-center gap-3 px-3 py-2 mb-1">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-500 to-slate-700 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
            {userName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)}
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-medium truncate">{userName}</p>
            <p className="text-slate-500 text-xs">{ROLE_LABELS[role]}</p>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-150"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
