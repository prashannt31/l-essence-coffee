"use client";

import { useState } from "react";
import type {
  Ingredient,
  Recipe,
  OrderHistoryItem,
} from "../sections/AdminDashboard";

type Props = {
  ingredients: Ingredient[];
  setIngredients: React.Dispatch<React.SetStateAction<Ingredient[]>>;
  recipes: Recipe[];
  orders: number;
  setOrders: React.Dispatch<React.SetStateAction<number>>;
  orderHistory: OrderHistoryItem[];
  setOrderHistory: React.Dispatch<React.SetStateAction<OrderHistoryItem[]>>;
};

function convertToBase(quantity: number, unit: string) {
  if (unit === "kg") return quantity * 1000;
  if (unit === "g") return quantity;
  if (unit === "L") return quantity * 1000;
  if (unit === "ml") return quantity;
  return quantity;
}

function convertFromBase(quantity: number, unit: string) {
  if (unit === "kg") return quantity / 1000;
  if (unit === "g") return quantity;
  if (unit === "L") return quantity / 1000;
  if (unit === "ml") return quantity;
  return quantity;
}

export default function OrderSimulation({
  ingredients,
  setIngredients,
  recipes,
  orders,
  setOrders,
  orderHistory,
  setOrderHistory,
}: Props) {
  const [orderQty, setOrderQty] = useState<Record<number, number>>({});

  const getRecipeQty = (recipeId: number) => {
    return orderQty[recipeId] || 1;
  };

  const increaseQty = (recipeId: number) => {
    setOrderQty({
      ...orderQty,
      [recipeId]: getRecipeQty(recipeId) + 1,
    });
  };

  const decreaseQty = (recipeId: number) => {
    setOrderQty({
      ...orderQty,
      [recipeId]: Math.max(1, getRecipeQty(recipeId) - 1),
    });
  };

  const getInventoryImpact = (recipe: Recipe) => {
    const multiplier = getRecipeQty(recipe.id);

    return recipe.ingredients.map((recipeItem) => {
      const inventoryItem = ingredients.find(
        (item) => item.name === recipeItem.ingredientName
      );

      if (!inventoryItem) {
        return {
          name: recipeItem.ingredientName,
          before: "Not found",
          after: "Missing",
          enough: false,
        };
      }

      const availableBase = convertToBase(
        inventoryItem.quantity,
        inventoryItem.unit
      );

      const requiredBase =
        convertToBase(recipeItem.quantity, recipeItem.unit) * multiplier;

      const remainingBase = availableBase - requiredBase;

      const afterQty = convertFromBase(remainingBase, inventoryItem.unit);

      return {
        name: inventoryItem.name,
        before: `${inventoryItem.quantity} ${inventoryItem.unit}`,
        after:
          remainingBase < 0
            ? "Insufficient"
            : `${Number(afterQty.toFixed(3))} ${inventoryItem.unit}`,
        enough: remainingBase >= 0,
      };
    });
  };

  const processOrder = (recipe: Recipe) => {
    const multiplier = getRecipeQty(recipe.id);
    const impact = getInventoryImpact(recipe);

    const hasInsufficientStock = impact.some((item) => !item.enough);

    if (hasInsufficientStock) {
      alert("Cannot process order. Some ingredients are insufficient.");
      return;
    }

    const updatedIngredients = [...ingredients];

    for (const recipeItem of recipe.ingredients) {
      const inventoryItem = updatedIngredients.find(
        (item) => item.name === recipeItem.ingredientName
      );

      if (!inventoryItem) continue;

      const availableBase = convertToBase(
        inventoryItem.quantity,
        inventoryItem.unit
      );

      const requiredBase =
        convertToBase(recipeItem.quantity, recipeItem.unit) * multiplier;

      const remainingBase = availableBase - requiredBase;

      inventoryItem.quantity = Number(
        convertFromBase(remainingBase, inventoryItem.unit).toFixed(3)
      );
    }

    const newOrder: OrderHistoryItem = {
      id: Date.now(),
      recipeName: `${recipe.name} × ${multiplier}`,
      time: new Date().toLocaleString(),
    };

    setIngredients(updatedIngredients);
    setOrders(orders + multiplier);
    setOrderHistory([newOrder, ...orderHistory]);

    alert(`${recipe.name} × ${multiplier} processed. Inventory updated.`);
  };

  return (
    <div className="bg-[#111111] border border-zinc-800 rounded-2xl p-6">
      <h2 className="text-xl font-semibold mb-6">Order Simulation</h2>

      {recipes.length === 0 ? (
        <p className="text-zinc-500 text-sm">
          No recipes saved yet. Create a recipe first.
        </p>
      ) : (
        <div className="space-y-5">
          {recipes.map((recipe) => {
            const qty = getRecipeQty(recipe.id);
            const impact = getInventoryImpact(recipe);
            const canProcess = impact.every((item) => item.enough);

            return (
              <div
                key={recipe.id}
                className="border border-zinc-800 rounded-2xl p-4 bg-black/20"
              >
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="font-semibold">{recipe.name}</p>
                    <p className="text-xs text-zinc-500">
                      {recipe.ingredients.length} ingredients
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => decreaseQty(recipe.id)}
                      className="h-8 w-8 border border-zinc-700 rounded-lg hover:bg-zinc-800"
                    >
                      -
                    </button>

                    <span className="min-w-6 text-center">{qty}</span>

                    <button
                      onClick={() => increaseQty(recipe.id)}
                      className="h-8 w-8 border border-zinc-700 rounded-lg hover:bg-zinc-800"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="bg-zinc-900/70 rounded-xl p-3 mb-4">
                  <p className="text-sm font-medium mb-3">
                    Inventory Impact Preview
                  </p>

                  <div className="space-y-2">
                    {impact.map((item) => (
                      <div
                        key={item.name}
                        className="flex justify-between text-sm"
                      >
                        <span className="text-zinc-400">{item.name}</span>

                        <span
                          className={
                            item.enough ? "text-zinc-300" : "text-red-400"
                          }
                        >
                          {item.before} → {item.after}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => processOrder(recipe)}
                  disabled={!canProcess}
                  className={`w-full rounded-xl p-4 transition ${
                    canProcess
                      ? "bg-[#D4AF37] text-black font-semibold hover:opacity-90"
                      : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                  }`}
                >
                  Process {recipe.name} × {qty}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}