"use client";

import { useState, useEffect, useCallback } from "react";
import { MenuItemCard } from "@/components/menu/MenuItemCard";
import { MenuCategoryTabs } from "@/components/menu/MenuCategoryTabs";
import { AddMenuItemForm } from "@/components/menu/AddMenuItemForm";
import { Plus, Loader2, RefreshCw, Search, UtensilsCrossed } from "lucide-react";
import type { MenuItem, MenuCategory } from "@/types";

export default function SupervisorMenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [showArchived, setShowArchived] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [menuRes, catRes] = await Promise.all([
        fetch(`/api/menu?archived=${showArchived}`),
        fetch("/api/menu/categories"),
      ]);
      if (!menuRes.ok || !catRes.ok) throw new Error("Failed to load menu data");
      const [menuData, catData] = await Promise.all([menuRes.json(), catRes.json()]);
      setItems(menuData);
      setCategories(catData);
    } catch {
      console.error("Failed to load menu data");
    } finally {
      setLoading(false);
    }
  }, [showArchived]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleArchive = async (id: number) => {
    await fetch(`/api/menu/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isArchived: true }),
    });
    loadData();
  };

  const handleRestore = async (id: number) => {
    await fetch(`/api/menu/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isArchived: false }),
    });
    loadData();
  };

  const filtered = items.filter((item) => {
    const matchesCategory = activeCategory === null || item.categoryId === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Menu Management</h1>
          <p className="text-sm text-slate-500 mt-0.5">Add, edit, and manage menu items</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={loadData}
            disabled={loading}
            className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 flex items-center gap-2 transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl flex items-center gap-2 font-medium transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Item
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 items-center">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search menu items..."
            className="pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-white transition-all w-64"
          />
        </div>

        {/* Archive toggle handled by category tabs below */}
      </div>

      {/* Category tabs */}
      <MenuCategoryTabs
        categories={categories}
        activeCategoryId={activeCategory}
        onSelectCategory={setActiveCategory}
        showArchivedTab
        isArchivedActive={showArchived}
        onSelectArchived={() => setShowArchived(!showArchived)}
      />

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64 bg-white rounded-2xl border border-slate-100">
          <Loader2 className="w-8 h-8 text-violet-600 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-16 text-center">
          <UtensilsCrossed className="w-12 h-12 mx-auto mb-4 text-slate-300" />
          <p className="text-slate-500 font-medium">No menu items found</p>
          <p className="text-slate-400 text-sm mt-1">Try adjusting your filters or add a new item</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((item) => (
            <MenuItemCard
              key={item.id}
              item={item}
              onEdit={(item) => setEditingItem(item)}
              onArchiveToggle={(id, currentStatus) => currentStatus ? handleRestore(id) : handleArchive(id)}
            />
          ))}
        </div>
      )}

      {/* Add / Edit Form */}
      {(showAddForm || editingItem) && (
        <AddMenuItemForm
          categories={categories}
          onClose={() => { setShowAddForm(false); setEditingItem(null); }}
          onSuccess={() => { setShowAddForm(false); setEditingItem(null); loadData(); }}
          initialData={editingItem ?? undefined}
        />
      )}
    </div>
  );
}
