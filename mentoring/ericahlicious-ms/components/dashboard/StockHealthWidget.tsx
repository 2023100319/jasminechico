"use client";

import { useState, useEffect } from "react";
import { AlertCircle, TrendingDown, Loader2 } from "lucide-react";

interface StockHealthData {
  distribution: {
    GOOD: number;
    LOW: number;
    OUT_OF_STOCK: number;
  };
  lowStockItems: Array<{
    id: number;
    name: string;
    current: number;
    reorderLevel: number;
    suggested: number;
    category: string;
  }>;
  outOfStockItems: Array<{
    id: number;
    name: string;
    category: string;
  }>;
  totalItems: number;
}

export function StockHealthWidget() {
  const [data, setData] = useState<StockHealthData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch("/api/analytics/inventory-health");
        if (!res.ok) throw new Error("Failed to load");
        const result = await res.json();
        setData(result);
      } catch {
        console.error("Failed to load stock health");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 p-6 flex items-center justify-center h-80">
        <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!data) return null;

  const goodPercent = (data.distribution.GOOD / data.totalItems) * 100;
  const lowPercent = (data.distribution.LOW / data.totalItems) * 100;
  const outPercent = (data.distribution.OUT_OF_STOCK / data.totalItems) * 100;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-6">
      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Stock Health Overview</h3>

        {/* Status bars */}
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-slate-600">Good Stock</span>
              <span className="text-sm font-bold text-green-600">{data.distribution.GOOD}</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 transition-all"
                style={{ width: `${goodPercent}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-slate-600">Low Stock</span>
              <span className="text-sm font-bold text-yellow-600">{data.distribution.LOW}</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow-500 transition-all"
                style={{ width: `${lowPercent}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-slate-600">Out of Stock</span>
              <span className="text-sm font-bold text-red-600">{data.distribution.OUT_OF_STOCK}</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-red-500 transition-all"
                style={{ width: `${outPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Critical alerts */}
      {data.outOfStockItems.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-red-800 mb-1">Out of Stock Items</p>
              <div className="space-y-1">
                {data.outOfStockItems.slice(0, 3).map((item) => (
                  <p key={item.id} className="text-xs text-red-700">
                    • {item.name} <span className="text-red-600">({item.category})</span>
                  </p>
                ))}
                {data.outOfStockItems.length > 3 && (
                  <p className="text-xs text-red-600">
                    +{data.outOfStockItems.length - 3} more
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Low stock alerts */}
      {data.lowStockItems.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex gap-3">
            <TrendingDown className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-yellow-800 mb-2">Low Stock Alerts ({data.lowStockItems.length})</p>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {data.lowStockItems.slice(0, 5).map((item) => (
                  <div key={item.id} className="text-xs text-yellow-700 p-2 bg-white rounded border border-yellow-100">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-yellow-600">
                      Current: {item.current} | Suggested reorder: {item.suggested}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
