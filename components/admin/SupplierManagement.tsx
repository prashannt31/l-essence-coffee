"use client";
import { addActivityLog } from "./ActivityLogs";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";

type Supplier = {
  id: number;
  name: string;
  contact: string;
  email: string;
  ingredient: string;
  lastOrderDate: string;
  status: "Active" | "Inactive";
};

const SUPPLIER_STORAGE_KEY = "l-essence-suppliers";

export default function SupplierManagement() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const [form, setForm] = useState({
    name: "",
    contact: "",
    email: "",
    ingredient: "",
  });

  useEffect(() => {
    const saved = localStorage.getItem(SUPPLIER_STORAGE_KEY);

    if (saved) {
      setSuppliers(JSON.parse(saved));
    }

    setIsLoaded(true);
  }, []);
  

  useEffect(() => {
    if (!isLoaded) return;

    localStorage.setItem(
      SUPPLIER_STORAGE_KEY,
      JSON.stringify(suppliers)
    );
  }, [suppliers, isLoaded]);

  const addSupplier = () => {
    if (!form.name || !form.contact || !form.ingredient) {
      alert("Please fill supplier name, contact and ingredient.");
      return;
    }

    setSuppliers([
      ...suppliers,
      {
        id: Date.now(),
        name: form.name,
        contact: form.contact,
        email: form.email,
        ingredient: form.ingredient,
        lastOrderDate: new Date().toLocaleDateString("en-IN"),
        status: "Active",
      },
      
    ]);
    addActivityLog("Added Supplier", form.name);

    setForm({
      name: "",
      contact: "",
      email: "",
      ingredient: "",
    });
  };
  

  const deleteSupplier = (id: number) => {
    setSuppliers(suppliers.filter((supplier) => supplier.id !== id));
  };

  return (
    <div className="bg-[#111111] border border-zinc-800 rounded-2xl p-6">
      <h2 className="text-xl font-semibold mb-6">Supplier Management</h2>

      <div className="grid grid-cols-4 gap-3 mb-6">
        <input
          placeholder="Supplier Name"
          value={form.name}
          onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value,
            })
          }
          className="bg-zinc-900 border border-zinc-700 rounded-xl p-3 outline-none"
        />

        <input
          placeholder="Contact"
          value={form.contact}
          onChange={(e) =>
            setForm({
              ...form,
              contact: e.target.value,
            })
          }
          className="bg-zinc-900 border border-zinc-700 rounded-xl p-3 outline-none"
        />

        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm({
              ...form,
              email: e.target.value,
            })
          }
          className="bg-zinc-900 border border-zinc-700 rounded-xl p-3 outline-none"
        />

        <input
          placeholder="Ingredient Supplied"
          value={form.ingredient}
          onChange={(e) =>
            setForm({
              ...form,
              ingredient: e.target.value,
            })
          }
          className="bg-zinc-900 border border-zinc-700 rounded-xl p-3 outline-none"
        />
      </div>

      <button
        onClick={addSupplier}
        className="mb-6 bg-[#D4AF37] text-black px-5 py-3 rounded-xl font-semibold flex items-center gap-2"
      >
        <Plus size={18} />
        Add Supplier
      </button>

      <div className="space-y-4">
        {suppliers.length === 0 ? (
          <p className="text-sm text-zinc-500">No suppliers added yet.</p>
        ) : (
          suppliers.map((supplier) => (
            <div
              key={supplier.id}
              className="border border-zinc-800 bg-zinc-900/40 rounded-xl p-4 flex justify-between items-center"
            >
              <div>
                <h3 className="font-semibold">{supplier.name}</h3>

                <p className="text-sm text-zinc-500 mt-1">
                  {supplier.ingredient}
                </p>

                <p className="text-xs text-zinc-500">
                  {supplier.contact} {supplier.email && `• ${supplier.email}`}
                </p>

                <p className="text-xs text-zinc-600 mt-1">
                  Last Order: {supplier.lastOrderDate}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-green-400 text-sm">
                  {supplier.status}
                </span>

                <button
                  onClick={() => deleteSupplier(supplier.id)}
                  className="text-red-400 hover:text-red-500"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}