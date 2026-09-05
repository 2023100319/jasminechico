"use client";

import { PackageX, AlertTriangle, CheckCircle2 } from "lucide-react";
import type { InventoryItem } from "@/types";

interface InventoryStatusProps {
  items: InventoryItem[];
}

export function InventoryStatus({ items }: InventoryStatusProps) {
  const good = items.filter((i) => i.status === "GOOD").length;
  const low = items.filter((i) => i.status === "LOW").length;
  const out = items.filter((i) => i.status === "OUT_OF_STOCK").length;
  const total = items.length;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <h3 className="text-slate-800 font-semibold text-base">Inventory Status</h3>
        <span className="text-xs font-medium text-slate-500 bg-slate-200/50 px-2.5 py-1 rounded-full">
          {total} Total Items
        </span>
      </div>
      <div className="p-5 grid grid-cols-3 divide-x divide-slate-100">
        <div className="flex flex-col items-center justify-center p-2 text-center group">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <PackageX className="w-6 h-6 text-red-500" />
          </div>
          <p className="text-2xl font-bold text-slate-800">{out}</p>
          <p className="text-xs font-medium text-slate-500 mt-1 uppercase tracking-wider">Out of Stock</p>
        </div>

        <div className="flex flex-col items-center justify-center p-2 text-center group">
          <div className="w-12 h-12 rounded-full bg-yellow-50 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <AlertTriangle className="w-6 h-6 text-yellow-500" />
          </div>
          <p className="text-2xl font-bold text-slate-800">{low}</p>
          <p className="text-xs font-medium text-slate-500 mt-1 uppercase tracking-wider">Low Stock</p>
        </div>

        <div className="flex flex-col items-center justify-center p-2 text-center group">
          <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <CheckCircle2 className="w-6 h-6 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-slate-800">{good}</p>
          <p className="text-xs font-medium text-slate-500 mt-1 uppercase tracking-wider">Good</p>
        </div>
      </div>
    </div>
  );
}
