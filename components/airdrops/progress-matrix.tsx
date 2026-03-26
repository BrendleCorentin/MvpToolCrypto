"use client";

import { useState } from "react";
import { Wallet, AirdropTask, WalletTaskProgress } from "@prisma/client";
import { CheckCircle2, Circle } from "lucide-react";
import clsx from "clsx";

type ProgressMatrixProps = {
  wallets: Wallet[];
  tasks: AirdropTask[];
  initialProgress: WalletTaskProgress[]; 
};

export function ProgressMatrix({ wallets, tasks, initialProgress }: ProgressMatrixProps) {
  // Simple in-memory cache for optimistic updates
  const [progressMap, setProgressMap] = useState<Record<string, string>>(() => {
    const map: Record<string, string> = {};
    initialProgress.forEach(p => {
      map[`${p.walletId}-${p.taskId}`] = p.status;
    });
    return map;
  });

  const toggleStatus = async (walletId: string, taskId: string) => {
    const key = `${walletId}-${taskId}`;
    const currentStatus = progressMap[key] || "TODO";
    const newStatus = currentStatus === "TODO" ? "DONE" : "TODO";

    // Optimistic update
    setProgressMap(prev => ({ ...prev, [key]: newStatus }));

    try {
      await fetch("/api/airdrops/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletId, taskId, status: newStatus }),
      });
    } catch (e) {
      console.error("Failed to save progress", e);
      // Revert on error
      setProgressMap(prev => ({ ...prev, [key]: currentStatus }));
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/50 shadow-2xl">
      <div className="overflow-x-auto max-h-[600px] scrollbar-thin scrollbar-thumb-indigo-900 scrollbar-track-slate-900">
        <table className="w-full text-left text-sm text-slate-400 border-collapse">
          <thead className="bg-slate-900/90 text-xs font-bold uppercase tracking-wider text-slate-400 backdrop-blur-sm sticky top-0 z-20 shadow-sm">
            <tr>
              <th className="sticky left-0 z-30 min-w-[180px] bg-slate-900/95 p-4 border-b border-r border-slate-800 backdrop-blur-sm">
                Wallet
              </th>
              {tasks.map(task => (
                <th key={task.id} className="min-w-[140px] max-w-[200px] p-4 text-center border-b border-slate-800 border-l border-slate-800/50">
                  <div className="truncate" title={task.title}>{task.title}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {wallets.map((wallet) => (
              <tr key={wallet.id} className="group hover:bg-slate-800/30 transition-colors">
                <td className="sticky left-0 z-10 p-4 bg-slate-950 group-hover:bg-slate-900/80 transition-colors border-r border-slate-800 shadow-[4px_0_24px_-2px_rgba(0,0,0,0.5)]">
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-200 group-hover:text-indigo-400 transition-colors">{wallet.label || `Wallet ${wallet.index}`}</span>
                    <span className="font-mono text-[10px] text-slate-500">{wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}</span>
                  </div>
                </td>
                {tasks.map(task => {
                  const status = progressMap[`${wallet.id}-${task.id}`] || "TODO";
                  const isDone = status === "DONE";
                  
                  return (
                    <td key={task.id} className="p-4 text-center border-l border-slate-800/30 group-hover:border-slate-700/30">
                      <button 
                        onClick={() => toggleStatus(wallet.id, task.id)}
                        className={clsx(
                          "group/btn relative inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wide transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:ring-offset-2 focus:ring-offset-slate-950",
                          isDone 
                            ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 shadow-[0_0_15px_-3px_rgba(16,185,129,0.3)]" 
                            : "bg-slate-800/50 text-slate-500 hover:bg-slate-700 hover:text-slate-300 border border-slate-700 hover:border-slate-600"
                        )}
                      >
                        {isDone ? (
                           <>
                             <CheckCircle2 className="h-3.5 w-3.5" />
                             <span>Done</span>
                           </>
                        ) : (
                           <>
                             <Circle className="h-3.5 w-3.5 opacity-50 group-hover/btn:opacity-100 transition-opacity" />
                             <span>{status}</span>
                           </>
                        )}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
            {wallets.length === 0 && (
              <tr>
                <td colSpan={tasks.length + 1} className="p-12 text-center text-slate-500">
                  <p className="text-lg font-medium text-slate-400">No wallets connected</p>
                  <p className="text-sm mt-2">Generate or import wallets to start tracking tasks.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
