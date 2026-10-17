"use client";

import { Search } from "lucide-react";
import Notifications from "./Notifications";
import { useEffect, useRef, useState } from "react";

type Props = {
  setActiveSection?: (section: string) => void;
};

type SearchResult = {
  type: string;
  name: string;
  section: string;
};

type AdminUser = {
  id: number | string;
  name: string;
  role: "Super Admin" | "Admin";
  permissions: string[];
};

export default function TopNavbar({ setActiveSection }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [quickOpen, setQuickOpen] = useState(false);

  const quickRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadUser = () => {
      const savedActive = localStorage.getItem("l-essence-active-admin");

      const users = JSON.parse(
        localStorage.getItem("l-essence-admin-users") || "[]"
      );

      const user = users.find(
        (u: AdminUser) => String(u.id) === String(savedActive)
      );

      if (user) setCurrentUser(user);
    };

    loadUser();

    window.addEventListener("admin-permissions-updated", loadUser);
    window.addEventListener("storage", loadUser);

    return () => {
      window.removeEventListener("admin-permissions-updated", loadUser);
      window.removeEventListener("storage", loadUser);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        quickRef.current &&
        !quickRef.current.contains(event.target as Node)
      ) {
        setQuickOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const searchData = (value: string) => {
    setQuery(value);

    if (!value.trim()) {
      setResults([]);
      return;
    }

    const adminData = JSON.parse(
      localStorage.getItem("l-essence-admin-data") || "{}"
    );

    const suppliers = JSON.parse(
      localStorage.getItem("l-essence-suppliers") || "[]"
    );

    const search = value.toLowerCase();
    const permissions = currentUser?.permissions || [];

    const ingredientResults =
      adminData.ingredients
        ?.filter((item: any) => item.name?.toLowerCase().includes(search))
        .map((item: any) => ({
          type: "Ingredient",
          name: item.name,
          section: "ingredients",
        })) || [];

    const recipeResults =
      adminData.recipes
        ?.filter((item: any) => item.name?.toLowerCase().includes(search))
        .map((item: any) => ({
          type: "Recipe",
          name: item.name,
          section: "recipes",
        })) || [];

    const menuResults =
      adminData.menuItems
        ?.filter((item: any) => item.name?.toLowerCase().includes(search))
        .map((item: any) => ({
          type: "Menu Item",
          name: item.name,
          section: "menu",
        })) || [];

    const supplierResults =
      suppliers
        ?.filter(
          (item: any) =>
            item.name?.toLowerCase().includes(search) ||
            item.ingredient?.toLowerCase().includes(search)
        )
        .map((item: any) => ({
          type: "Supplier",
          name: item.name,
          section: "suppliers",
        })) || [];

    const allowedResults = [
      ...ingredientResults,
      ...recipeResults,
      ...menuResults,
      ...supplierResults,
    ].filter((result) => permissions.includes(result.section));

    setResults(allowedResults);
  };

  const goToResult = (result: SearchResult) => {
    setQuery("");
    setResults([]);
    setActiveSection?.(result.section);
  };

  const goToSection = (section: string) => {
    setQuickOpen(false);
    setActiveSection?.(section);
  };

  return (
    <header className="h-20 border-b border-zinc-800 flex items-center justify-between px-8 relative">
      <div className="relative">
        <div className="flex items-center bg-zinc-900 px-4 py-3 rounded-xl w-[450px]">
          <Search size={18} />

          <input
            value={query}
            onChange={(e) => searchData(e.target.value)}
            placeholder="Search ingredients, recipes, suppliers..."
            className="bg-transparent ml-3 outline-none w-full"
          />
        </div>

        {results.length > 0 && (
          <div className="absolute top-14 left-0 w-[450px] bg-[#111111] border border-zinc-800 rounded-2xl shadow-xl z-50 overflow-hidden">
            {results.slice(0, 8).map((result, index) => (
              <button
                key={`${result.type}-${result.name}-${index}`}
                onClick={() => goToResult(result)}
                className="w-full text-left px-4 py-3 hover:bg-zinc-900 transition border-b border-zinc-800 last:border-b-0"
              >
                <p className="text-sm font-semibold">{result.name}</p>
                <p className="text-xs text-[#D4AF37]">{result.type}</p>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-5">
        {currentUser && (
          <Notifications
            allowedTypes={
              currentUser.role === "Super Admin" ? ["all"] : ["order"]
            }
          />
        )}

        <div ref={quickRef} className="relative">
          <button
            onClick={() => setQuickOpen((prev) => !prev)}
            className="bg-[#D4AF37] text-black px-5 py-2 rounded-xl font-semibold"
          >
            + Quick Add
          </button>

          {quickOpen && (
            <div className="absolute right-0 top-12 w-56 bg-[#111111] border border-zinc-800 rounded-2xl shadow-xl overflow-hidden z-50">
              {currentUser?.permissions?.includes("ingredients") && (
                <button
                  onClick={() => goToSection("ingredients")}
                  className="w-full text-left px-4 py-3 hover:bg-zinc-900 transition"
                >
                  Add Ingredient
                </button>
              )}

              {currentUser?.permissions?.includes("recipes") && (
                <button
                  onClick={() => goToSection("recipes")}
                  className="w-full text-left px-4 py-3 hover:bg-zinc-900 transition"
                >
                  Add Recipe
                </button>
              )}

              {currentUser?.permissions?.includes("menu") && (
                <button
                  onClick={() => goToSection("menu")}
                  className="w-full text-left px-4 py-3 hover:bg-zinc-900 transition"
                >
                  Add Menu Item
                </button>
              )}

              {currentUser?.permissions?.includes("suppliers") && (
                <button
                  onClick={() => goToSection("suppliers")}
                  className="w-full text-left px-4 py-3 hover:bg-zinc-900 transition"
                >
                  Add Supplier
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}