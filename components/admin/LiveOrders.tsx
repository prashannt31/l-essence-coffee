"use client";

import { useState } from "react";
import { addActivityLog } from "./ActivityLogs";

import type {
  Ingredient,
  Recipe,
  MenuItem,
  OrderHistoryItem,
} from "../sections/AdminDashboard";

export type LiveOrderItem = {
  id: string;
  name: string;
  quantity: number;
  price: number;
};

export type LiveOrder = {
  id: number;
  customerName: string;
  itemName: string;
  quantity: number;
  total: number;
  status:
    | "Pending"
    | "Accepted"
    | "Preparing"
    | "Ready"
    | "Completed"
    | "Cancelled";
  time: string;
  items?: LiveOrderItem[];
};

type Props = {
  liveOrders: LiveOrder[];
  setLiveOrders: React.Dispatch<React.SetStateAction<LiveOrder[]>>;
  ingredients: Ingredient[];
  setIngredients: React.Dispatch<React.SetStateAction<Ingredient[]>>;
  recipes: Recipe[];
  menuItems: MenuItem[];
  orderHistory: OrderHistoryItem[];
  setOrderHistory: React.Dispatch<React.SetStateAction<OrderHistoryItem[]>>;
};

function convertToBase(quantity: number, unit: string) {
  const u = unit.toLowerCase();

  if (u === "kg") return quantity * 1000;
  if (u === "g") return quantity;
  if (u === "l") return quantity * 1000;
  if (u === "ml") return quantity;

  return quantity;
}

function convertFromBase(quantity: number, unit: string) {
  const u = unit.toLowerCase();

  if (u === "kg") return quantity / 1000;
  if (u === "g") return quantity;
  if (u === "l") return quantity / 1000;
  if (u === "ml") return quantity;

  return quantity;
}

export default function LiveOrders({
  liveOrders,
  setLiveOrders,
  ingredients,
  setIngredients,
  recipes,
  menuItems,
  orderHistory,
  setOrderHistory,
}: Props) {
  const [showAllOrders, setShowAllOrders] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [statusFilter, setStatusFilter] = useState<
    "All" | LiveOrder["status"]
  >("All");

  const filteredOrders = liveOrders.filter((order) => {
    const search = searchQuery.toLowerCase();

    const matchesSearch =
      String(order.id).toLowerCase().includes(search) ||
      order.customerName.toLowerCase().includes(search) ||
      order.itemName.toLowerCase().includes(search);

    const matchesStatus =
      statusFilter === "All" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const visibleOrders = showAllOrders
    ? filteredOrders
    : filteredOrders.slice(0, 5);

  const deductInventory = (order: LiveOrder) => {
    if (!order.items || order.items.length === 0) return true;

    const updatedIngredients = [...ingredients];

    for (const orderItem of order.items) {
      const menuItem = menuItems.find(
        (item) =>
          String(item.id) === String(orderItem.id) ||
          item.name.toLowerCase() === orderItem.name.toLowerCase()
      );

      if (!menuItem) continue;

      const recipe = recipes.find(
        (r) => Number(r.id) === Number(menuItem.recipeId)
      );

      if (!recipe) continue;

      for (const recipeItem of recipe.ingredients) {
        const inventoryItem = updatedIngredients.find(
          (i) =>
            i.name.trim().toLowerCase() ===
            recipeItem.ingredientName.trim().toLowerCase()
        );

        if (!inventoryItem) {
          alert(`${recipeItem.ingredientName} is missing in inventory.`);
          return false;
        }

        const availableBase = convertToBase(
          inventoryItem.quantity,
          inventoryItem.unit
        );

        const requiredBase =
          convertToBase(recipeItem.quantity, recipeItem.unit) *
          orderItem.quantity;

        if (availableBase < requiredBase) {
          alert(`Not enough ${inventoryItem.name}.`);
          return false;
        }
      }
    }

    for (const orderItem of order.items) {
      const menuItem = menuItems.find(
        (item) =>
          String(item.id) === String(orderItem.id) ||
          item.name.toLowerCase() === orderItem.name.toLowerCase()
      );

      if (!menuItem) continue;

      const recipe = recipes.find(
        (r) => Number(r.id) === Number(menuItem.recipeId)
      );

      if (!recipe) continue;

      for (const recipeItem of recipe.ingredients) {
        const inventoryItem = updatedIngredients.find(
          (i) =>
            i.name.trim().toLowerCase() ===
            recipeItem.ingredientName.trim().toLowerCase()
        );

        if (!inventoryItem) continue;

        const availableBase = convertToBase(
          inventoryItem.quantity,
          inventoryItem.unit
        );

        const requiredBase =
          convertToBase(recipeItem.quantity, recipeItem.unit) *
          orderItem.quantity;

        const remainingBase = availableBase - requiredBase;

        inventoryItem.quantity = Number(
          convertFromBase(remainingBase, inventoryItem.unit).toFixed(3)
        );
      }
    }

    setIngredients(updatedIngredients);
    return true;
  };

  const updateStatus = (order: LiveOrder, status: LiveOrder["status"]) => {
    if (order.status === "Completed" || order.status === "Cancelled") {
      return;
    }

    if (status === "Accepted" && order.status === "Pending") {
      const success = deductInventory(order);
      if (!success) return;
    }

    if (status === "Completed") {
      const alreadyExists = orderHistory.some(
        (historyOrder) => historyOrder.id === order.id
      );

      if (!alreadyExists) {
        setOrderHistory([
          {
            id: order.id,
            recipeName: order.itemName,
            time: new Date().toLocaleString(),
            total: order.total,
          },
          ...orderHistory,
        ]);
      }
    }

    setLiveOrders(
      liveOrders.map((item) =>
        item.id === order.id ? { ...item, status } : item
      )
    );
    addActivityLog(
  `Order Marked ${status}`,
  `Order #${order.id}`
);
  };

  return (
    <div className="bg-[#111111] border border-zinc-800 rounded-2xl p-6 h-[620px] overflow-hidden">
      <div className="flex justify-between items-center mb-5">
        <p className="text-sm text-zinc-500">
          Showing {visibleOrders.length} of {filteredOrders.length} matching
          orders
        </p>

        {filteredOrders.length > 5 && (
          <button
            onClick={() => setShowAllOrders(!showAllOrders)}
            className="text-sm text-[#D4AF37] hover:text-[#E5C158] hover:underline transition"
          >
            {showAllOrders ? "Show Less" : "See All"}
          </button>
        )}
      </div>

      <div className="grid grid-cols-12 gap-3 mb-5">
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by order ID, customer, or product..."
          className="col-span-8 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#D4AF37]"
        />

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as "All" | LiveOrder["status"])
          }
          className="col-span-4 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#D4AF37]"
        >
          <option value="All">All Orders</option>
          <option value="Pending">Pending</option>
          <option value="Accepted">Accepted</option>
          <option value="Preparing">Preparing</option>
          <option value="Ready">Ready</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {filteredOrders.length === 0 ? (
        <p className="text-zinc-500 text-sm">No matching orders found.</p>
      ) : (
        <div className="space-y-4 overflow-y-auto h-[480px] pr-2 admin-scrollbar">
          {visibleOrders.map((order) => (
            <div
              key={order.id}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-4"
            >
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold">#{order.id}</p>
                  <p className="text-sm text-zinc-400">
                    {order.customerName}
                  </p>
                  <p className="text-sm mt-2">{order.itemName}</p>
                  <p className="text-xs text-zinc-500 mt-1">{order.time}</p>
                </div>

                <div className="text-right">
                  <p className="text-[#D4AF37] font-semibold">
                    ₹{order.total}
                  </p>
                  <StatusBadge status={order.status} />
                </div>
              </div>

              {order.status !== "Completed" &&
                order.status !== "Cancelled" && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {order.status === "Pending" && (
                      <button
                        onClick={() => updateStatus(order, "Accepted")}
                        className="px-3 py-2 rounded-lg border border-blue-700 text-blue-400 text-xs"
                      >
                        Accept
                      </button>
                    )}

                    <button
                      onClick={() => updateStatus(order, "Preparing")}
                      className="px-3 py-2 rounded-lg border border-yellow-700 text-yellow-400 text-xs"
                    >
                      Preparing
                    </button>

                    <button
                      onClick={() => updateStatus(order, "Ready")}
                      className="px-3 py-2 rounded-lg border border-purple-700 text-purple-400 text-xs"
                    >
                      Ready
                    </button>

                    <button
                      onClick={() => updateStatus(order, "Completed")}
                      className="px-3 py-2 rounded-lg border border-green-700 text-green-400 text-xs"
                    >
                      Complete
                    </button>

                    <button
                      onClick={() => updateStatus(order, "Cancelled")}
                      className="px-3 py-2 rounded-lg border border-red-700 text-red-400 text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: LiveOrder["status"] }) {
  const styles = {
    Pending: "bg-blue-500/20 text-blue-400",
    Accepted: "bg-cyan-500/20 text-cyan-400",
    Preparing: "bg-yellow-500/20 text-yellow-400",
    Ready: "bg-purple-500/20 text-purple-400",
    Completed: "bg-green-500/20 text-green-400",
    Cancelled: "bg-red-500/20 text-red-400",
  };

  return (
    <span
      className={`inline-block mt-2 px-3 py-1 rounded-lg text-xs ${styles[status]}`}
    >
      {status}
    </span>
  );
}