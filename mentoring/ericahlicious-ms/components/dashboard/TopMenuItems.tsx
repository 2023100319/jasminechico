import { formatCurrency } from "@/lib/utils";
import type { TopMenuItem } from "@/types";
import { TrendingUp } from "lucide-react";

interface TopMenuItemsProps {
  items: TopMenuItem[];
}

export function TopMenuItems({ items }: TopMenuItemsProps) {
  const maxCount = Math.max(...items.map((i) => i.count), 1);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-4 h-4 text-blue-500" />
        <h3 className="text-slate-800 font-semibold text-base">Top Menu Items</h3>
      </div>
      <div className="space-y-3">
        {items.length === 0 ? (
          <p className="text-slate-400 text-sm text-center py-4">No data available</p>
        ) : (
          items.slice(0, 7).map((item, idx) => (
            <div key={item.name} className="flex items-center gap-3">
              <span className="w-5 text-xs font-bold text-slate-400 flex-shrink-0">
                {idx + 1}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-slate-700 truncate">{item.name}</p>
                  <p className="text-xs text-slate-400 ml-2 flex-shrink-0">
                    {formatCurrency(item.revenue)}
                  </p>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full"
                    style={{ width: `${(item.count / maxCount) * 100}%` }}
                  />
                </div>
              </div>
              <span className="text-xs text-slate-500 flex-shrink-0 w-8 text-right">
                {item.count}x
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
