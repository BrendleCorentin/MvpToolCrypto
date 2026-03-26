"use client";

import { useState } from "react";
import { ethers } from "ethers";
import { Wallet } from "@prisma/client";
import { RefreshCw, Send, Wallet as WalletIcon } from "lucide-react";
import { formatUsd } from "@/lib/utils";

// Minimal ERC20 ABI for balance check
const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
];

export function AirdropTracker({ wallets }: { wallets: Wallet[] }) {
  const [balances, setBalances] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [rpcUrl, setRpcUrl] = useState("https://eth.llamarpc.com"); 

  const checkBalances = async () => {
    setLoading(true);
    const newBalances: Record<string, string> = {};
    
    try {
      const provider = new ethers.JsonRpcProvider(rpcUrl);
      
      const promises = wallets.map(async (wallet) => {
        try {
          // Check Native Balance (ETH)
          const balance = await provider.getBalance(wallet.address);
          const formatted = ethers.formatEther(balance);
          newBalances[wallet.address] = formatted;
        } catch (e) {
          console.error(`Failed to fetch for ${wallet.address}`, e);
          newBalances[wallet.address] = "Error";
        }
      });

      await Promise.all(promises);
      setBalances(newBalances);
    } catch (e) {
      console.error("Provider error", e);
    } finally {
      setLoading(false);
    }
  };


  const transfer = async (wallet: Wallet) => {
    if (!wallet.privateKey) return alert("No private key for this wallet");
    const dest = prompt("Enter destination address:");
    if (!dest || !ethers.isAddress(dest)) return alert("Invalid address");
    
    try {
      setLoading(true);
      const provider = new ethers.JsonRpcProvider(rpcUrl);
      const signer = new ethers.Wallet(wallet.privateKey, provider);
      const tx = await signer.sendTransaction({
        to: dest,
        value: ethers.parseEther(balances[wallet.address] || "0") - BigInt(21000 * 20000000000) // Rough gas deduction
      });
      await tx.wait();
      alert("Sent! Tx: " + tx.hash);
      checkBalances();
    } catch (e) {
      console.error(e);
      alert("Error sending");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-slate-800 bg-slate-900/60 p-8 shadow-xl backdrop-blur-sm">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="flex-1 space-y-2">
             <label className="text-sm font-medium text-slate-300">RPC Endpoint (EVM)</label>
             <div className="relative">
                <input 
                  type="text" 
                  value={rpcUrl} 
                  onChange={(e) => setRpcUrl(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-4 pr-12 text-slate-200 placeholder-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
                  placeholder="https://..."
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                   <div className={`h-2 w-2 rounded-full ${loading ? 'bg-indigo-400 animate-pulse' : 'bg-emerald-500'}`}></div>
                </div>
             </div>
          </div>
          <button
            onClick={checkBalances}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all hover:bg-indigo-500 active:scale-[0.98] disabled:opacity-50 disabled:shadow-none"
          >
            <RefreshCw className={`h-5 w-5 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Scanning..." : "Scan Balances"}
          </button>
        </div>
      
        <div className="mt-8 overflow-hidden rounded-xl border border-slate-800 bg-slate-950/50">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-900/80 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-6 py-4 font-bold">Wallet Label</th>
                <th className="px-6 py-4 font-bold">Address</th>
                <th className="px-6 py-4 font-bold text-right">Native Balance</th>
                <th className="px-6 py-4 font-bold text-right">Est. Value</th>
                <th className="px-6 py-4 font-bold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {wallets.map((wallet) => {
                const hasBalance =  balances[wallet.address] && parseFloat(balances[wallet.address]) > 0;
                return (
                  <tr key={wallet.id} className="group hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-slate-400 group-hover:bg-indigo-500/20 group-hover:text-indigo-400 transition-colors">
                          <WalletIcon className="h-4 w-4" />
                        </div>
                        {wallet.label}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="rounded-md bg-slate-900 px-2 py-1 font-mono text-xs text-slate-400 group-hover:text-slate-300 transition-colors">
                        {wallet.address}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`font-mono font-medium ${hasBalance ? 'text-emerald-400' : 'text-slate-500'}`}>
                        {balances[wallet.address] ? `${parseFloat(balances[wallet.address]).toFixed(4)} ETH` : "-"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-slate-400">
                      {balances[wallet.address] && balances[wallet.address] !== "Error" 
                        ? formatUsd(parseFloat(balances[wallet.address]) * 3500) 
                        : "-"}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button 
                        onClick={() => transfer(wallet)}
                        className="rounded-lg p-2 text-slate-500 hover:bg-indigo-500/10 hover:text-indigo-400 transition-all active:scale-95" 
                        title="Quick Send"
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {wallets.length === 0 && (
            <div className="p-8 text-center text-slate-500">
              No wallets tracked yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}