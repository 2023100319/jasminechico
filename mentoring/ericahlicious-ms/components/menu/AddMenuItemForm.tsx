"use client";

import { useState } from "react";
import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/lib/uploadthing";
import type { MenuCategory, MenuItem } from "@/types";
import { X, Plus, Loader2 } from "lucide-react";

interface AddMenuItemFormProps {
  categories: MenuCategory[];
  onClose: () => void;
  onSuccess: () => void;
  initialData?: MenuItem;
}

export function AddMenuItemForm({ categories, onClose, onSuccess, initialData }: AddMenuItemFormProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [price, setPrice] = useState(initialData?.price.toString() || "");
  const [categoryId, setCategoryId] = useState(initialData?.categoryId.toString() || categories[0]?.id.toString() || "");
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || "");
  const [ingredients, setIngredients] = useState<{name: string}[]>(
      initialData?.ingredients?.map(i => ({ name: i.name })) || []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: "" }]);
  };

  const handleIngredientChange = (index: number, value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index].name = value;
    setIngredients(newIngredients);
  };

  const handleRemoveIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const url = initialData ? `/api/menu/${initialData.id}` : "/api/menu";
      const method = initialData ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          price: parseFloat(price),
          categoryId,
          imageUrl,
          ingredients: ingredients.filter(i => i.name.trim() !== ""),
        }),
      });

      if (!res.ok) throw new Error("Failed to save menu item");
      
      onSuccess();
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <h2 className="text-lg font-bold text-slate-800">
            {initialData ? "Edit Menu Item" : "Add New Menu Item"}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">
              {error}
            </div>
          )}

          <form id="menu-form" onSubmit={handleSubmit} className="space-y-5">
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Item Image</label>
              {imageUrl ? (
                <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-slate-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setImageUrl("")}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 shadow-md"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center bg-slate-50">
                  <UploadButton<OurFileRouter, "menuImageUploader">
                    endpoint="menuImageUploader"
                    onClientUploadComplete={(res) => {
                      if (res?.[0]) setImageUrl(res[0].url);
                    }}
                    onUploadError={(error: Error) => {
                      setError(`Upload failed: ${error.message}`);
                    }}
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Item Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  placeholder="e.g. Chicken Alfredo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Price (₱)</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <select
                  required
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Ingredients */}
            <div>
               <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-slate-700">Ingredients (for Inventory Tracking)</label>
                  <button type="button" onClick={handleAddIngredient} className="text-xs text-blue-600 font-medium hover:text-blue-700 flex items-center gap-1">
                      <Plus className="w-3 h-3" /> Add Ingredient
                  </button>
               </div>
               <div className="space-y-2">
                   {ingredients.map((ing, idx) => (
                       <div key={idx} className="flex items-center gap-2">
                           <input
                            type="text"
                            value={ing.name}
                            onChange={(e) => handleIngredientChange(idx, e.target.value)}
                            placeholder="e.g. Pasta (100g)"
                            className="flex-1 px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500"
                           />
                           <button type="button" onClick={() => handleRemoveIngredient(idx)} className="text-slate-400 hover:text-red-500 p-2">
                               <X className="w-4 h-4" />
                           </button>
                       </div>
                   ))}
                   {ingredients.length === 0 && (
                       <p className="text-xs text-slate-400 italic">No ingredients added yet.</p>
                   )}
               </div>
            </div>
          </form>
        </div>

        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="menu-form"
            disabled={loading}
            className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl transition-all shadow-md shadow-blue-500/20 disabled:opacity-70 flex items-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {initialData ? "Save Changes" : "Create Item"}
          </button>
        </div>
      </div>
    </div>
  );
}
