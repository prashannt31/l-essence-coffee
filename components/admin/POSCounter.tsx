"use client";

import { useState } from "react";
import type {
  Ingredient,
  MenuItem,
  Recipe,
  OrderHistoryItem,
} from "../sections/AdminDashboard";
import type { LiveOrder } from "./LiveOrders";
import { addNotification } from "./Notifications";
import { addActivityLog } from "./ActivityLogs";
import { convertToBaseUnit } from "@/lib/inventory-utils";

type Props = {
  ingredients: Ingredient[];
  setIngredients: React.Dispatch<React.SetStateAction<Ingredient[]>>;
  recipes: Recipe[];
  menuItems: MenuItem[];
  setOrders: React.Dispatch<React.SetStateAction<number>>;
  orderHistory: OrderHistoryItem[];
  setOrderHistory: React.Dispatch<React.SetStateAction<OrderHistoryItem[]>>;
  liveOrders: LiveOrder[];
  setLiveOrders: React.Dispatch<React.SetStateAction<LiveOrder[]>>;
};

type CartItem = {
  menuItem: MenuItem;
  quantity: number;
};

export default function POSCounter({
  ingredients,
  setIngredients,
  recipes,
  menuItems,
  setOrders,
  orderHistory,
  setOrderHistory,
  liveOrders,
  setLiveOrders,
}: Props) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState("Walk-in Customer");
  const [orderType, setOrderType] = useState("Dine In");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [error, setError] = useState("");

  const activeMenuItems = menuItems.filter((item) => item.active);

  const getRecipe = (recipeId: number) =>
    recipes.find((recipe) => recipe.id === recipeId);

  const addToCart = (menuItem: MenuItem) => {
    setError("");

    setCart((prev) => {
      const existing = prev.find((item) => item.menuItem.id === menuItem.id);

      if (existing) {
        return prev.map((item) =>
          item.menuItem.id === menuItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prev, { menuItem, quantity: 1 }];
    });
  };

  const removeFromCart = (menuItemId: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.menuItem.id === menuItemId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const total = cart.reduce(
    (sum, item) => sum + item.menuItem.price * item.quantity,
    0
  );

  const validateStock = () => {
  const requiredIngredients: Record<
    string,
    {
      quantity: number;
      unit: string;
    }
  > = {};

  for (const cartItem of cart) {
    const recipe = getRecipe(cartItem.menuItem.recipeId);

    if (!recipe) {
      return {
        ok: false,
        message: `Recipe missing for ${cartItem.menuItem.name}`,
      };
    }

    for (const recipeIngredient of recipe.ingredients) {
      const key = recipeIngredient.ingredientName;

      if (!requiredIngredients[key]) {
        requiredIngredients[key] = {
          quantity: 0,
          unit: recipeIngredient.unit,
        };
      }

      requiredIngredients[key].quantity +=
        recipeIngredient.quantity * cartItem.quantity;
    }
  }

  for (const [ingredientName, required] of Object.entries(
    requiredIngredients
  )) {
    const ingredient = ingredients.find(
      (item) =>
        item.name.toLowerCase() === ingredientName.toLowerCase()
    );

    if (!ingredient) {
      return {
        ok: false,
        message: `${ingredientName} not found in inventory`,
      };
    }

    const availableBase = convertToBaseUnit(
      ingredient.quantity,
      ingredient.unit
    );

    const requiredBase = convertToBaseUnit(
      required.quantity,
      required.unit
    );

    if (availableBase < requiredBase) {
      return {
        ok: false,
        message: `Insufficient ${ingredient.name}. Required ${required.quantity} ${required.unit}, available ${ingredient.quantity} ${ingredient.unit}`,
      };
    }
  }

  return {
    ok: true,
    message: "",
  };
};

  const deductStock = () => {
  const requiredIngredients: Record<
    string,
    {
      quantity: number;
      unit: string;
    }
  > = {};

  for (const cartItem of cart) {
    const recipe = getRecipe(cartItem.menuItem.recipeId);
    if (!recipe) continue;

    for (const recipeIngredient of recipe.ingredients) {
      const key = recipeIngredient.ingredientName;

      if (!requiredIngredients[key]) {
        requiredIngredients[key] = {
          quantity: 0,
          unit: recipeIngredient.unit,
        };
      }

      requiredIngredients[key].quantity +=
        recipeIngredient.quantity * cartItem.quantity;
    }
  }

  setIngredients((prev) =>
    prev.map((ingredient) => {
      const required = requiredIngredients[ingredient.name];

      if (!required) return ingredient;

      const availableBase = convertToBaseUnit(
        ingredient.quantity,
        ingredient.unit
      );

      const requiredBase = convertToBaseUnit(
        required.quantity,
        required.unit
      );

      const updatedBase = Math.max(
        0,
        availableBase - requiredBase
      );

      let updatedQuantity = updatedBase;

      if (ingredient.unit === "kg") {
        updatedQuantity = updatedBase / 1000;
      }

      if (ingredient.unit === "L") {
        updatedQuantity = updatedBase / 1000;
      }

      return {
        ...ingredient,
        quantity: Number(updatedQuantity.toFixed(3)),
      };
    })
  );
};

  const placeOrder = () => {
    setError("");

    if (cart.length === 0) {
      setError("Cart is empty.");
      return;
    }

    const stockCheck = validateStock();

    if (!stockCheck.ok) {
      setError(stockCheck.message);
      return;
    }

    const orderId = Date.now();

    const itemName = cart
      .map((item) => `${item.menuItem.name} × ${item.quantity}`)
      .join(", ");

    deductStock();

    const newLiveOrder: LiveOrder = {
      id: orderId,
      customerName: customerName || "Walk-in Customer",
      itemName,
      quantity: cart.reduce((sum, item) => sum + item.quantity, 0),
      total,
      status: "Pending",
      time: new Date().toLocaleString(),
    };

    const newHistory: OrderHistoryItem = {
      id: orderId,
      recipeName: itemName,
      total,
      time: new Date().toLocaleString(),
    };

    const updatedLiveOrders = [newLiveOrder, ...liveOrders];
const updatedOrderHistory = [newHistory, ...orderHistory];

setLiveOrders(updatedLiveOrders);
setOrderHistory(updatedOrderHistory);
setOrders((prev) => prev + 1);

const savedData = JSON.parse(
  localStorage.getItem("l-essence-admin-data") || "{}"
);

localStorage.setItem(
  "l-essence-admin-data",
  JSON.stringify({
    ...savedData,
    ingredients,
    recipes,
    menuItems,
    orders: (savedData.orders || 0) + 1,
    orderHistory: updatedOrderHistory,
    liveOrders: updatedLiveOrders,
  })
);
    addNotification("Order Received", `Walk-in Order #${orderId}`);
    addActivityLog("Created Walk-in Order", `Order #${orderId}`);

    window.dispatchEvent(new Event("admin-data-updated"));
    window.dispatchEvent(new Event("notifications-updated"));

    setCart([]);
    setCustomerName("Walk-in Customer");
    setOrderType("Dine In");
    setPaymentMethod("Cash");
  };

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-8 bg-[#111111] border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-2xl font-semibold mb-6">
          Cash Counter / Walk-In Order
        </h2>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <input
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Customer Name"
            className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 outline-none"
          />

          <select
            value={orderType}
            onChange={(e) => setOrderType(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 outline-none"
          >
            <option>Dine In</option>
            <option>Takeaway</option>
          </select>

          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 outline-none"
          >
            <option>Cash</option>
            <option>UPI</option>
            <option>Card</option>
          </select>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {activeMenuItems.length === 0 ? (
            <p className="text-zinc-500 col-span-3">
              No active menu items found.
            </p>
          ) : (
            activeMenuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => addToCart(item)}
                className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 text-left hover:border-[#D4AF37] transition"
              >
                <p className="font-semibold">{item.name}</p>
                <p className="text-[#D4AF37] mt-2">₹{item.price}</p>
                <p className="text-xs text-zinc-500 mt-3">
                  Click to add
                </p>
              </button>
            ))
          )}
        </div>
      </div>

      <div className="col-span-4 bg-[#111111] border border-zinc-800 rounded-2xl p-6">
        <h3 className="text-xl font-semibold mb-6">Cart</h3>

        {cart.length === 0 ? (
          <p className="text-zinc-500 text-sm">No items added.</p>
        ) : (
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.menuItem.id}
                className="flex justify-between items-center border-b border-zinc-800 pb-3"
              >
                <div>
                  <p className="font-medium">{item.menuItem.name}</p>
                  <p className="text-xs text-zinc-500">
                    ₹{item.menuItem.price} × {item.quantity}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => removeFromCart(item.menuItem.id)}
                    className="h-7 w-7 rounded bg-zinc-800"
                  >
                    -
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    onClick={() => addToCart(item.menuItem)}
                    className="h-7 w-7 rounded bg-[#D4AF37] text-black"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}

            <div className="flex justify-between text-lg font-semibold pt-4">
              <span>Total</span>
              <span className="text-[#D4AF37]">₹{total}</span>
            </div>

            {error && (
              <p className="text-red-400 text-sm border border-red-500/30 bg-red-500/10 rounded-xl p-3">
                {error}
              </p>
            )}

            <button
              onClick={placeOrder}
              className="w-full bg-[#D4AF37] text-black py-3 rounded-xl font-semibold"
            >
              Place Order
            </button>
          </div>
        )}
      </div>
    </div>
  );
}