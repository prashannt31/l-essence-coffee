"use client";

import { useEffect, useState } from "react";

import Sidebar from "../admin/Sidebar";
import TopNavbar from "../admin/TopNavbar";
import StatCard from "../admin/StatCard";
import IngredientList from "../admin/IngredientList";
import RecipeBuilder from "../admin/RecipeBuilder";
import LowStockAlerts from "../admin/LowStockAlerts";
import OrderHistory from "../admin/OrderHistory";
import QuickActions from "../admin/QuickActions";
import MenuManagement from "../admin/MenuManagement";
import StockAdjustment from "../admin/StockAdjustment";
import RestockSuggestions from "../admin/RestockSuggestions";
import InventoryAnalytics from "../admin/InventoryAnalytics";
import SalesAnalytics from "../admin/SalesAnalytics";
import LiveOrders, { LiveOrder } from "../admin/LiveOrders";
import InventoryForecasting from "../admin/InventoryForecasting";
import RevenueOrdersChart from "../admin/RevenueOrdersChart";
import TopProducts from "../admin/TopProducts";
import SupplierManagement from "../admin/SupplierManagement";
import RecentActivity from "../admin/RecentActivity";
import AdminSettings from "../admin/AdminSettings";
import AdminProfile from "@/components/admin/AdminProfile";
import ActivityLogs from "../admin/ActivityLogs";
import RevenueDashboard from "../admin/RevenueDashboard";
import KitchenDisplay from "../admin/KitchenDisplay";
import POSCounter from "../admin/POSCounter";

export type Ingredient = {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  lowStockThreshold?: number;
};

export type RecipeIngredient = {
  id: number;
  ingredientName: string;
  quantity: number;
  unit: string;
};

export type Recipe = {
  id: number;
  name: string;
  ingredients: RecipeIngredient[];
};

export type OrderHistoryItem = {
  id: number;
  recipeName: string;
  time: string;
  total?: number;
};

export type MenuItem = {
  id: number;
  name: string;
  price: number;
  recipeId: number;
  active: boolean;
};

const STORAGE_KEY = "l-essence-admin-data";

export default function AdminDashboard() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    {
      id: 1,
      name: "Coffee Beans",
      quantity: 50,
      unit: "kg",
      lowStockThreshold: 1,
    },
    {
      id: 2,
      name: "Milk",
      quantity: 50,
      unit: "L",
      lowStockThreshold: 2,
    },
    {
      id: 3,
      name: "Sugar",
      quantity: 100,
      unit: "g",
      lowStockThreshold: 500,
    },
  ]);

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState(0);
  const [orderHistory, setOrderHistory] = useState<OrderHistoryItem[]>([]);
  const [liveOrders, setLiveOrders] = useState<LiveOrder[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");

  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);

    if (savedData) {
      const parsedData = JSON.parse(savedData);

      const loadedIngredients = (parsedData.ingredients || []).map(
        (item: Ingredient) => ({
          ...item,
          lowStockThreshold: item.lowStockThreshold ?? 1,
        })
      );

      setIngredients(loadedIngredients);
      setRecipes(parsedData.recipes || []);
      setMenuItems(parsedData.menuItems || []);
      setOrders(parsedData.orders || 0);
      setOrderHistory(parsedData.orderHistory || []);
      setLiveOrders(parsedData.liveOrders || []);
    }

    setIsLoaded(true);
  }, []);

  useEffect(() => {
    const syncAdminData = () => {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (!savedData) return;

      const parsedData = JSON.parse(savedData);

      setOrders(parsedData.orders || 0);
      setOrderHistory(parsedData.orderHistory || []);
      setLiveOrders(parsedData.liveOrders || []);
    };

    window.addEventListener("storage", syncAdminData);
    window.addEventListener("admin-data-updated", syncAdminData);

    const interval = setInterval(syncAdminData, 1000);

    return () => {
      window.removeEventListener("storage", syncAdminData);
      window.removeEventListener("admin-data-updated", syncAdminData);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        ingredients,
        recipes,
        menuItems,
        orders,
        orderHistory,
        liveOrders,
      })
    );
  }, [
    ingredients,
    recipes,
    menuItems,
    orders,
    orderHistory,
    liveOrders,
    isLoaded,
  ]);

  const lowStockCount = ingredients.filter(
    (item) => item.quantity <= (item.lowStockThreshold ?? 1)
  ).length;

  return (
    <div className="min-h-screen bg-black text-[#F5E6C8] flex">
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

<main className="flex-1 ml-72">
  <TopNavbar setActiveSection={setActiveSection} />
        <div className="p-8">
          <h1 className="text-4xl font-serif mb-2 capitalize">
            {activeSection}
          </h1>

          <p className="text-zinc-500 mb-8">
            Welcome back, Admin! Manage your coffee shop operations.
          </p>

          
          {activeSection === "dashboard" && (
            <>
              <div className="grid grid-cols-4 gap-6 mb-8">
                <StatCard title="Today's Orders" value={orders} />
                <StatCard title="Recipes" value={recipes.length} />
                <StatCard title="Low Stock Items" value={lowStockCount} />
                <StatCard title="Menu Items" value={menuItems.length} />
              </div>

              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-4 space-y-6">
                  <LowStockAlerts ingredients={ingredients} />
                  <RestockSuggestions ingredients={ingredients} />
                </div>

                <div className="col-span-4 space-y-6">
                  <InventoryAnalytics ingredients={ingredients} />
                  <OrderHistory orderHistory={orderHistory} />
                </div>

<div className="col-span-4 space-y-6">
<QuickActions
  setActiveSection={setActiveSection}
/>
  <RecentActivity
    ingredients={ingredients}
    orderHistory={orderHistory}
    liveOrders={liveOrders}
  />
</div>
              </div>
            </>
          )}

          {activeSection === "ingredients" && (
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-6">
                <IngredientList
                  ingredients={ingredients}
                  setIngredients={setIngredients}
                />
              </div>

              <div className="col-span-6 space-y-6">
                <LowStockAlerts ingredients={ingredients} />

                <StockAdjustment
                  ingredients={ingredients}
                  setIngredients={setIngredients}
                />

                <RestockSuggestions ingredients={ingredients} />
              </div>
            </div>
          )}

          {activeSection === "recipes" && (
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-8">
                <RecipeBuilder
                  ingredients={ingredients}
                  recipes={recipes}
                  setRecipes={setRecipes}
                />
              </div>

              <div className="col-span-4">
                <InventoryAnalytics ingredients={ingredients} />
              </div>
            </div>
          )}

          {activeSection === "menu" && (
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-8">
                <MenuManagement
                  recipes={recipes}
                  menuItems={menuItems}
                  setMenuItems={setMenuItems}
                />
              </div>

              <div className="col-span-4">
<QuickActions
  setActiveSection={setActiveSection}
/>              </div>
            </div>
          )}
          {activeSection === "pos" && (
  <POSCounter
    ingredients={ingredients}
    setIngredients={setIngredients}
    recipes={recipes}
    menuItems={menuItems}
    setOrders={setOrders}
    orderHistory={orderHistory}
    setOrderHistory={setOrderHistory}
    liveOrders={liveOrders}
    setLiveOrders={setLiveOrders}
  />
)}

          {activeSection === "inventory" && (
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-4">
                <InventoryAnalytics ingredients={ingredients} />
              </div>

              <div className="col-span-4">
                <StockAdjustment
                  ingredients={ingredients}
                  setIngredients={setIngredients}
                />
              </div>

              <div className="col-span-4">
                <RestockSuggestions ingredients={ingredients} />
              </div>
            </div>
          )}

{activeSection === "orders" && (
  <div className="space-y-6">
    <div className="grid grid-cols-12 gap-6 items-start">
      <div className="col-span-8">
        <LiveOrders
          liveOrders={liveOrders}
          setLiveOrders={setLiveOrders}
          ingredients={ingredients}
          setIngredients={setIngredients}
          recipes={recipes}
          menuItems={menuItems}
          orderHistory={orderHistory}
          setOrderHistory={setOrderHistory}
        />
      </div>

      <div className="col-span-4">
        <OrderHistory orderHistory={orderHistory} />
      </div>
    </div>

    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-3">
        <InventoryAnalytics ingredients={ingredients} />
      </div>

      <div className="col-span-3">
        <SalesAnalytics
          orders={orders}
          orderHistory={orderHistory}
        />
      </div>

      <div className="col-span-3">
        <RestockSuggestions ingredients={ingredients} />
      </div>

      <div className="col-span-3">
        <TopProducts orderHistory={orderHistory} />
      </div>
    </div>
  </div>
)}

{activeSection === "kitchen" && (
  <KitchenDisplay
  liveOrders={liveOrders}
  setLiveOrders={setLiveOrders}
  setActiveSection={setActiveSection}
/>
)}


{activeSection === "suppliers" && (
  <SupplierManagement />
)}

{activeSection === "settings" && (
  <AdminSettings />
)}

{activeSection === "profile" && (
  <AdminProfile />
)}

{activeSection === "activity" && (
  <ActivityLogs />
)}

{activeSection === "analytics" && (
  <>
  <div className="mb-6">
  <RevenueDashboard orderHistory={orderHistory} />
</div>
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-3">
        <InventoryAnalytics ingredients={ingredients} />
      </div>

      <div className="col-span-3">
        <SalesAnalytics
          orders={orders}
          orderHistory={orderHistory}
        />
      </div>

      <div className="col-span-3">
        <RestockSuggestions ingredients={ingredients} />
      </div>

      <div className="col-span-3">
        <TopProducts orderHistory={orderHistory} />
      </div>
    </div>

    <div className="mt-6">
      <InventoryForecasting
        ingredients={ingredients}
        recipes={recipes}
        menuItems={menuItems}
        orderHistory={orderHistory}
      />
    </div>

    <div className="mt-6">
      <RevenueOrdersChart orderHistory={orderHistory} />
    </div>
  </>
)}

        </div>
      </main>
    </div>
  );
}