"use client";

import { useState, useEffect, useCallback } from "react";
import { AddUserForm } from "@/components/users/AddUserForm";
import { Plus, Search, Loader2, RefreshCw, Shield, ChevronDown } from "lucide-react";
import type { User } from "@/types";

export default function SupervisorUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [actionMenuId, setActionMenuId] = useState<number | null>(null);

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/users?status=ACTIVE");
      if (!res.ok) throw new Error("Failed to load users");
      const data = await res.json();
      setUsers(data);
    } catch {
      console.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.username.toLowerCase().includes(search.toLowerCase())
  );

  const roleColors: Record<string, string> = {
    OWNER: "bg-amber-100 text-amber-800",
    ADMIN: "bg-purple-100 text-purple-800",
    SUPERVISOR: "bg-violet-100 text-violet-800",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
          <p className="text-sm text-slate-500 mt-0.5">View and manage active staff accounts</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl flex items-center gap-2 font-medium transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add User
        </button>
      </div>

      {/* Search + Refresh */}
      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or username..."
            className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-white transition-all"
          />
        </div>
        <button
          onClick={loadUsers}
          disabled={loading}
          className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 flex items-center gap-2 transition-all disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          Refresh
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center h-64 bg-white rounded-2xl border border-slate-100">
          <Loader2 className="w-8 h-8 text-violet-600 animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="px-6 py-3 font-medium">Username</th>
                <th className="px-6 py-3 font-medium">Role</th>
                <th className="px-6 py-3 font-medium">Last Active</th>
                <th className="px-6 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    <Shield className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p>No users found</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-violet-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                          {user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                        </div>
                        <span className="font-medium text-slate-900">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500">@{user.username}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${roleColors[user.role] || "bg-slate-100 text-slate-700"}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-xs">
                      {user.lastActive ? new Date(user.lastActive).toLocaleDateString("en-PH") : "Never"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative">
                        <button
                          onClick={() => setActionMenuId(actionMenuId === user.id ? null : user.id)}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-all"
                        >
                          Actions <ChevronDown className="w-3 h-3" />
                        </button>
                        {actionMenuId === user.id && (
                          <div className="absolute right-0 top-8 z-10 bg-white border border-slate-100 rounded-xl shadow-lg py-1 min-w-[130px]">
                            <button
                              onClick={() => { setEditingUser(user); setActionMenuId(null); }}
                              className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                            >
                              Edit
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {filteredUsers.length > 0 && (
            <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 text-xs text-slate-500">
              {filteredUsers.length} active user{filteredUsers.length !== 1 ? "s" : ""}
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Form */}
      {(showAddForm || editingUser) && (
        <AddUserForm
          onClose={() => { setShowAddForm(false); setEditingUser(null); }}
          onSuccess={() => { setShowAddForm(false); setEditingUser(null); loadUsers(); }}
          initialData={editingUser ?? undefined}
        />
      )}
    </div>
  );
}
