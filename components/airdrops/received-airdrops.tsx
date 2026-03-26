"use client";

import { ReceivedAirdrop } from "@prisma/client";
import { formatUsd } from "@/lib/utils";
import { TrendingUp, Calendar, Coins } from "lucide-react";

export function ReceivedAirdropsList({ airdrops }: { airdrops: ReceivedAirdrop[] }) {
  if (airdrops.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500 border border-dashed border-slate-800 rounded-2xl bg-slate-900/20">
        <Coins className="h-12 w-12 mb-4 text-slate-700" />
        <h3 className="text-lg font-semibold text-slate-400">No airdrops recorded yet</h3>
        <p className="text-sm">Keep grinding tasks to earn rewards!</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 shadow-2xl">
      <table className="w-full text-left text-sm text-slate-400">
        <thead className="bg-slate-950/80 text-xs uppercase tracking-wider text-slate-500 font-bold backdrop-blur-sm border-b border-slate-800">
          <tr>
            <th className="p-5 font-semibold">Token</th>
            <th className="p-5 text-right font-semibold">Amount</th>
            <th className="p-5 text-right font-semibold">Value (USD)</th>
            <th className="p-5 text-right font-semibold">Date Received</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/50">
          {airdrops.map((drop) => (
            <tr key={drop.id} className="group hover:bg-slate-800/20 transition-colors">
              <td className="p-5 font-medium text-slate-200">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-bold group-hover:bg-indigo-500/20 transition-colors border border-indigo-500/20">
                    {drop.tokenSymbol.slice(0, 2)}
                  </div>
                  <div>
                    <div className="font-bold text-base group-hover:text-indigo-300 transition-colors">{drop.tokenSymbol}</div>
                    <div className="text-xs text-slate-500">Token Airdrop</div>
                  </div>
                </div>
              </td>
              <td className="p-5 text-right">
                 <span className="font-mono text-slate-300 font-medium bg-slate-800/50 px-2 py-1 rounded-md border border-slate-700/50">
                    {drop.amount.toLocaleString()}
                 </span>
              </td>
              <td className="p-5 text-right">
                <div className="flex items-center justify-end gap-2 text-emerald-400 font-bold">
                    <TrendingUp className="h-3 w-3" />
                    {formatUsd(drop.usdValue)}
                </div>
              </td>
              <td className="p-5 text-right">
                <div className="flex items-center justify-end gap-2 text-slate-500 text-xs font-medium">
                    <Calendar className="h-3 w-3" />
                    {new Date(drop.receivedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
