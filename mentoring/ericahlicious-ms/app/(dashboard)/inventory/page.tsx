"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, RefreshCw, Loader2 } from "lucide-react";
import { StockLevelsTab } from "@/components/inventory/StockLevelsTab";
import { AddPurchaseForm } from "@/components/inventory/AddPurchaseForm";
import { ReceiveStockTab } from "@/components/inventory/ReceiveStockTab";
import { MovementsTab } from "@/components/inventory/MovementsTab";
import type { InventoryItem } from "@/types";

export default function InventoryOperationsPage() {
  const [activeTab, setActiveTab] = useState<"levels" | "add" | "receive" | "movements">("levels");
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

  const tabs = [
    { id: "levels", label: "Stock Levels", icon: "📊" },
    { id: "add", label: "Add Stock", icon: "📦" },
    { id: "receive", label: "Receive Stock", icon: "✓" },
    { id: "movements", label: "Movements History", icon: "📜" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Inventory Operations</h1>
          <p className="text-sm text-slate-500 mt-1">Manage stock, purchases, and track movements</p>
        </div>
        <button
          onClick={loadInventory}
          disabled={loading}
          className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 flex items-center gap-2 transition-all disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
          Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-slate-100 p-1 flex gap-2 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as Parameters<typeof setActiveTab>[0])}
            className={`px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? "bg-blue-600 text-white shadow-md"
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
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : (
          <>
            {activeTab === "levels" && <StockLevelsTab items={items} />}

            {activeTab === "add" && (
              <div className="bg-white rounded-2xl border border-slate-100 p-8">
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                    <Plus className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Add Stock</h3>
                  <p className="text-slate-500 mb-6 max-w-sm">
                    Create a purchase order to add stock. The stock will be updated when received.
                  </p>
                  <button
                    onClick={() => setShowPurchaseForm(true)}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium flex items-center gap-2 transition-all"
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
