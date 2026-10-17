"use client";
import { addActivityLog } from "../admin/ActivityLogs";

import { useEffect, useState } from "react";

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
    | "manage_admins";;

type AdminUser = {
  id: number;
  name: string;
  email: string;

  username: string;
  password: string;

  role: "Super Admin" | "Admin";
  status: "Active" | "Inactive";
  permissions: SectionPermission[];
};

const USERS_KEY = "l-essence-admin-users";
const ACTIVE_ADMIN_KEY = "l-essence-active-admin";

const allPermissions: SectionPermission[] = [
  "dashboard",
  "orders",
  "menu",
  "ingredients",
  "recipes",
  "inventory",
  "analytics",
  "suppliers",
  "settings",
  "profile",
  "kitchen",
  "manage_admins",
];

const defaultUsers: AdminUser[] = [
{
  id: 1,
  name: "Owner",
  email: "owner@lessence.com",

  username: "owner",
  password: "owner123",

  role: "Super Admin",
  status: "Active",

  permissions: [
    "dashboard",
    "orders",
    "menu",
    "ingredients",
    "recipes",
    "inventory",
    "analytics",
    "suppliers",
    "settings",
    "manage_admins",
  ],
},
  {
    id: 2,
    name: "Cafe Staff",
    email: "staff@lessence.com",
    username: "staff",
    password: "staff123",
    role: "Admin",
    status: "Active",
    permissions: ["dashboard", "orders", "inventory", "ingredients"],
  },
];

export default function AdminSettings() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [activeAdminId, setActiveAdminId] = useState<number>(1);

  const [form, setForm] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
  });

  useEffect(() => {
    const savedUsers = localStorage.getItem(USERS_KEY);
    const savedActive = localStorage.getItem(ACTIVE_ADMIN_KEY);

    if (savedUsers) {
      setAdmins(JSON.parse(savedUsers));
    } else {
      setAdmins(defaultUsers);
      localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
    }

    if (savedActive) {
      setActiveAdminId(Number(savedActive));
    } else {
      localStorage.setItem(ACTIVE_ADMIN_KEY, "1");
    }
  }, []);
  
  useEffect(() => {
  const existing = localStorage.getItem("l-essence-admin-users");

  if (!existing) {
    localStorage.setItem(
      "l-essence-admin-users",
      JSON.stringify([
        {
          id: 1,
          name: "Owner",
          email: "owner@lessence.com",
          username: "owner",
          password: "owner123",
          role: "Super Admin",
          status: "Active",
          permissions: [
            "dashboard",
            "orders",
            "menu",
            "ingredients",
            "recipes",
            "inventory",
            "analytics",
            "suppliers",
            "settings",
          ],
        },
      ])
    );
  }
}, []);

  useEffect(() => {
    if (admins.length === 0) return;

    localStorage.setItem(USERS_KEY, JSON.stringify(admins));
    localStorage.setItem(ACTIVE_ADMIN_KEY, String(activeAdminId));
    window.dispatchEvent(new Event("admin-permissions-updated"));
  }, [admins, activeAdminId]);

  const activeAdmin = admins.find((admin) => admin.id === activeAdminId);
const canManageAdmins =
  activeAdmin?.role === "Super Admin" ||
  activeAdmin?.permissions.includes("manage_admins");
const addAdmin = () => {
  const name = form.name.trim();
  const email = form.email.trim();
  const username = form.username.trim();
  const password = form.password.trim();

  if (!name || !email || !username || !password) {
    alert("Please fill name, email, username and password.");
    return;
  }

  const usernameExists = admins.some(
    (admin) =>
      (admin.username || "").toLowerCase() === username.toLowerCase()
  );

  if (usernameExists) {
    alert("Username already exists. Choose another username.");
    return;
  }

  const newAdmin: AdminUser = {
    id: Date.now(),
    name,
    email,
    username,
    password,
    role: "Admin",
    status: "Active",
    permissions: ["dashboard", "orders"],
  };

  setAdmins((prev) => [...prev, newAdmin]);
  addActivityLog("Created Staff Admin", newAdmin.name);

  setForm({
    name: "",
    email: "",
    username: "",
    password: "",
  });
};

  const deleteAdmin = (id: number) => {
    const admin = admins.find((item) => item.id === id);

    if (admin?.role === "Super Admin") {
      alert("Super Admin cannot be deleted.");
      return;
    }

    setAdmins(admins.filter((item) => item.id !== id));
  };

  const togglePermission = (
    adminId: number,
    permission: SectionPermission
  ) => {
    setAdmins((prev) =>
      prev.map((admin) => {
        if (admin.id !== adminId) return admin;
        if (admin.role === "Super Admin") return admin;

        const hasPermission = admin.permissions.includes(permission);

        return {
          ...admin,
          permissions: hasPermission
            ? admin.permissions.filter((item) => item !== permission)
            : [...admin.permissions, permission],
        };
      })
    );
  };

  const toggleStatus = (adminId: number) => {
    setAdmins((prev) =>
      prev.map((admin) => {
        if (admin.id !== adminId) return admin;
        if (admin.role === "Super Admin") return admin;

        return {
          ...admin,
          status: admin.status === "Active" ? "Inactive" : "Active",
        };
      })
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#111111] border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-2">Admin Control Center</h2>

        <p className="text-sm text-zinc-500 mb-6">
          Super Admin is the owner. Admins are cafe staff with limited access.
        </p>

        <div className="grid grid-cols-3 gap-4">
            {activeAdmin?.role === "Super Admin" && (
  <div>
          <div>
            <p className="text-xs text-zinc-500 mb-2">Active Login</p>

            <select
              value={activeAdminId}
              onChange={(e) => setActiveAdminId(Number(e.target.value))}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-[#D4AF37]"
            >
              {admins.map((admin) => (
                <option key={admin.id} value={admin.id}>
                  {admin.name} — {admin.role}
                </option>
              ))}
            </select>
          </div>
          </div>)}

          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
            <p className="text-xs text-zinc-500">Current Role</p>
            <p className="text-[#D4AF37] font-semibold mt-1">
              {activeAdmin?.role}
            </p>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
            <p className="text-xs text-zinc-500">Access Level</p>
            <p className="text-green-400 font-semibold mt-1">
{activeAdmin?.role === "Super Admin"
  ? "Full Access"
  : "Limited Staff Access"}            </p>
          </div>
        </div>
      </div>

{canManageAdmins && (
            <div className="bg-[#111111] border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-6">Create Staff Admin</h2>

          <div className="grid grid-cols-4 gap-3">
            <input
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
              placeholder="Staff Name"
              className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-[#D4AF37]"
            />

            <input
              value={form.email}
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value,
                })
              }
              placeholder="Email"
              className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-[#D4AF37]"
            />

            <input
              value={form.username}
              onChange={(e) =>
                setForm({
                  ...form,
                  username: e.target.value,
                })
              }
              placeholder="Username"
              className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-[#D4AF37]"
            />

            <input
              value={form.password}
              onChange={(e) =>
                setForm({
                  ...form,
                  password: e.target.value,
                })
              }
              placeholder="Password"
              className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-[#D4AF37]"
            />
          </div>

          <button
            onClick={addAdmin}
            className="mt-4 bg-[#D4AF37] text-black rounded-xl font-semibold px-6 py-3"
          >
            Create Admin Login
          </button>
        </div>
      )}

      <div className="bg-[#111111] border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-6">Admin Access Control</h2>

        <div className="space-y-4">
          {admins.map((admin) => (
            <div
              key={admin.id}
              className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-5"
            >
              <div className="flex justify-between gap-4">
                <div>
                  <p className="font-semibold">{admin.name}</p>
                  <p className="text-sm text-zinc-500">{admin.email}</p>

                  <p className="text-xs text-zinc-500 mt-1">
                    Username:{" "}
                    <span className="text-[#D4AF37]">
                      {admin.username}
                    </span>{" "}
                    • Password:{" "}
                    <span className="text-[#D4AF37]">
                      {admin.password}
                    </span>
                  </p>

                  <p
                    className={`text-xs mt-1 ${
                      admin.role === "Super Admin"
                        ? "text-[#D4AF37]"
                        : "text-blue-400"
                    }`}
                  >
                    {admin.role} • {admin.status}
                  </p>
                </div>

{canManageAdmins && admin.role !== "Super Admin" && (
                      <div className="flex gap-3">
                    <button
                      onClick={() => toggleStatus(admin.id)}
                      className="text-yellow-400 text-sm hover:text-yellow-300"
                    >
                      {admin.status === "Active" ? "Disable" : "Enable"}
                    </button>

                    <button
                      onClick={() => deleteAdmin(admin.id)}
                      className="text-red-400 text-sm hover:text-red-500"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-3 mt-5">
                {allPermissions.map((permission) => (
                  <label
                    key={permission}
                    className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm capitalize ${
                      admin.permissions.includes(permission)
                        ? "border-[#D4AF37] text-[#D4AF37]"
                        : "border-zinc-800 text-zinc-500"
                    } ${
                      !canManageAdmins || admin.role === "Super Admin"
                        ? "opacity-70 cursor-not-allowed"
                        : "cursor-pointer"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={admin.permissions.includes(permission)}
disabled={!canManageAdmins || admin.role === "Super Admin"}
                      onChange={() =>
                        togglePermission(admin.id, permission)
                      }
                    />

                    {permission}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}