"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import AddToCartButton from "../../components/AddToCartButton";
import ShopHeaderActions from "../../components/ShopHeaderActions";

interface CoffeeProduct {
  id: string;
  name: string;
  price: number;
  roastLevel: string;
  stock: number;
}

interface PageProps {
  searchParams: Promise<{ collection?: string }>;
}

export default function Storefront({ searchParams }: PageProps) {
  const params = use(searchParams);
  const activeCollection = params?.collection;

  const [products, setProducts] = useState<CoffeeProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
  const syncShowroom = () => {
  const possibleKeys = [
    "l-essence-admin-data",
    "l-essence-admin-data-final",
  ];

  let adminData: any = null;

  for (const key of possibleKeys) {
    const saved = localStorage.getItem(key);

    if (saved) {
      const parsed = JSON.parse(saved);

      if (parsed.menuItems && parsed.menuItems.length > 0) {
        adminData = parsed;
        break;
      }
    }
  }

  if (!adminData) {
    setProducts([]);
    setIsLoading(false);
    return;
  }

  const mappedItems = (adminData.menuItems || [])
    .filter((item: any) => item.active)
    .map((item: any) => ({
      id: String(item.id),
      name: item.name,
      price: Number(item.price),
      roastLevel: "Private Reserve",
      stock: 99,
    }));

  setProducts(mappedItems);
  setIsLoading(false);
};

    syncShowroom();

    window.addEventListener("storage", syncShowroom);
    window.addEventListener("inventory-updated", syncShowroom);

    return () => {
      window.removeEventListener("storage", syncShowroom);
      window.removeEventListener("inventory-updated", syncShowroom);
    };
  }, []);

  const filteredCoffees = products.filter((coffee) => {
    const roast = coffee.roastLevel?.toLowerCase() || "";

    if (activeCollection === "origin") {
      return (
        roast.includes("low") ||
        roast.includes("light") ||
        roast.includes("radiant")
      );
    }

    if (activeCollection === "canopy") {
      return roast.includes("medium") || roast.includes("serene");
    }

    if (activeCollection === "depth") {
      return (
        roast.includes("hard") ||
        roast.includes("dark") ||
        roast.includes("nocturnal")
      );
    }

    return true;
  });

  const tabs = [
    { label: "All Collection", value: undefined },
    { label: "The Radiant", value: "origin" },
    { label: "The Serene", value: "canopy" },
    { label: "The Nocturnal", value: "depth" },
  ];

  return (
    <div className="min-h-screen bg-black text-white pt-36 pb-32 px-6 md:px-12 relative overflow-hidden antialiased">
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#6D8575]/[0.03] blur-[150px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-[#CACBA7]/[0.02] blur-[180px] pointer-events-none rounded-full" />

      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="text-center mb-16 flex flex-col items-center select-none">
          <span className="text-[9px] tracking-[0.4em] uppercase text-[#6D8575] font-light mb-3 block">
            Bespoke Liquid Wealth
          </span>

          <Link href="/" className="inline-block group">
            <h1
              className="text-4xl md:text-6xl tracking-[0.2em] uppercase font-light transition-colors duration-500 group-hover:text-white"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                color: "#CACBA7",
              }}
            >
              L-ESSENCE
            </h1>
          </Link>

          <div className="w-12 h-[1px] bg-[#CACBA7]/20 my-3" />

          <p className="text-zinc-500 tracking-[0.25em] uppercase text-[10px] font-light mt-1">
            The Live Reserve Showroom
          </p>
        </div>

        <ShopHeaderActions
          products={products}
          activeCollection={activeCollection}
        />

        <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-4 mb-24 border-b border-white/[0.04] pb-6 max-w-4xl mx-auto">
          {tabs.map((tab) => {
            const isActive = activeCollection === tab.value;

            return (
              <Link
                key={tab.label}
                href={tab.value ? `/shop?collection=${tab.value}` : "/shop"}
                className={`text-[11px] tracking-[0.25em] uppercase pb-2 transition-all duration-500 font-light relative ${
                  isActive
                    ? "text-[#CACBA7]"
                    : "text-zinc-600 hover:text-zinc-300"
                }`}
              >
                {tab.label}

                {isActive && (
                  <div className="absolute bottom-0 left-0 w-full h-[1px] bg-[#CACBA7] shadow-[0_1px_8px_rgba(202,203,167,0.4)]" />
                )}
              </Link>
            );
          })}
        </div>

        {isLoading ? (
          <div className="text-center py-28 text-zinc-500 tracking-widest text-xs uppercase font-light animate-pulse">
            Synchronizing Showroom Ledger Allocation Pools...
          </div>
        ) : filteredCoffees.length === 0 ? (
          <div className="text-center py-28 border border-white/[0.03] bg-gradient-to-b from-zinc-900/10 to-transparent max-w-xl mx-auto rounded-xs">
            <p
              className="text-[#CACBA7]/60 tracking-widest text-sm font-light mb-1"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Allocation Exhausted
            </p>

            <p className="text-zinc-600 tracking-widest text-[9px] uppercase">
              No physical items assigned to this tier profile.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {filteredCoffees.map((coffee, index) => {
              const isOOS = coffee.stock <= 0;

              return (
                <div
                  key={coffee.id}
                  className="relative overflow-hidden group border border-white/[0.04] p-8 md:p-10 rounded-sm transition-all duration-700 hover:border-[#CACBA7]/20 flex flex-col justify-between h-[360px]"
                  style={{
                    background:
                      "linear-gradient(145deg, rgba(20,25,25,0.3) 0%, rgba(5,5,5,0.95) 100%)",
                  }}
                >
                  <div className="absolute top-0 left-0 h-[1px] w-0 bg-gradient-to-r from-transparent via-[#CACBA7]/40 to-transparent group-hover:w-full transition-all duration-700" />

                  <div className="absolute top-6 right-8 text-[10px] tracking-widest text-zinc-800 select-none group-hover:text-zinc-700 transition-colors duration-500 font-mono">
                    REF.0{index + 1}
                  </div>

                  <div>
                    <div className="flex flex-col gap-1 mb-6">
                      <span className="text-[9px] tracking-[0.3em] uppercase text-[#6D8575] font-light">
                        Allocation Tier
                      </span>

                      <div className="text-xs text-zinc-500 font-light italic uppercase tracking-wider">
                        {coffee.roastLevel === "low"
                          ? "Low Hardness"
                          : coffee.roastLevel === "medium"
                          ? "Medium Hardness"
                          : coffee.roastLevel === "hard"
                          ? "Hard Intensity"
                          : coffee.roastLevel}
                      </div>
                    </div>

                    <h2
                      className="text-2xl md:text-3xl font-light text-zinc-200 tracking-wide group-hover:text-white transition-colors duration-500 mb-2"
                      style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    >
                      {coffee.name}
                    </h2>

                    {isOOS ? (
                      <span className="text-[9px] tracking-widest text-red-400 uppercase font-light block mt-3">
                        Vault Allocation Empty
                      </span>
                    ) : coffee.stock <= 5 ? (
                      <span className="text-[9px] tracking-[0.2em] uppercase text-[#CACBA7]/60 font-light block mt-3">
                        Only {coffee.stock} Allocations Remaining
                      </span>
                    ) : (
                      <span className="text-[9px] tracking-[0.2em] uppercase text-zinc-600 font-light block mt-3">
                        Bespoke Supply Secured
                      </span>
                    )}
                  </div>

                  <div className="pt-6 border-t border-white/[0.03] flex justify-between items-center bg-transparent relative z-20">
                    <div className="flex flex-col">
                      <span className="text-[9px] tracking-widest text-zinc-600 uppercase mb-0.5">
                        Value
                      </span>

                      <span className="text-xl font-light text-[#CACBA7] tracking-wide">
                        ${coffee.price.toFixed(2)}
                      </span>
                    </div>

                    <AddToCartButton item={coffee} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}