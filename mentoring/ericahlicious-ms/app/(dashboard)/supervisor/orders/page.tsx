"use client";

import { useState, useEffect, useCallback } from "react";
import { OrderTable } from "@/components/orders/OrderTable";
import { RefreshCw, Loader2, ShoppingBag, Clock, CheckCircle, XCircle } from "lucide-react";
import type { Order, OrderStatus } from "@/types";

export default function SupervisorOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== "ALL") params.set("status", statusFilter);
      const res = await fetch(`/api/orders?${params}`);
      if (!res.ok) throw new Error("Failed to load orders");
      const data = await res.json();
      setOrders(data.data || []);
    } catch {
      console.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleStatusChange = async (orderId: number, newStatus: OrderStatus) => {
    await fetch(`/api/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    loadOrders();
  };

  const handleMarkPaid = async (orderId: number) => {
    await fetch(`/api/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPaid: true, status: "COMPLETED" }),
    });
    loadOrders();
  };

  const statuses = [
    { value: "ALL", label: "All", icon: ShoppingBag, color: "text-slate-600" },
    { value: "PENDING", label: "Pending", icon: Clock, color: "text-amber-600" },
    { value: "PREPARING", label: "Preparing", icon: Loader2, color: "text-blue-600" },
    { value: "READY", label: "Ready", icon: CheckCircle, color: "text-green-600" },
    { value: "COMPLETED", label: "Completed", icon: CheckCircle, color: "text-slate-400" },
    { value: "CANCELLED", label: "Cancelled", icon: XCircle, color: "text-red-500" },
  ];

  const counts = {
    ALL: orders.length,
    PENDING: orders.filter((o) => o.status === "PENDING").length,
    PREPARING: orders.filter((o) => o.status === "PREPARING").length,
    READY: orders.filter((o) => o.status === "READY").length,
    COMPLETED: orders.filter((o) => o.status === "COMPLETED").length,
    CANCELLED: orders.filter((o) => o.status === "CANCELLED").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Orders</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage and track all customer orders</p>
        </div>
        <button
          onClick={loadOrders}
          disabled={loading}
          className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 flex items-center gap-2 transition-all disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          Refresh
        </button>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {statuses.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setStatusFilter(value)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
              statusFilter === value
                ? "bg-violet-600 text-white border-violet-600 shadow-sm"
                : "bg-white text-slate-600 border-slate-200 hover:border-violet-300 hover:text-violet-600"
            }`}
          >
            {label}
            <span
              className={`ml-2 px-1.5 py-0.5 rounded-full text-xs font-bold ${
                statusFilter === value ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
              }`}
            >
              {counts[value as keyof typeof counts]}
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center h-64 bg-white rounded-2xl border border-slate-100">
          <Loader2 className="w-8 h-8 text-violet-600 animate-spin" />
        </div>
      ) : (
        <OrderTable
          orders={orders}
          onStatusChange={handleStatusChange}
          onMarkPaid={handleMarkPaid}
        />
      )}
    </div>
  );
}
