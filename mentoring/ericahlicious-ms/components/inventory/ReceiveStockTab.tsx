"use client";

import { useState, useEffect } from "react";
import { Loader2, Check } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface PurchaseOrder {
  id: number;
  inventoryItem: { id: number; name: string };
  quantity: number;
  unitCost: number;
  supplier: string | null;
  status: string;
  expectedDate: string | null;
  createdAt: string;
}

export function ReceiveStockTab() {
  const [purchases, setPurchases] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [receiving, setReceiving] = useState<number | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPurchases = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/inventory/purchases?status=PENDING");
        if (!res.ok) throw new Error("Failed to load purchases");
        const data = await res.json();
        setPurchases(data.data || []);
      } catch {
        setError("Failed to load pending purchases");
      } finally {
        setLoading(false);
      }
    };

    loadPurchases();
  }, []);

  const handleReceive = async (purchaseId: number) => {
    try {
      setReceiving(purchaseId);
      setError("");

      const res = await fetch(`/api/inventory/purchases/${purchaseId}/receive`, {
        method: "PATCH",
      });

      if (!res.ok) throw new Error("Failed to receive stock");

      setPurchases((prev) => prev.filter((p) => p.id !== purchaseId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setReceiving(null);
    }
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

      {purchases.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
          <p className="text-slate-500">No pending purchase orders</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3 font-medium">Item</th>
                  <th className="px-6 py-3 font-medium">Quantity</th>
                  <th className="px-6 py-3 font-medium">Unit Cost</th>
                  <th className="px-6 py-3 font-medium">Total</th>
                  <th className="px-6 py-3 font-medium">Supplier</th>
                  <th className="px-6 py-3 font-medium">Expected Date</th>
                  <th className="px-6 py-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {purchases.map((purchase) => (
                  <tr key={purchase.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-800">
                      {purchase.inventoryItem.name}
                    </td>
                    <td className="px-6 py-4">{purchase.quantity}</td>
                    <td className="px-6 py-4">{formatCurrency(Number(purchase.unitCost))}</td>
                    <td className="px-6 py-4 font-semibold">
                      {formatCurrency(purchase.quantity * Number(purchase.unitCost))}
                    </td>
                    <td className="px-6 py-4">
                      {purchase.supplier || <span className="text-slate-400">-</span>}
                    </td>
                    <td className="px-6 py-4">
                      {purchase.expectedDate
                        ? new Date(purchase.expectedDate).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleReceive(purchase.id)}
                        disabled={receiving === purchase.id}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-medium flex items-center gap-2 ml-auto disabled:opacity-70"
                      >
                        {receiving === purchase.id ? (
                          <>
                            <Loader2 className="w-3 h-3 animate-spin" />
                            Receiving...
                          </>
                        ) : (
                          <>
                            <Check className="w-3 h-3" />
                            Receive
                          </>
                        )}
                      </button>
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
