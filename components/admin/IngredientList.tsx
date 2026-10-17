"use client";

import { useState } from "react";
import { Plus, Trash2, X, Pencil } from "lucide-react";
import type { Ingredient } from "../sections/AdminDashboard";

type Props = {
  ingredients: Ingredient[];
  setIngredients: React.Dispatch<React.SetStateAction<Ingredient[]>>;
};

export default function IngredientList({ ingredients, setIngredients }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [form, setForm] = useState({
    name: "",
    quantity: "",
    unit: "kg",
    lowStockThreshold: "",
  });

  const getStatus = (item: Ingredient) => {
    const threshold = item.lowStockThreshold ?? 1;

    if (item.quantity <= threshold * 0.5) return "Critical";
    if (item.quantity <= threshold) return "Low";

    return "Healthy";
  };

  const openAddModal = () => {
    setEditingId(null);
    setForm({
      name: "",
      quantity: "",
      unit: "kg",
      lowStockThreshold: "",
    });
    setShowModal(true);
  };

  const openEditModal = (ingredient: Ingredient) => {
    setEditingId(ingredient.id);
    setForm({
      name: ingredient.name,
      quantity: String(ingredient.quantity),
      unit: ingredient.unit,
      lowStockThreshold: String(ingredient.lowStockThreshold ?? ""),
    });
    setShowModal(true);
  };

  const saveIngredient = () => {
    if (!form.name || !form.quantity) return;

    const threshold =
      form.lowStockThreshold === ""
        ? 1
        : Number(form.lowStockThreshold);

    if (editingId) {
      setIngredients(
        ingredients.map((ingredient) =>
          ingredient.id === editingId
            ? {
                ...ingredient,
                name: form.name,
                quantity: Number(form.quantity),
                unit: form.unit,
                lowStockThreshold: threshold,
              }
            : ingredient
        )
      );
    } else {
      setIngredients([
        ...ingredients,
        {
          id: Date.now(),
          name: form.name,
          quantity: Number(form.quantity),
          unit: form.unit,
          lowStockThreshold: threshold,
        },
      ]);
    }

    setShowModal(false);
    setEditingId(null);
    setForm({
      name: "",
      quantity: "",
      unit: "kg",
      lowStockThreshold: "",
    });
  };

  const deleteIngredient = (id: number) => {
    const confirmDelete = confirm("Delete this ingredient?");
    if (!confirmDelete) return;

    setIngredients(ingredients.filter((ingredient) => ingredient.id !== id));
  };

  return (
    <>
      <div className="bg-[#111111] rounded-2xl border border-zinc-800 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-semibold text-xl">Ingredients</h2>

          <button className="text-sm border border-zinc-700 px-3 py-2 rounded-lg hover:bg-zinc-800">
            View All
          </button>
        </div>

        <div className="space-y-4">
          {ingredients.map((item) => {
            const status = getStatus(item);

            return (
              <div
                key={item.id}
                className="flex justify-between items-center border-b border-zinc-800 pb-3"
              >
                <div>
                  <p className="font-medium">{item.name}</p>

                  <p className="text-zinc-500 text-sm">
                    {item.quantity} {item.unit}
                  </p>

                  <p className="text-zinc-600 text-xs">
                    Low at: {item.lowStockThreshold ?? 1} {item.unit}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <StatusBadge status={status} />

                  <button
                    onClick={() => openEditModal(item)}
                    className="text-[#D4AF37] hover:opacity-80"
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    onClick={() => deleteIngredient(item.id)}
                    className="text-red-400 hover:text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={openAddModal}
          className="w-full mt-6 border border-[#D4AF37] text-[#D4AF37] rounded-xl py-3 flex items-center justify-center gap-2 hover:bg-[#D4AF37] hover:text-black transition"
        >
          <Plus size={18} />
          Add Ingredient
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#111111] border border-zinc-800 rounded-2xl w-[450px] p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                {editingId ? "Edit Ingredient" : "Add Ingredient"}
              </h2>

              <button onClick={() => setShowModal(false)}>
                <X />
              </button>
            </div>

            <div className="space-y-4">
              <input
                placeholder="Ingredient Name"
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-3 outline-none"
              />

              <input
                type="number"
                placeholder="Current Quantity"
                value={form.quantity}
                onChange={(e) =>
                  setForm({
                    ...form,
                    quantity: e.target.value,
                  })
                }
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-3 outline-none"
              />

              <select
                value={form.unit}
                onChange={(e) =>
                  setForm({
                    ...form,
                    unit: e.target.value,
                  })
                }
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-3 outline-none"
              >
                <option>kg</option>
                <option>g</option>
                <option>L</option>
                <option>ml</option>
                <option>pcs</option>
              </select>

              <input
                type="number"
                placeholder="Low Stock Threshold"
                value={form.lowStockThreshold}
                onChange={(e) =>
                  setForm({
                    ...form,
                    lowStockThreshold: e.target.value,
                  })
                }
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-3 outline-none"
              />

              <p className="text-xs text-zinc-500">
                Example: if unit is g and threshold is 500, alert appears when
                stock is 500g or below.
              </p>

              <button
                onClick={saveIngredient}
                className="w-full bg-[#D4AF37] text-black py-3 rounded-xl font-semibold"
              >
                {editingId ? "Update Ingredient" : "Save Ingredient"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    Healthy: "bg-green-500/20 text-green-400",
    Low: "bg-yellow-500/20 text-yellow-400",
    Critical: "bg-red-500/20 text-red-400",
  };

  return (
    <span
      className={`px-2 py-1 rounded-lg text-xs ${
        styles[status as keyof typeof styles]
      }`}
    >
      {status}
    </span>
  );
}