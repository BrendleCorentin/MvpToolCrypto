"use client";

import { Wallet } from "@prisma/client";
import { formatUsd, shortenAddress } from "@/lib/utils";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { RefreshCw } from "lucide-react";

export function WalletTable({ wallets }: { wallets: Wallet[] }) {
  const [balances, setBalances] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchBalances = async () => {
    setLoading(true);
    // Switch to a public RPC that doesn't require an API key
    const provider = new ethers.JsonRpcProvider("https://eth.llamarpc.com");
    const newBalances: Record<string, string> = {};

    try {
      await Promise.all(
        wallets.map(async (wallet) => {
          try {
            const bal = await provider.getBalance(wallet.address);
            newBalances[wallet.id] = ethers.formatEther(bal);
          } catch (e) {
            console.error(e);
            newBalances[wallet.id] = "Error";
          }
        })
      );
      setBalances(newBalances);
      setLastUpdate(new Date());
    } catch (error) {
      console.error("Failed to fetch balances", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch only on explicit user request or first load? 
  // Let's do first load for UX
  useEffect(() => {
    if (wallets.length > 0) {
        fetchBalances();
    }
  }, [wallets]);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 shadow-2xl backdrop-blur-sm">
      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/80 px-6 py-4">
         <div className="flex items-center gap-3">
             <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
                <RefreshCw className="h-4 w-4 text-indigo-400" />
             </div>
             <h3 className="font-bold text-slate-200">Connected Wallets</h3>
         </div>
         <button 
           onClick={fetchBalances}
           disabled={loading}
           className="group flex items-center gap-2 rounded-lg bg-slate-800 border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
         >
           <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin text-indigo-400" : "group-hover:rotate-180 transition-transform duration-500"}`} />
           {loading ? "Syncing..." : "Refresh Balances"}
         </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-950/80 text-xs uppercase tracking-wider text-slate-500 font-bold border-b border-slate-800">
            <tr>
              <th className="px-6 py-4 font-semibold text-slate-400">Label</th>
              <th className="px-6 py-4 font-semibold text-slate-400">Address</th>
              <th className="px-6 py-4 font-semibold text-slate-400 text-right">Balance</th>
              <th className="px-6 py-4 font-semibold text-slate-400 text-right">Portfolio Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {wallets.map((wallet) => {
                const balance = balances[wallet.id];
                const ethVal = parseFloat(balance) || 0;
                const isLoaded = balance && balance !== "Error";
                
                return (
                  <tr key={wallet.id} className="group hover:bg-slate-800/20 transition-colors">
                    <td className="px-6 py-4">
                        <div className="flex flex-col">
                            <span className="font-semibold text-slate-200 group-hover:text-white transition-colors">{wallet.label}</span>
                            <span className="inline-flex w-fit items-center rounded-md bg-slate-800 px-2 py-0.5 text-[0.65rem] font-medium text-slate-400 border border-slate-700/50 mt-1">{wallet.chain}</span>
                        </div>
                    </td>
                    <td className="px-6 py-4">
                        <span className="font-mono text-xs text-slate-500 bg-slate-950/50 px-2 py-1 rounded border border-slate-800 group-hover:border-slate-700 transition-colors cursor-pointer hover:text-indigo-400" title={wallet.address}>
                            {shortenAddress(wallet.address)}
                        </span>
                    </td>
                    <td className="px-6 py-4 text-right font-mono font-medium">
                        {isLoaded ? (
                            <span className="inline-block bg-emerald-500/10 px-2 py-1 rounded text-emerald-400 border border-emerald-500/20 text-xs">
                                {parseFloat(balance).toFixed(4)} ETH
                            </span>
                        ) : (
                            <span className="text-slate-600 text-xs">{balance === "Error" ? "Err" : "-"}</span>
                        )}
                    </td>
                    <td className="px-6 py-4 text-right">
                        <span className="font-bold text-slate-200">
                            {isLoaded ? formatUsd(ethVal * 3500) : formatUsd(wallet.estimatedUsd || 0)}
                        </span>
                    </td>
                  </tr>
                );
            })}
            {wallets.length === 0 && (
                <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                        No wallets added yet. Use the form to track your first wallet.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
