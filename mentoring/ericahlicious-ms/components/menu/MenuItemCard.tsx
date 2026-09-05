"use client";

import { formatCurrency } from "@/lib/utils";
import type { MenuItem } from "@/types";
import { Edit2, Archive, ArchiveRestore, Image as ImageIcon } from "lucide-react";

interface MenuItemCardProps {
  item: MenuItem;
  onEdit?: (item: MenuItem) => void;
  onArchiveToggle?: (id: number, currentStatus: boolean) => void;
}

export function MenuItemCard({ item, onEdit, onArchiveToggle }: MenuItemCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col group">
      {/* Image Area */}
      <div className="aspect-[4/3] bg-slate-50 relative overflow-hidden border-b border-slate-100 flex items-center justify-center">
        {item.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <ImageIcon className="w-10 h-10 text-slate-300" />
        )}
        
        {/* Category Badge overlay */}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-sm text-[10px] font-bold tracking-wider uppercase text-slate-600 shadow-sm">
            {item.category.name}
          </span>
        </div>

        {item.isArchived && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center">
             <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-lg tracking-wider uppercase">Archived</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        <h4 className="font-semibold text-slate-800 text-base line-clamp-1 mb-1">
          {item.name}
        </h4>
        <p className="text-blue-600 font-bold mb-3">{formatCurrency(item.price)}</p>

        <div className="flex-1 mb-4">
          <p className="text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">
            Ingredients
          </p>
          <div className="flex flex-wrap gap-1.5">
            {item.ingredients?.map((ing) => (
              <span
                key={ing.id}
                className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[11px] font-medium"
              >
                {ing.name}
              </span>
            ))}
            {(!item.ingredients || item.ingredients.length === 0) && (
              <span className="text-xs text-slate-400 italic">No ingredients mapped</span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-auto">
          <button
            onClick={() => onEdit?.(item)}
            className="text-slate-400 hover:text-blue-600 p-1.5 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => onArchiveToggle?.(item.id, item.isArchived)}
            className={`p-1.5 rounded-lg transition-colors ${
              item.isArchived 
                ? "text-green-600 hover:bg-green-50" 
                : "text-slate-400 hover:text-red-500 hover:bg-red-50"
            }`}
            title={item.isArchived ? "Restore item" : "Archive item"}
          >
            {item.isArchived ? <ArchiveRestore className="w-4 h-4" /> : <Archive className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
