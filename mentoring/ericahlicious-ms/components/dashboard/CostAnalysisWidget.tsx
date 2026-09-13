"use client";

import { useState, useEffect } from "react";
import { DollarSign, Loader2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface CategoryCost {
  category: string;
  totalCost: number;
  itemCount: number;
  purchaseCount: number;
}

interface CostData {
  period: string;
  totalSpending: number;
  byCategory: CategoryCost[];
  topExpensiveItems: Array<{
    name: string;
    totalCost: number;
    quantity: number;
    avgUnitCost: number;
  }>;
}

export function CostAnalysisWidget() {
  const [data, setData] = useState<CostData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch("/api/analytics/costs?days=30");
        if (!res.ok) throw new Error("Failed to load");
        const result = await res.json();
        setData(result);
      } catch {
        console.error("Failed to load cost data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 p-6 flex items-center justify-center h-96">
        <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!data) return null;

  const maxCost = Math.max(...data.byCategory.map((cat) => cat.totalCost));

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-6">
      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-1">Cost Analysis</h3>
        <p className="text-sm text-slate-500">{data.period}</p>
      </div>

      {/* Total spending card */}
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-blue-700 font-medium">Total Spending</p>
            <p className="text-3xl font-bold text-blue-900 mt-1">
              {formatCurrency(data.totalSpending)}
            </p>
          </div>
          <DollarSign className="w-12 h-12 text-blue-200" />
        </div>
      </div>

      {/* By category breakdown */}
      <div>
        <h4 className="text-sm font-bold text-slate-900 mb-3">Spending by Category</h4>
        <div className="space-y-3">
          {data.byCategory.map((category) => (
            <div key={category.category}>
              <div className="flex items-center justify-between mb-1">
                <div>
                  <p className="text-sm font-medium text-slate-700">{category.category}</p>
                  <p className="text-xs text-slate-500">
                    {category.itemCount} items • {category.purchaseCount} purchases
                  </p>
                </div>
                <p className="text-sm font-bold text-slate-900">
                  {formatCurrency(category.totalCost)}
                </p>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all"
                  style={{ width: `${(category.totalCost / maxCost) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top expensive items */}
      {data.topExpensiveItems.length > 0 && (
        <div>
          <h4 className="text-sm font-bold text-slate-900 mb-3">Top Spending Items</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {data.topExpensiveItems.slice(0, 5).map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs p-2 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900">{item.name}</p>
                  <p className="text-slate-500">Qty: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900">{formatCurrency(item.totalCost)}</p>
                  <p className="text-slate-500">@{formatCurrency(item.avgUnitCost)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
