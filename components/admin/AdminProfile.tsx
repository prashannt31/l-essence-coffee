"use client";

import { useEffect, useState } from "react";
import { addActivityLog } from "./ActivityLogs";

type AdminUser = {
  id: number;
  name: string;
  email: string;
  username: string;
  password: string;
  role: "Super Admin" | "Admin";
};

export default function AdminProfile() {
  const [user, setUser] = useState<AdminUser | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const users = JSON.parse(
      localStorage.getItem("l-essence-admin-users") || "[]"
    );

    const activeId = Number(
      localStorage.getItem("l-essence-active-admin")
    );

    const current = users.find(
      (u: AdminUser) => u.id === activeId
    );

    if (current) {
      setUser(current);
    }
  }, []);

  const changePassword = () => {
    if (!user) return;

    if (currentPassword !== user.password) {
      alert("Current password is incorrect");
      return;
    }

    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const users = JSON.parse(
      localStorage.getItem("l-essence-admin-users") || "[]"
    );

    const updatedUsers = users.map((u: AdminUser) =>
      u.id === user.id
        ? { ...u, password: newPassword }
        : u
    );

    localStorage.setItem(
      "l-essence-admin-users",
      JSON.stringify(updatedUsers)
    );

    setUser({
      ...user,
      password: newPassword,
    });

    alert("Password Updated Successfully");
    addActivityLog("Changed Password", user.name);

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="bg-[#111111] border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-2xl font-semibold mb-6">
          My Profile
        </h2>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-zinc-500 text-sm">
              Name
            </p>

            <p>{user.name}</p>
          </div>

          <div>
            <p className="text-zinc-500 text-sm">
              Email
            </p>

            <p>{user.email}</p>
          </div>

          <div>
            <p className="text-zinc-500 text-sm">
              Username
            </p>

            <p>{user.username}</p>
          </div>

          <div>
            <p className="text-zinc-500 text-sm">
              Role
            </p>

            <p className="text-[#D4AF37]">
              {user.role}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-[#111111] border border-zinc-800 rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-5">
          Change Password
        </h3>

        <div className="space-y-4">
          <input
            type="password"
            placeholder="Current Password"
            value={currentPassword}
            onChange={(e) =>
              setCurrentPassword(e.target.value)
            }
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-[#D4AF37]"
          />

          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) =>
              setNewPassword(e.target.value)
            }
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-[#D4AF37]"
          />

          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(e.target.value)
            }
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-[#D4AF37]"
          />

          <button
            onClick={changePassword}
            className="bg-[#D4AF37] text-black px-5 py-3 rounded-xl font-semibold"
          >
            Update Password
          </button>
        </div>
      </div>
    </div>
  );
}