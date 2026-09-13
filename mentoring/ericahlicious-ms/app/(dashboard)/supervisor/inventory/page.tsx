"use client";

import { useState, useEffect, useCallback } from "react";
import { StockLevelsTab } from "@/components/inventory/StockLevelsTab";
import { AddPurchaseForm } from "@/components/inventory/AddPurchaseForm";
import { ReceiveStockTab } from "@/components/inventory/ReceiveStockTab";
import { MovementsTab } from "@/components/inventory/MovementsTab";
import { Plus, RefreshCw, Loader2 } from "lucide-react";
import type { InventoryItem } from "@/types";

type Tab = "levels" | "add" | "receive" | "movements";

export default function SupervisorInventoryPage() {
  const [activeTab, setActiveTab] = useState<Tab>("levels");
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPurchaseForm, setShowPurchaseForm] = useState(false);

  const loadInventory = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/inventory");
      if (!res.ok) throw new Error("Failed to load inventory");
      const data = await res.json();
      setItems(data);
    } catch {
      console.error("Failed to load inventory items");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInventory();
  }, [loadInventory]);

  const handlePurchaseSuccess = () => {
    setShowPurchaseForm(false);
    loadInventory();
  };

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: "levels", label: "Stock Levels", icon: "📊" },
    { id: "add", label: "Add Stock", icon: "📦" },
    { id: "receive", label: "Receive Stock", icon: "✓" },
    { id: "movements", label: "Movements History", icon: "📜" },
  ];

  const lowCount = items.filter((i) => i.status === "LOW").length;
  const outCount = items.filter((i) => i.status === "OUT_OF_STOCK").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Inventory Operations</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage stock, purchases, and track movements</p>
        </div>
        <button
          onClick={loadInventory}
          disabled={loading}
          className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 flex items-center gap-2 transition-all disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          Refresh
        </button>
      </div>

      {/* Alert strip */}
      {(lowCount > 0 || outCount > 0) && (
        <div className="flex gap-3 flex-wrap">
          {outCount > 0 && (
            <div className="flex items-center gap-2 px-4 py-2.5 bg-red-50 border border-red-200 rounded-xl text-sm">
              <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
              <span className="font-semibold text-red-700">{outCount} Out of Stock</span>
              <span className="text-red-500">— Needs immediate reorder</span>
            </div>
          )}
          {lowCount > 0 && (
            <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-50 border border-amber-200 rounded-xl text-sm">
              <span className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0" />
              <span className="font-semibold text-amber-700">{lowCount} Low Stock</span>
              <span className="text-amber-500">— Reorder soon</span>
            </div>
          )}
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-slate-100 p-1 flex gap-2 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? "bg-violet-600 text-white shadow-md"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div>
        {loading && activeTab === "levels" ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 text-violet-600 animate-spin" />
          </div>
        ) : (
          <>
            {activeTab === "levels" && <StockLevelsTab items={items} />}

            {activeTab === "add" && (
              <div className="bg-white rounded-2xl border border-slate-100 p-8">
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-violet-100 flex items-center justify-center mb-4">
                    <Plus className="w-8 h-8 text-violet-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Add Stock</h3>
                  <p className="text-slate-500 mb-6 max-w-sm">
                    Create a purchase order to add stock. The stock will be updated once received.
                  </p>
                  <button
                    onClick={() => setShowPurchaseForm(true)}
                    className="px-6 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-medium flex items-center gap-2 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    Create Purchase Order
                  </button>
                </div>
              </div>
            )}

            {activeTab === "receive" && <ReceiveStockTab />}
            {activeTab === "movements" && <MovementsTab />}
          </>
        )}
      </div>

      {/* Purchase Form Modal */}
      {showPurchaseForm && (
        <AddPurchaseForm
          items={items}
          onClose={() => setShowPurchaseForm(false)}
          onSuccess={handlePurchaseSuccess}
        />
      )}
    </div>
  );
}
