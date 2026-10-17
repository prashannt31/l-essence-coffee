"use client";

import { useState } from "react";
import type { Ingredient } from "../sections/AdminDashboard";
import { addActivityLog } from "./ActivityLogs";
import { addNotification } from "./Notifications";

type Props = {
  ingredients: Ingredient[];
  setIngredients: React.Dispatch<React.SetStateAction<Ingredient[]>>;
};

export default function StockAdjustment({
  ingredients,
  setIngredients,
}: Props) {
  const [ingredientId, setIngredientId] = useState("");
  const [amount, setAmount] = useState("");

  const restockIngredient = () => {
    if (!ingredientId || !amount) {
      alert("Select ingredient and enter quantity.");
      return;
    }

    const selectedIngredient = ingredients.find(
      (i) => i.id === Number(ingredientId)
    );

    if (!selectedIngredient) {
      alert("Ingredient not found.");
      return;
    }

    const newQuantity = Number(
      (selectedIngredient.quantity + Number(amount)).toFixed(3)
    );

    addActivityLog(
      "Adjusted Stock",
      `${selectedIngredient.name} +${amount}${selectedIngredient.unit}`
    );

    addNotification(
      "Stock Updated",
      `${selectedIngredient.name} +${amount}${selectedIngredient.unit}`
    );

if (
  selectedIngredient.lowStockThreshold !== undefined &&
  newQuantity <= selectedIngredient.lowStockThreshold
) {      addNotification(
        "Low Stock Alert",
        `${selectedIngredient.name} is running low`
      );
    }

    setIngredients(
      ingredients.map((item) =>
        item.id === Number(ingredientId)
          ? {
              ...item,
              quantity: newQuantity,
            }
          : item
      )
    );

    setIngredientId("");
    setAmount("");
  };

  return (
    <div className="bg-[#111111] border border-zinc-800 rounded-2xl p-6">
      <h2 className="text-xl font-semibold mb-6">
        Stock Adjustment
      </h2>

      <div className="space-y-4">
        <select
          value={ingredientId}
          onChange={(e) => setIngredientId(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-3 outline-none"
        >
          <option value="">
            Select Ingredient
          </option>

          {ingredients.map((item) => (
            <option
              key={item.id}
              value={item.id}
            >
              {item.name} — {item.quantity} {item.unit}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Quantity to add"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-3 outline-none"
        />

        <button
          onClick={restockIngredient}
          className="w-full bg-[#D4AF37] text-black py-3 rounded-xl font-semibold"
        >
          Add Stock
        </button>
      </div>
    </div>
  );
}