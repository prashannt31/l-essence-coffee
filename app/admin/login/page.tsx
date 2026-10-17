"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(false);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(true);
        return;
      }

      const localUser = {
        id: 1,
        name: data.user.name,
        email: data.user.email,
        username: data.user.username,
        password: data.user.password,
        role: data.user.role,
        status: data.user.status,
        permissions: data.user.permissions || [
          "dashboard",
          "orders",
          "menu",
          "ingredients",
          "recipes",
          "inventory",
          "analytics",
          "activity",
          "suppliers",
          "settings",
          "kitchen",
          "manage_admins",
        ],
      };

      localStorage.setItem("admin_authenticated", "true");

      localStorage.setItem(
        "l-essence-active-admin",
        String(localUser.id)
      );

      localStorage.setItem(
        "l_essence_current_user",
        JSON.stringify(localUser)
      );

      localStorage.setItem(
        "l-essence-admin-users",
        JSON.stringify([localUser])
      );

      router.push("/admin/dashboard");
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6">
      <h1
        className="text-3xl tracking-[0.2em] uppercase font-light text-[#CACBA7] mb-2"
        style={{ fontFamily: "'Cormorant Garamond', serif" }}
      >
        L-ESSENCE
      </h1>

      <p className="text-[9px] tracking-[0.4em] uppercase text-[#6D8575] mb-12">
        Administrative Access
      </p>

      <form
        onSubmit={handleLogin}
        className="w-full max-w-[300px] flex flex-col gap-4"
      >
        <input
          type="text"
          placeholder="USERNAME"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            setError(false);
          }}
          className="w-full bg-transparent border-b border-white/20 p-2 text-[10px] tracking-[0.2em] text-white outline-none focus:border-[#CACBA7]"
        />

        <input
          type="password"
          placeholder="PASSWORD"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError(false);
          }}
          className="w-full bg-transparent border-b border-white/20 p-2 text-[10px] tracking-[0.2em] text-white outline-none focus:border-[#CACBA7]"
        />

        {error && (
          <p className="text-[9px] text-red-500 tracking-widest uppercase">
            Invalid Credentials
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-6 py-4 border border-[#CACBA7]/30 text-[#CACBA7] text-[10px] tracking-[0.3em] uppercase hover:bg-[#CACBA7] hover:text-black transition-all disabled:opacity-50"
        >
          {loading ? "Authenticating..." : "Authenticate"}
        </button>
      </form>
    </div>
  );
}