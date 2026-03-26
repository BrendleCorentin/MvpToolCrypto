"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <button 
      onClick={handleLogout} 
      className="group flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-2.5 text-sm font-medium text-slate-300 transition-all hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-400 active:scale-95"
    >
      <LogOut className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
      Logout
    </button>
  );
}
