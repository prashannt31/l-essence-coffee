"use client";

import { useEffect, useRef, useState } from "react";

import {
  LayoutDashboard,
  ShoppingBag,
  Coffee,
  Leaf,
  PackageCheck,
  BookOpen,
  BarChart3,
  Truck,
  Settings,
  ClipboardList,
  MonitorCheck,
  Receipt,
} from "lucide-react";

type SectionPermission =
  | "dashboard"
  | "orders"
  | "menu"
  | "ingredients"
  | "recipes"
  | "inventory"
  | "analytics"
  | "suppliers"
  | "settings"
  | "profile"
  | "activity"
  | "kitchen"
  | "manage_admins"
  | "pos";

type AdminUser = {
  id: number | string;
  name: string;
  email: string;
  role: "Super Admin" | "Admin";
  status: "Active" | "Inactive";
  permissions: SectionPermission[];
};

type Props = {
  activeSection: string;
  setActiveSection: (section: string) => void;
};

const USERS_KEY = "l-essence-admin-users";
const ACTIVE_ADMIN_KEY = "l-essence-active-admin";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "orders", label: "Orders", icon: ShoppingBag },
  { id: "pos", label: "POS / Walk-In", icon: Receipt },
  { id: "menu", label: "Menu Management", icon: Coffee },
  { id: "ingredients", label: "Ingredients", icon: Leaf },
  { id: "recipes", label: "Recipes", icon: BookOpen },
  { id: "inventory", label: "Inventory", icon: PackageCheck },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "activity", label: "Activity Logs", icon: ClipboardList },
  { id: "kitchen", label: "Kitchen Display", icon: MonitorCheck },
  { id: "suppliers", label: "Suppliers", icon: Truck },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function Sidebar({
  activeSection,
  setActiveSection,
}: Props) {
  const [activeAdmin, setActiveAdmin] = useState<AdminUser | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const loadActiveAdmin = () => {
    const savedUsers = localStorage.getItem(USERS_KEY);
    const savedActive = localStorage.getItem(ACTIVE_ADMIN_KEY);

    if (!savedUsers || !savedActive) return;

    const users: AdminUser[] = JSON.parse(savedUsers);

    const current = users.find(
      (user) => String(user.id) === String(savedActive)
    );

    if (current) {
      setActiveAdmin(current);

      if (
        activeSection !== "profile" &&
        !current.permissions.includes(activeSection as SectionPermission)
      ) {
        setActiveSection(current.permissions[0] || "dashboard");
      }
    }
  };

  useEffect(() => {
    loadActiveAdmin();

    window.addEventListener("admin-permissions-updated", loadActiveAdmin);
    window.addEventListener("storage", loadActiveAdmin);

    return () => {
      window.removeEventListener(
        "admin-permissions-updated",
        loadActiveAdmin
      );
      window.removeEventListener("storage", loadActiveAdmin);
    };
  }, [activeSection]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const visibleNavItems = activeAdmin
    ? navItems.filter((item) =>
        activeAdmin.permissions.includes(item.id as SectionPermission)
      )
    : navItems;

  const logout = () => {
    localStorage.removeItem("admin_authenticated");
    localStorage.removeItem("l_essence_current_user");
    localStorage.removeItem(ACTIVE_ADMIN_KEY);
    window.location.href = "/admin/login";
  };

  return (
    <aside className="w-72 h-screen fixed left-0 top-0 bg-[#080808] border-r border-zinc-800 p-5 flex flex-col overflow-hidden">
      <div className="shrink-0 mb-6">
        <h1 className="text-3xl font-serif text-[#D4AF37]">
          L’ESSENCE
        </h1>

        <p className="text-xs tracking-[0.3em] text-[#D4AF37]/80 mt-1">
          LUXURY COFFEE
        </p>

        {activeAdmin && (
          <div className="mt-5 rounded-xl border border-zinc-800 bg-zinc-900/40 p-3">
            <p className="text-sm font-semibold">
              {activeAdmin.name}
            </p>

            <p
              className={`text-xs mt-1 ${
                activeAdmin.role === "Super Admin"
                  ? "text-[#D4AF37]"
                  : "text-blue-400"
              }`}
            >
              {activeAdmin.role}
            </p>
          </div>
        )}
      </div>

      <nav className="space-y-2 flex-1 overflow-y-auto pr-1 admin-scrollbar">
        {visibleNavItems.map((item) => {
          const Icon = item.icon;
          const active = activeSection === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                active
                  ? "bg-[#D4AF37]/20 text-[#D4AF37]"
                  : "text-[#F5E6C8] hover:bg-zinc-900"
              }`}
            >
              <Icon size={19} />

              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div ref={profileRef} className="shrink-0 mt-4 relative">
        {profileOpen && (
          <div className="absolute bottom-[76px] left-0 w-full bg-[#111111] border border-zinc-800 rounded-2xl overflow-hidden shadow-xl z-50">
            <button
              onClick={() => {
                setProfileOpen(false);
                setActiveSection("profile");
              }}
              className="w-full text-left px-4 py-3 hover:bg-zinc-900 transition"
            >
              My Profile
            </button>

            <button
              onClick={() => {
                localStorage.removeItem("l_essence_current_user");
                localStorage.removeItem(ACTIVE_ADMIN_KEY);
                window.location.href = "/admin/login";
              }}
              className="w-full text-left px-4 py-3 hover:bg-zinc-900 transition"
            >
              Switch Account
            </button>

            <button
              onClick={logout}
              className="w-full text-left px-4 py-3 text-red-400 hover:bg-red-500/10 transition"
            >
              Logout
            </button>
          </div>
        )}

        <button
          onClick={() => setProfileOpen(!profileOpen)}
          className="w-full border border-zinc-800 rounded-2xl p-4 flex items-center gap-3 cursor-pointer hover:bg-zinc-900 transition"
        >
          <div className="h-10 w-10 shrink-0 rounded-full bg-[#D4AF37] text-black flex items-center justify-center font-bold">
            {activeAdmin?.name?.charAt(0) || "P"}
          </div>

          <div className="text-left min-w-0">
            <p className="font-semibold truncate">
              {activeAdmin?.name || "Admin"}
            </p>

            <p className="text-xs text-zinc-500 truncate">
              {activeAdmin?.role || "Administrator"}
            </p>
          </div>
        </button>
      </div>
    </aside>
  );
}
