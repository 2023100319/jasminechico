"use client";

import { useState } from "react";
import { formatCurrency, formatShortDate } from "@/lib/utils";
import type { Order, OrderStatus } from "@/types";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { Search, Loader2 } from "lucide-react";

interface OrderTableProps {
  orders: Order[];
  onStatusChange?: (orderId: number, newStatus: OrderStatus) => Promise<void>;
  onMarkPaid?: (orderId: number) => Promise<void>;
}

export function OrderTable({ orders, onStatusChange, onMarkPaid }: OrderTableProps) {
  const [search, setSearch] = useState("");
  const [processingId, setProcessingId] = useState<number | null>(null);

  const filteredOrders = orders.filter(
    (o) =>
      o.orderCode.toLowerCase().includes(search.toLowerCase()) ||
      (o.tableNum && o.tableNum.toLowerCase().includes(search.toLowerCase()))
  );

  const handleAction = async (id: number, action: () => Promise<void>) => {
    setProcessingId(id);
    try {
      await action();
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4 bg-slate-50/50">
        <h3 className="font-semibold text-slate-800">All Orders</h3>
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search Order Code or Table..."
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
              <th className="px-6 py-3 font-medium">Order Code</th>
              <th className="px-6 py-3 font-medium">Table / Type</th>
              <th className="px-6 py-3 font-medium">Items</th>
              <th className="px-6 py-3 font-medium">Total</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Payment</th>
              <th className="px-6 py-3 font-medium">Date</th>
              <th className="px-6 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-slate-400">
                  No orders found.
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-800">{order.orderCode}</td>
                  <td className="px-6 py-4">
                    <span className="text-slate-800 font-medium">{order.tableNum || "N/A"}</span>
                    <p className="text-xs text-slate-400 mt-0.5">{order.type.replace("_", " ")}</p>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500">
                    {order.items.slice(0, 2).map((item) => (
                      <div key={item.id}>
                        {item.quantity}x {item.menuItem.name}
                      </div>
                    ))}
                    {order.items.length > 2 && (
                      <div className="italic text-slate-400">+{order.items.length - 2} more</div>
                    )}
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-800">{formatCurrency(order.total)}</td>
                  <td className="px-6 py-4">
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase inline-flex items-center ${
                        order.isPaid
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {order.isPaid ? "PAID" : "UNPAID"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {formatShortDate(order.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    {processingId === order.id ? (
                      <Loader2 className="w-5 h-5 animate-spin text-blue-500 inline-block" />
                    ) : (
                      <>
                        {order.status === "PENDING" && onStatusChange && (
                          <button
                            onClick={() => handleAction(order.id, () => onStatusChange(order.id, "PREPARING"))}
                            className="px-3 py-1.5 bg-blue-100 text-blue-700 text-xs font-bold rounded-lg hover:bg-blue-200 transition-colors"
                          >
                            Prepare
                          </button>
                        )}
                        {order.status === "PREPARING" && onStatusChange && (
                          <button
                            onClick={() => handleAction(order.id, () => onStatusChange(order.id, "READY"))}
                            className="px-3 py-1.5 bg-green-100 text-green-700 text-xs font-bold rounded-lg hover:bg-green-200 transition-colors"
                          >
                            Ready
                          </button>
                        )}
                        {order.status === "READY" && !order.isPaid && onMarkPaid && (
                          <button
                            onClick={() => handleAction(order.id, () => onMarkPaid(order.id))}
                            className="px-3 py-1.5 bg-slate-800 text-white text-xs font-bold rounded-lg hover:bg-slate-700 transition-colors"
                          >
                            Pay
                          </button>
                        )}
                         {order.status === "READY" && order.isPaid && onStatusChange && (
                          <button
                            onClick={() => handleAction(order.id, () => onStatusChange(order.id, "COMPLETED"))}
                            className="px-3 py-1.5 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg hover:bg-emerald-200 transition-colors"
                          >
                            Complete
                          </button>
                        )}
                      </>
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
