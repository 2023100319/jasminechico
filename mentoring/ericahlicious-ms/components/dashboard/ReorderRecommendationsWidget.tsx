"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, Plus, Loader2 } from "lucide-react";

interface RecommendationItem {
  id: number;
  name: string;
  current: number;
  reorderLevel: number;
  suggested: number;
  category: string;
}

export function ReorderRecommendationsWidget() {
  const [items, setItems] = useState<RecommendationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        const res = await fetch("/api/analytics/inventory-health");
        if (!res.ok) throw new Error("Failed to load");
        const data = await res.json();
        setItems(data.lowStockItems || []);
      } catch {
        console.error("Failed to load recommendations");
      } finally {
        setLoading(false);
      }
    };

    loadRecommendations();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 p-6 flex items-center justify-center h-80">
        <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
      </div>
    );
  }

  const criticalItems = items.filter((item) => item.current === 0);
  const lowItems = items.filter((item) => item.current > 0 && item.current <= item.reorderLevel);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-6">
      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-1">Reorder Recommendations</h3>
        <p className="text-sm text-slate-500">
          {items.length} item{items.length !== 1 ? "s" : ""} need attention
        </p>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-5xl mb-2">✓</div>
          <p className="text-slate-500 font-medium">All inventory levels healthy</p>
        </div>
      ) : (
        <>
          {/* Critical section */}
          {criticalItems.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-red-900">Critical - Out of Stock ({criticalItems.length})</p>
                  <p className="text-xs text-red-700">Order immediately</p>
                </div>
              </div>
              <div className="space-y-2">
                {criticalItems.map((item) => (
                  <div key={item.id} className="bg-white border border-red-200 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-slate-900">{item.name}</p>
                        <p className="text-xs text-slate-500">{item.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-red-700">Suggest: {item.suggested} units</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Low stock section */}
          {lowItems.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <div className="flex gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-yellow-900">Low Stock ({lowItems.length})</p>
                  <p className="text-xs text-yellow-700">Reorder soon</p>
                </div>
              </div>
              <div className="space-y-2">
                {lowItems.slice(0, 5).map((item) => (
                  <div key={item.id} className="bg-white border border-yellow-200 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-slate-900">{item.name}</p>
                        <div className="flex gap-2 mt-1">
                          <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded">
                            Current: {item.current}
                          </span>
                          <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-700 rounded">
                            Min: {item.reorderLevel}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-slate-900">Suggest: {item.suggested}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {lowItems.length > 5 && (
                  <p className="text-xs text-yellow-700 text-center pt-1">
                    +{lowItems.length - 5} more items
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Action summary */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-blue-900">Recommended Purchase Plan</p>
                <p className="text-xs text-blue-700 mt-1">
                  {items.length} item{items.length !== 1 ? "s" : ""} to reorder
                </p>
              </div>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
                <Plus className="w-4 h-4" />
                Create Orders
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
