import { Lightbulb, TrendingUp, AlertCircle, Clock } from "lucide-react";
import type { InventoryItem } from "@/types";

interface DecisionInsightsProps {
  lowStockItems: InventoryItem[];
}

export function DecisionInsights({ lowStockItems }: DecisionInsightsProps) {
  const needsRestock = lowStockItems.filter(i => i.status === "OUT_OF_STOCK" || i.status === "LOW");

  return (
    <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl shadow-lg p-1 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 -mt-16 -mr-16 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl" />
      
      <div className="bg-slate-900/50 backdrop-blur-xl rounded-[14px] p-5 relative z-10 h-full border border-white/5">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 bg-indigo-500/20 rounded-lg border border-indigo-500/30">
             <Lightbulb className="w-5 h-5 text-indigo-400" />
          </div>
          <h3 className="text-white font-semibold text-lg">AI Decision Support</h3>
        </div>

        <div className="space-y-4">
          <div className="flex gap-3 bg-white/5 border border-white/10 rounded-xl p-3">
            <AlertCircle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-white text-sm font-medium">Restock Recommendation</p>
              <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                {needsRestock.length > 0 
                  ? `You have ${needsRestock.length} items running low. Prioritize restocking ${needsRestock[0]?.name} soon.`
                  : "Inventory levels are currently healthy. No immediate restocks needed."}
              </p>
            </div>
          </div>

          <div className="flex gap-3 bg-white/5 border border-white/10 rounded-xl p-3">
            <TrendingUp className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-white text-sm font-medium">Consumption Trend</p>
              <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                Chicken Alfredo Pasta is selling 15% faster this week. Ensure pasta and chicken breast stock is sufficient for the weekend.
              </p>
            </div>
          </div>

          <div className="flex gap-3 bg-white/5 border border-white/10 rounded-xl p-3">
            <Clock className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-white text-sm font-medium">Stock Prediction</p>
              <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                Based on current order velocity, your supply of Fresh Milk will likely deplete in 3 days.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
