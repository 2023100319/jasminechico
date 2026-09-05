"use client";

import { cn } from "@/lib/utils";
import type { MenuCategory } from "@/types";

interface MenuCategoryTabsProps {
  categories: MenuCategory[];
  activeCategoryId: number | null;
  onSelectCategory: (id: number | null) => void;
  showArchivedTab?: boolean;
  isArchivedActive?: boolean;
  onSelectArchived?: () => void;
}

export function MenuCategoryTabs({
  categories,
  activeCategoryId,
  onSelectCategory,
  showArchivedTab = false,
  isArchivedActive = false,
  onSelectArchived,
}: MenuCategoryTabsProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
      <button
        onClick={() => onSelectCategory(null)}
        className={cn(
          "px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors",
          activeCategoryId === null && !isArchivedActive
            ? "bg-slate-800 text-white shadow-md"
            : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
        )}
      >
        All Items
      </button>

      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelectCategory(cat.id)}
          className={cn(
            "px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors",
            activeCategoryId === cat.id && !isArchivedActive
              ? "bg-slate-800 text-white shadow-md"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          )}
        >
          {cat.name}
        </button>
      ))}

      {showArchivedTab && (
        <>
          <div className="w-px h-6 bg-slate-200 mx-1" />
          <button
            onClick={() => onSelectArchived?.()}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors",
              isArchivedActive
                ? "bg-red-500 text-white shadow-md"
                : "bg-white text-red-500 border border-slate-200 hover:bg-red-50"
            )}
          >
            Archived
          </button>
        </>
      )}
    </div>
  );
}
