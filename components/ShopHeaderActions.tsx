"use client";

import Link from "next/link";
import { useCart } from "./CartContext";

type Product = {
  id: string | number;
  name: string;
  price: number;
  quantity?: number;
};

type Props = {
  products: Product[];
  activeCollection?: string;
};

export default function ShopHeaderActions({
  products,
  activeCollection,
}: Props) {
  const { cart, setIsCartOpen } = useCart();

  const cartCount = cart.reduce(
    (total, item) => total + (item.quantity || 1),
    0
  );

  const cartTotal = cart.reduce(
    (sum, item) => sum + Number(item.price || 0) * (item.quantity || 1),
    0
  );

  return (
    <div className="flex justify-center items-center gap-4 mb-12">
      <Link
        href="/"
        className="text-[10px] tracking-[0.25em] uppercase text-zinc-600 hover:text-[#CACBA7] transition mr-auto"
      >
        ← Return to Atelier
      </Link>

      <button
        onClick={() => setIsCartOpen(true)}
        className="border border-white/[0.08] px-8 py-3 text-[10px] tracking-[0.25em] uppercase text-zinc-400 hover:text-[#CACBA7] hover:border-[#CACBA7]/30 transition"
      >
        Review Vault ({cartCount})
      </button>

      <button
        onClick={() => setIsCartOpen(true)}
        className="border border-[#CACBA7]/30 px-8 py-3 text-[10px] tracking-[0.25em] uppercase text-[#CACBA7] hover:bg-[#CACBA7] hover:text-black transition"
      >
        Checkout (${cartTotal.toFixed(2)})
      </button>
    </div>
  );
}