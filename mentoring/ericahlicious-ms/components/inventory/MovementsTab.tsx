"use client";

import { useState, useEffect } from "react";
import { Search, Loader2 } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface StockMovement {
  id: number;
  type: string;
  change: number;
  before: number;
  after: number;
  reason: string | null;
  inventoryItem: { name: string };
  createdBy: { name: string } | null;
  createdAt: string;
}

export function MovementsTab() {
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchType, setSearchType] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadMovements();
  }, []);

  const loadMovements = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ days: "90" });
      if (searchType) params.append("type", searchType);

      const res = await fetch(`/api/inventory/movements?${params}`);
      if (!res.ok) throw new Error("Failed to load movements");
      const data = await res.json();
      setMovements(data.data || []);
    } catch (err) {
      setError("Failed to load stock movements");
    } finally {
      setLoading(false);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "STOCK_IN":
        return "bg-green-100 text-green-800";
      case "SALES_DEDUCT":
        return "bg-blue-100 text-blue-800";
      case "ADJUSTMENT":
        return "bg-yellow-100 text-yellow-800";
      case "WASTAGE":
        return "bg-red-100 text-red-800";
      case "EXPIRY":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  const getChangeSymbol = (change: number) => {
    if (change > 0) return "+";
    if (change < 0) return "−";
    return "";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100">
          {error}
        </div>
      )}

      {/* Filter */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Movement Type</label>
        <select
          value={searchType}
          onChange={(e) => {
            setSearchType(e.target.value);
          }}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
        >
          <option value="">All Types</option>
          <option value="STOCK_IN">Stock In</option>
          <option value="SALES_DEDUCT">Sales Deduction</option>
          <option value="ADJUSTMENT">Adjustment</option>
          <option value="WASTAGE">Wastage</option>
          <option value="EXPIRY">Expiry</option>
        </select>
      </div>

      {/* Table */}
      {movements.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
          <p className="text-slate-500">No stock movements found</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3 font-medium">Date</th>
                  <th className="px-6 py-3 font-medium">Item</th>
                  <th className="px-6 py-3 font-medium">Type</th>
                  <th className="px-6 py-3 font-medium">Change</th>
                  <th className="px-6 py-3 font-medium">Before</th>
                  <th className="px-6 py-3 font-medium">After</th>
                  <th className="px-6 py-3 font-medium">Reason</th>
                  <th className="px-6 py-3 font-medium">By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {movements.map((movement) => (
                  <tr key={movement.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 text-slate-700">
                      {formatDate(movement.createdAt)}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-800">
                      {movement.inventoryItem.name}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase ${getTypeColor(
                          movement.type
                        )}`}
                      >
                        {movement.type.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold">
                      <span
                        className={
                          movement.change > 0
                            ? "text-green-600"
                            : movement.change < 0
                            ? "text-red-600"
                            : "text-slate-600"
                        }
                      >
                        {getChangeSymbol(movement.change)}{Math.abs(movement.change)}
                      </span>
                    </td>
                    <td className="px-6 py-4">{movement.before}</td>
                    <td className="px-6 py-4 font-semibold">{movement.after}</td>
                    <td className="px-6 py-4 text-slate-500 max-w-xs truncate">
                      {movement.reason || "-"}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {movement.createdBy?.name || "System"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
