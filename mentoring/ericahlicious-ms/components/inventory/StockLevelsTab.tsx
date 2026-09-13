"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import type { InventoryItem } from "@/types";

interface StockLevelsTabProps {
  items: InventoryItem[];
}

export function StockLevelsTab({ items }: StockLevelsTabProps) {
  const [search, setSearch] = useState("");

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.category.name.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "GOOD":
        return "bg-green-100 text-green-800";
      case "LOW":
        return "bg-yellow-100 text-yellow-800";
      case "OUT_OF_STOCK":
        return "bg-red-100 text-red-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search by item or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-3 font-medium">Item Name</th>
                <th className="px-6 py-3 font-medium">Category</th>
                <th className="px-6 py-3 font-medium">Current Stock</th>
                <th className="px-6 py-3 font-medium">Reorder Level</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Unit Cost</th>
                <th className="px-6 py-3 font-medium">Last Purchase</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                    No items found
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-800">{item.name}</td>
                    <td className="px-6 py-4">{item.category.name}</td>
                    <td className="px-6 py-4 font-semibold text-slate-800">
                      {item.stock}
                    </td>
                    <td className="px-6 py-4">{item.reorderLevel}</td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          "px-2.5 py-1 rounded-md text-[11px] font-bold uppercase",
                          getStatusColor(item.status)
                        )}
                      >
                        {item.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {item.unitCost != null && item.unitCost > 0 ? formatCurrency(Number(item.unitCost)) : "-"}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {item.lastPurchaseDate
                        ? new Date(item.lastPurchaseDate).toLocaleDateString()
                        : "Never"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
