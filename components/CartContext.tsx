"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getAdminInventoryData, convertToBaseUnit } from "@/lib/inventory";
import { addNotification } from "@/components/admin/Notifications";

type CartItem = {
  id: string;
  name: string;
  price: number;
  roastLevel?: string;
  quantity: number;
  stock: number;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
};

const STORAGE_KEY = "l-essence-admin-data";

const CartContext = createContext<CartContextType | undefined>(undefined);

function validateWholeCart(cartItems: CartItem[]) {
  const adminData = getAdminInventoryData();

  const requiredMap: Record<string, number> = {};
  const availableMap: Record<string, number> = {};

  for (const cartItem of cartItems) {
    const menuItem = adminData.menuItems.find(
      (menu) =>
        String(menu.id) === String(cartItem.id) ||
        menu.name.toLowerCase() === cartItem.name.toLowerCase()
    );

    if (!menuItem) continue;

    const recipe = adminData.recipes.find(
      (recipe) => Number(recipe.id) === Number(menuItem.recipeId)
    );

    if (!recipe) continue;

    for (const recipeIngredient of recipe.ingredients) {
      const inventoryItem = adminData.ingredients.find(
        (ingredient) =>
          ingredient.name.trim().toLowerCase() ===
          recipeIngredient.ingredientName.trim().toLowerCase()
      );

      if (!inventoryItem) {
        return {
          canFulfill: false,
          message: `${recipeIngredient.ingredientName} is missing in inventory.`,
        };
      }

      const key = inventoryItem.name.toLowerCase();

      const required =
        convertToBaseUnit(recipeIngredient.quantity, recipeIngredient.unit) *
        cartItem.quantity;

      const available = convertToBaseUnit(
        inventoryItem.quantity,
        inventoryItem.unit
      );

      requiredMap[key] = (requiredMap[key] || 0) + required;
      availableMap[key] = available;
    }
  }

  for (const ingredientName in requiredMap) {
    if (requiredMap[ingredientName] > availableMap[ingredientName]) {
      return {
        canFulfill: false,
        message: `Not enough ${ingredientName}.`,
      };
    }
  }

  return {
    canFulfill: true,
    message: "Stock OK",
  };
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("l_essence_cart");
    if (saved) setCart(JSON.parse(saved));
    setIsHydrated(true);
  }, []);

  

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem("l_essence_cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("cart-updated"));
    }
  }, [cart, isHydrated]);

  const addToCart = (newItem: Omit<CartItem, "quantity">) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === String(newItem.id));

      const proposedCart = existing
        ? prev.map((item) =>
            item.id === String(newItem.id)
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        : [
            ...prev,
            {
              ...newItem,
              id: String(newItem.id),
              quantity: 1,
              stock: newItem.stock || 999,
            },
          ];

      const validation = validateWholeCart(proposedCart);

      if (!validation.canFulfill) {
        alert(validation.message);
        return prev;
      }

      return proposedCart;
    });

    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("l_essence_cart");
    window.dispatchEvent(new Event("cart-updated"));
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
      {isHydrated && <CartDrawer />}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext)!;

function CartDrawer() {
  const { cart, removeFromCart, clearCart, isCartOpen, setIsCartOpen } =
    useCart();

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const validation = validateWholeCart(cart);

  const sendOrderToAdmin = () => {
    if (cart.length === 0) return;

    const validationResult = validateWholeCart(cart);

    if (!validationResult.canFulfill) {
      alert(validationResult.message);
      return;
    }

    const savedData = localStorage.getItem(STORAGE_KEY);
    const adminData = savedData
      ? JSON.parse(savedData)
      : {
          ingredients: [],
          recipes: [],
          menuItems: [],
          orders: 0,
          orderHistory: [],
          liveOrders: [],
        };

    const orderItems = cart
      .map((item) => `${item.name} × ${item.quantity}`)
      .join(", ");

const newLiveOrder = {
  id: Date.now(),
  customerName: "Website Customer",
  itemName: cart.map((item) => `${item.name} × ${item.quantity}`).join(", "),
  quantity: cart.reduce((sum, item) => sum + item.quantity, 0),
  total: Number(total.toFixed(2)),
  status: "Pending" as const,
  time: new Date().toLocaleString(),
  items: cart.map((item) => ({
    id: String(item.id),
    name: item.name,
    quantity: item.quantity,
    price: item.price,
  })),
};
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        ...adminData,
        orders: (adminData.orders || 0) + 1,
        liveOrders: [newLiveOrder, ...(adminData.liveOrders || [])],
      })
    );
addNotification(
  "Order Received",
  `Order #${newLiveOrder.id}`
);
    window.dispatchEvent(new Event("admin-data-updated"));
    window.dispatchEvent(new Event("notifications-updated"));
    window.dispatchEvent(new Event("storage"));

    clearCart();
    setIsCartOpen(false);

    alert("Order sent to admin.");
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
<motion.div
  initial={{ x: "100%" }}
  animate={{ x: 0 }}
  exit={{ x: "100%" }}
  transition={{ type: "spring", damping: 30 }}
  className="fixed right-0 top-0 h-screen w-full max-w-md bg-[#0B0B0B] border-l border-white/[0.06] p-8 z-[110] overflow-y-auto"
            />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            className="fixed right-0 top-0 h-screen w-full max-w-md bg-[#0B0B0B] border-l border-white/[0.06] p-8 z-[110] overflow-y-auto"           
          >
            <button
            onClick={() => setIsCartOpen(false)}
              className="text-xs uppercase text-zinc-500"
            >
              Close ✕
            </button>

            <h2 className="mt-8 text-2xl font-serif text-[#CACBA7]">
              Review Vault
            </h2>

            <div className="mt-8 space-y-6">
              {cart.length === 0 ? (
                <p className="text-sm text-zinc-500">Your vault is empty.</p>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between border-b border-white/[0.04] pb-4"
                  >
                    <div>
                      <h4 className="font-serif">{item.name}</h4>

                      <p className="text-xs text-zinc-500 mt-1">
                        Qty: {item.quantity}
                      </p>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-[9px] uppercase text-zinc-600 mt-2"
                      >
                        Release
                      </button>
                    </div>

                    <span className="text-[#CACBA7]">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))
              )}
            </div>

            <div className="mt-8 text-xl font-serif text-[#CACBA7]">
              Total: ${total.toFixed(2)}
            </div>

            <p
              className={`mt-4 text-xs uppercase tracking-widest ${
                validation.canFulfill ? "text-green-400" : "text-red-400"
              }`}
            >
              {validation.message}
            </p>

            <button
              onClick={sendOrderToAdmin}
              disabled={cart.length === 0 || !validation.canFulfill}
              className={`w-full mt-6 py-4 rounded-xl text-xs tracking-[0.25em] uppercase ${
                cart.length === 0 || !validation.canFulfill
                  ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                  : "bg-[#D4AF37] text-black font-semibold"
              }`}
            
            >

              Send Order To Admin
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}