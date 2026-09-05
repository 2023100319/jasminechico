"use client";

import { useState } from "react";
import { formatShortDate, cn } from "@/lib/utils";
import type { InventoryItem } from "@/types";
import { STOCK_STATUS_COLORS } from "@/types";
import { Search, Edit2 } from "lucide-react";

interface InventoryTableProps {
  items: InventoryItem[];
  onEdit?: (item: InventoryItem) => void;
}

export function InventoryTable({ items, onEdit }: InventoryTableProps) {
  const [search, setSearch] = useState("");

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
      {/* Header & Search */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4 bg-slate-50/50">
        <h3 className="font-semibold text-slate-800">Inventory Items</h3>
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-3 font-medium">Item Name</th>
              <th className="px-6 py-3 font-medium">Category</th>
              <th className="px-6 py-3 font-medium">Stock</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Expiry / Supplier</th>
              <th className="px-6 py-3 font-medium">Last Updated</th>
              <th className="px-6 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                  No inventory items found.
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-800">{item.name}</td>
                  <td className="px-6 py-4">{item.category.name}</td>
                  <td className="px-6 py-4 font-medium">{item.stock}</td>
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        "px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase",
                        STOCK_STATUS_COLORS[item.status]
                      )}
                    >
                      {item.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {item.expiry ? (
                      <span className="text-slate-700">{formatShortDate(item.expiry)}</span>
                    ) : (
                      <span className="text-slate-400 italic">No expiry</span>
                    )}
                    {item.supplier && (
                      <p className="text-xs text-slate-400 mt-0.5">{item.supplier}</p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-slate-700">{formatShortDate(item.updatedAt)}</span>
                    {item.updatedBy && (
                      <p className="text-xs text-slate-400 mt-0.5">by {item.updatedBy.name}</p>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => onEdit?.(item)}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Update Stock"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
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
