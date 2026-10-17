"use client";

import { useState } from "react";
import type { Recipe } from "../sections/AdminDashboard";
import { addActivityLog } from "./ActivityLogs";

export type MenuItem = {
  id: number;
  name: string;
  price: number;
  recipeId: number;
  active: boolean;
};

type Props = {
  recipes: Recipe[];
  menuItems: MenuItem[];
  setMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>>;
};

export default function MenuManagement({
  recipes,
  menuItems,
  setMenuItems,
}: Props) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [recipeId, setRecipeId] = useState("");

  const addMenuItem = () => {
    if (!name || !price || !recipeId) {
      alert("Fill all menu item details.");
      return;
    }

    setMenuItems([
      ...menuItems,
      {
        id: Date.now(),
        name,
        price: Number(price),
        recipeId: Number(recipeId),
        active: true,
      },
    ]);
    addActivityLog("Added Menu Item", name);

    setName("");
    setPrice("");
    setRecipeId("");
  };

  const toggleActive = (id: number) => {
    setMenuItems(
      menuItems.map((item) =>
        item.id === id ? { ...item, active: !item.active } : item
      )
    );
  };

  const deleteMenuItem = (id: number) => {
    setMenuItems(menuItems.filter((item) => item.id !== id));
  };

  return (
    <div className="bg-[#111111] border border-zinc-800 rounded-2xl p-6">
      <h2 className="text-xl font-semibold mb-6">Menu Management</h2>

      <div className="space-y-3">
        <input
          placeholder="Menu Item Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-3 outline-none"
        />

        <input
          type="number"
          placeholder="Price ₹"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-3 outline-none"
        />

        <select
          value={recipeId}
          onChange={(e) => setRecipeId(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-3 outline-none"
        >
          <option value="">Link Recipe</option>
          {recipes.map((recipe) => (
            <option key={recipe.id} value={recipe.id}>
              {recipe.name}
            </option>
          ))}
        </select>

        <button
          onClick={addMenuItem}
          className="w-full bg-[#D4AF37] text-black py-3 rounded-xl font-semibold"
        >
          Add Menu Item
        </button>
      </div>

      <div className="mt-6 space-y-3">
        {menuItems.map((item) => {
          const recipe = recipes.find((r) => r.id === item.recipeId);

          return (
            <div
              key={item.id}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-4"
            >
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-zinc-500">₹{item.price}</p>
                  <p className="text-xs text-zinc-500">
                    Recipe: {recipe?.name || "Missing"}
                  </p>
                </div>

                <div className="flex gap-3 text-sm">
                  <button
                    onClick={() => toggleActive(item.id)}
                    className={item.active ? "text-green-400" : "text-zinc-500"}
                  >
                    {item.active ? "Active" : "Hidden"}
                  </button>

                  <button
                    onClick={() => deleteMenuItem(item.id)}
                    className="text-red-400"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}