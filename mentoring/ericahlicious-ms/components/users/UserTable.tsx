"use client";

import { useState } from "react";
import { Search, Edit2, Archive, ArchiveRestore } from "lucide-react";
import { formatShortDate } from "@/lib/utils";
import type { User } from "@/types";
import { UserRoleBadge } from "./UserRoleBadge";

interface UserTableProps {
  users: User[];
  isArchivedView?: boolean;
  onEdit?: (user: User) => void;
  onArchiveToggle?: (id: number, currentStatus: "ACTIVE" | "ARCHIVED") => void;
  canManageRoles?: boolean; // e.g. Owner can edit Admin, Admin can't edit Admin
}

export function UserTable({
  users,
  isArchivedView = false,
  onEdit,
  onArchiveToggle,
  canManageRoles = false,
}: UserTableProps) {
  const [search, setSearch] = useState("");

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4 bg-slate-50/50">
        <h3 className="font-semibold text-slate-800">
          {isArchivedView ? "Archived Users" : "Active Users"}
        </h3>
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search name or username..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-3 font-medium">Name</th>
              <th className="px-6 py-3 font-medium">Username</th>
              <th className="px-6 py-3 font-medium">Role</th>
              <th className="px-6 py-3 font-medium">Last Active</th>
              <th className="px-6 py-3 font-medium">Joined</th>
              <th className="px-6 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                  No users found.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-800 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </div>
                    {user.name}
                  </td>
                  <td className="px-6 py-4">{user.username}</td>
                  <td className="px-6 py-4">
                    <UserRoleBadge role={user.role} />
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {user.lastActive ? formatShortDate(user.lastActive) : "Never"}
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {formatShortDate(user.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    {canManageRoles && !isArchivedView && (
                      <button
                        onClick={() => onEdit?.(user)}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit User"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    )}
                    {canManageRoles && (
                      <button
                        onClick={() => onArchiveToggle?.(user.id, user.status)}
                        className={`p-2 rounded-lg transition-colors ${
                          user.status === "ARCHIVED"
                            ? "text-green-600 hover:bg-green-50"
                            : "text-slate-400 hover:text-red-500 hover:bg-red-50"
                        }`}
                        title={user.status === "ARCHIVED" ? "Restore User" : "Archive User"}
                      >
                        {user.status === "ARCHIVED" ? (
                          <ArchiveRestore className="w-4 h-4" />
                        ) : (
                          <Archive className="w-4 h-4" />
                        )}
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
