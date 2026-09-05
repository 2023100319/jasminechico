import Link from "next/link";
import { ChefHat, Users, BarChart3 } from "lucide-react";

const roles = [
  {
    id: "owner",
    label: "Owner",
    description: "Full system access",
    icon: <BarChart3 className="w-8 h-8" />,
    color: "from-yellow-500 to-amber-600",
    shadow: "shadow-yellow-500/30",
    href: "/login/owner",
  },
  {
    id: "admin",
    label: "Admin / Management",
    description: "Users, Menu & Reports",
    icon: <Users className="w-8 h-8" />,
    color: "from-purple-500 to-violet-600",
    shadow: "shadow-purple-500/30",
    href: "/login/admin",
  },
  {
    id: "supervisor",
    label: "Supervisor",
    description: "Orders, Inventory & Staff",
    icon: <ChefHat className="w-8 h-8" />,
    color: "from-blue-500 to-cyan-600",
    shadow: "shadow-blue-500/30",
    href: "/login/supervisor",
  },
];

export default function RoleSelectionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo + Title */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 mb-4 shadow-2xl shadow-yellow-500/40">
            <span className="text-3xl font-black text-white">E</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            ERICAHLICIOUS
          </h1>
          <p className="text-slate-400 text-sm mt-1">Management System</p>
          <p className="text-slate-500 text-xs mt-3 font-medium uppercase tracking-widest">
            Select your role
          </p>
        </div>

        {/* Role Cards */}
        <div className="space-y-3">
          {roles.map((role) => (
            <Link
              key={role.id}
              href={role.href}
              className="group flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-200 cursor-pointer"
            >
              <div
                className={`flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br ${role.color} flex items-center justify-center text-white shadow-lg ${role.shadow} group-hover:scale-105 transition-transform duration-200`}
              >
                {role.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-base">{role.label}</p>
                <p className="text-slate-400 text-sm">{role.description}</p>
              </div>
              <svg
                className="w-5 h-5 text-slate-500 group-hover:text-slate-300 group-hover:translate-x-1 transition-all duration-200"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>

        <p className="text-center text-slate-600 text-xs mt-8">
          ERICAHLICIOUS Food Inc. © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
