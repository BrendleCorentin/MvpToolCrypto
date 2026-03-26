"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Wallet, Coins } from "lucide-react";

export function AddWalletForm() {
  const router = useRouter();
  const [label, setLabel] = useState("");
  const [address, setAddress] = useState("");
  const [chain, setChain] = useState("Ethereum");
  const [tokenSymbol, setTokenSymbol] = useState("ETH");
  const [tokenAmount, setTokenAmount] = useState("0");
  const [estimatedUsd, setEstimatedUsd] = useState("0");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/wallets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          label,
          address,
          chain,
          tokenSymbol,
          tokenAmount: Number(tokenAmount),
          estimatedUsd: Number(estimatedUsd),
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Impossible d'ajouter le wallet.");

      setLabel("");
      setAddress("");
      setChain("Ethereum");
      setTokenSymbol("ETH");
      setTokenAmount("0");
      setEstimatedUsd("0");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900/50 p-6 shadow-xl backdrop-blur-sm relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
        <Wallet className="h-32 w-32 text-indigo-500" />
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
           <Plus className="h-5 w-5" />
        </div>
        <h3 className="text-lg font-bold text-white">Add New Wallet</h3>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1">
            <label className="text-xs font-semibold uppercase text-slate-500 ml-1">Label</label>
            <input 
                value={label} 
                onChange={(e) => setLabel(e.target.value)} 
                required 
                placeholder="My Main Wallet" 
                className="w-full rounded-xl border border-slate-700 bg-slate-950/50 px-4 py-3 text-slate-200 focus:border-indigo-500 focus:bg-slate-950 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-600" 
            />
        </div>
        <div className="space-y-1">
            <label className="text-xs font-semibold uppercase text-slate-500 ml-1">Chain</label>
            <div className="relative">
                <select 
                    value={chain} 
                    onChange={(e) => setChain(e.target.value)} 
                    className="w-full appearance-none rounded-xl border border-slate-700 bg-slate-950/50 px-4 py-3 text-slate-200 focus:border-indigo-500 focus:bg-slate-950 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                >
                  <option>Ethereum</option>
                  <option>Base</option>
                  <option>Polygon</option>
                  <option>Ronin</option>
                  <option>Solana</option>
                  <option>Arbitrum</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                    <Coins className="h-4 w-4" />
                </div>
            </div>
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold uppercase text-slate-500 ml-1">Address</label>
        <input 
            value={address} 
            onChange={(e) => setAddress(e.target.value)} 
            required 
            placeholder="0x..." 
            className="w-full rounded-xl border border-slate-700 bg-slate-950/50 px-4 py-3 text-slate-200 font-mono text-sm focus:border-indigo-500 focus:bg-slate-950 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-600" 
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-1">
            <label className="text-xs font-semibold uppercase text-slate-500 ml-1">Token</label>
            <input 
                value={tokenSymbol} 
                onChange={(e) => setTokenSymbol(e.target.value.toUpperCase())} 
                required 
                placeholder="ETH" 
                className="w-full rounded-xl border border-slate-700 bg-slate-950/50 px-4 py-3 text-slate-200 focus:border-indigo-500 focus:bg-slate-950 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all" 
            />
        </div>
        <div className="space-y-1">
            <label className="text-xs font-semibold uppercase text-slate-500 ml-1">Amount</label>
            <input 
                type="number" 
                step="0.0001" 
                value={tokenAmount} 
                onChange={(e) => setTokenAmount(e.target.value)} 
                required 
                className="w-full rounded-xl border border-slate-700 bg-slate-950/50 px-4 py-3 text-slate-200 focus:border-indigo-500 focus:bg-slate-950 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all" 
            />
        </div>
        <div className="space-y-1">
            <label className="text-xs font-semibold uppercase text-slate-500 ml-1">USD Value</label>
            <input 
                type="number" 
                step="0.01" 
                value={estimatedUsd} 
                onChange={(e) => setEstimatedUsd(e.target.value)} 
                required 
                className="w-full rounded-xl border border-slate-700 bg-slate-950/50 px-4 py-3 text-slate-200 focus:border-indigo-500 focus:bg-slate-950 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all" 
            />
        </div>
      </div>
      
      {error && <p className="text-sm font-medium text-red-400 bg-red-500/10 p-3 rounded-lg border border-red-500/20">{error}</p>}
      
      <button 
        disabled={loading} 
        className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-4 py-3.5 font-bold text-white shadow-lg shadow-indigo-500/25 transition-all hover:from-indigo-500 hover:to-indigo-400 hover:shadow-indigo-500/40 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
            <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white"></span>
                Adding Wallet...
            </span>
        ) : (
            "Add Wallet"
        )}
      </button>
    </form>
  );
}
