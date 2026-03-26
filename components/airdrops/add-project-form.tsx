"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

export function AddProjectForm() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    try {
      await fetch("/api/airdrops/projects", {
        method: "POST",
        body: JSON.stringify(data),
      });
      setIsOpen(false);
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="group relative flex items-center gap-2 overflow-hidden rounded-xl bg-indigo-600 px-5 py-2.5 font-bold text-white shadow-lg shadow-indigo-500/30 transition-all hover:bg-indigo-500 hover:scale-105 hover:shadow-indigo-500/50 active:scale-95"
      >
        <span className="relative z-10 flex items-center gap-2">
          <Plus className="h-5 w-5" /> 
          <span className="tracking-wide">Add Project</span>
        </span>
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 opacity-0 transition-opacity group-hover:opacity-100" />
      </button>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-900/90 p-6 shadow-2xl backdrop-blur-xl transition-all animate-in fade-in zoom-in-95 duration-200">
      <div className="mb-4 flex items-center justify-between">
         <h3 className="text-lg font-bold text-white">New Airdrop Project</h3>
         <button onClick={() => setIsOpen(false)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
            <Plus className="h-5 w-5 rotate-45" />
         </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase text-slate-500 ml-1">Project Name</label>
            <input name="name" placeholder="e.g. ZkSync" className="w-full rounded-xl border border-slate-700 bg-slate-950/50 px-4 py-3 text-slate-200 focus:border-indigo-500 focus:bg-slate-950 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all" required />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase text-slate-500 ml-1">Chain</label>
            <input name="chain" placeholder="e.g. Ethereum" className="w-full rounded-xl border border-slate-700 bg-slate-950/50 px-4 py-3 text-slate-200 focus:border-indigo-500 focus:bg-slate-950 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all" required />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase text-slate-500 ml-1">Funding</label>
            <input name="funding" placeholder="$10M" className="w-full rounded-xl border border-slate-700 bg-slate-950/50 px-4 py-3 text-slate-200 focus:border-indigo-500 focus:bg-slate-950 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase text-slate-500 ml-1">Potential</label>
            <input name="potential" placeholder="$$$" className="w-full rounded-xl border border-slate-700 bg-slate-950/50 px-4 py-3 text-slate-200 focus:border-indigo-500 focus:bg-slate-950 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase text-slate-500 ml-1">Status</label>
            <select name="status" className="w-full rounded-xl border border-slate-700 bg-slate-950/50 px-4 py-3 text-slate-200 focus:border-indigo-500 focus:bg-slate-950 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all appearance-none">
              <option value="Active">Active</option>
              <option value="Snapshot">Snapshot</option>
              <option value="Ended">Ended</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase text-slate-500 ml-1">Difficulty</label>
            <select name="difficulty" className="w-full rounded-xl border border-slate-700 bg-slate-950/50 px-4 py-3 text-slate-200 focus:border-indigo-500 focus:bg-slate-950 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all appearance-none">
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={() => setIsOpen(false)} className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">Cancel</button>
          <button disabled={loading} className="rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-500 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50">
            {loading ? "Saving..." : "Save Project"}
          </button>
        </div>
      </form>
    </div>
  );
}
