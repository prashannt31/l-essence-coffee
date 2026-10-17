"use client";

import { useState } from "react";
import { useCart } from "./CartContext";
type CartItem = {
  id: string | number;
  name: string;
  price: number;
  roastLevel?: string;
  stock?: number;
};

type Props = {
  item: CartItem;
};

export default function AddToCartButton({ item }: Props) {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    if (typeof item.stock === "number" && item.stock <= 0) {
      alert("This item is out of stock.");
      return;
    }

    setIsAdding(true);

    addToCart({
      id: String(item.id),
      name: item.name,
      price: item.price,
      roastLevel: item.roastLevel,
      stock: item.stock ?? 999,
    });

    window.dispatchEvent(new Event("cart-updated"));

    setAdded(true);
    setIsAdding(false);

    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={isAdding || added || item.stock === 0}
      className={`px-8 py-3 border text-xs tracking-[0.25em] transition ${
        item.stock === 0
          ? "border-zinc-800 text-zinc-600 cursor-not-allowed"
          : added
          ? "border-green-500 text-green-400"
          : "border-[#CACBA7]/30 text-[#CACBA7] hover:bg-[#CACBA7] hover:text-black"
      }`}
    >
      {item.stock === 0
        ? "EXHAUSTED"
        : isAdding
        ? "ADDING..."
        : added
        ? "ADDED"
        : "ACQUIRE ALLOCATION"}
    </button>
  );
}