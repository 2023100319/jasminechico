"use client";

import { useState, useEffect } from "react";
import { TrendingUp, Loader2 } from "lucide-react";

interface TurnoverItem {
  id: number;
  name: string;
  category: string;
  currentStock: number;
  reorderLevel: number;
  unitCost: number;
  salesCount: number;
  totalSalesQty: number;
  ratio: string;
}

interface TurnoverData {
  period: string;
  topMovers: TurnoverItem[];
}

export function TurnoverWidget() {
  const [data, setData] = useState<TurnoverData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await fetch("/api/analytics/turnover?days=30");
      if (!res.ok) throw new Error("Failed to load");
      const result = await res.json();
      setData(result);
    } catch (err) {
      console.error("Failed to load turnover data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 p-6 flex items-center justify-center h-96">
        <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!data || data.topMovers.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Stock Turnover (Last 30 Days)</h3>
        <p className="text-slate-500">No movement data available</p>
      </div>
    );
  }

  const maxSales = Math.max(...data.topMovers.map((item) => item.salesCount));

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-6">
      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-1">Top Moving Items</h3>
        <p className="text-sm text-slate-500">{data.period}</p>
      </div>

      <div className="space-y-4">
        {data.topMovers.map((item) => (
          <div key={item.id} className="border border-slate-100 rounded-xl p-4 hover:bg-slate-50 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <p className="font-semibold text-slate-900">{item.name}</p>
                <p className="text-xs text-slate-500">{item.category}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-slate-900">{item.salesCount} times</p>
                <p className="text-xs text-slate-500">Qty: {item.totalSalesQty}</p>
              </div>
            </div>

            {/* Sales bar */}
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mb-2">
              <div
                className="h-full bg-blue-500 transition-all"
                style={{ width: `${(item.salesCount / maxSales) * 100}%` }}
              />
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <p className="text-slate-500">Stock</p>
                <p className="font-semibold text-slate-900">{item.currentStock}</p>
              </div>
              <div>
                <p className="text-slate-500">Turnover Ratio</p>
                <p className="font-semibold text-slate-900">{item.ratio}x</p>
              </div>
              <div>
                <p className="text-slate-500">Unit Cost</p>
                <p className="font-semibold text-slate-900">₱{Number(item.unitCost).toFixed(2)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center">
        <p className="text-xs text-slate-500 flex items-center justify-center gap-1">
          <TrendingUp className="w-3 h-3" />
          Showing top {data.topMovers.length} items by sales frequency
        </p>
      </div>
    </div>
  );
}
