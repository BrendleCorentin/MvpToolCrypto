import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatUsd } from "@/lib/utils";
import { ReceivedAirdropsList } from "@/components/airdrops/received-airdrops";
import { Coins, Trophy, Wallet } from "lucide-react";

export default async function ReceivedAirdropsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const received = await prisma.receivedAirdrop.findMany({
    where: { 
      wallet: {
        userId: user.id
      }
    },
    include: { wallet: true },
    orderBy: { receivedAt: "desc" },
  });

  const totalValue = received.reduce((acc, curr) => acc + curr.usdValue, 0);
  const totalTokens = received.length;

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight">Received Airdrops</h1>
        <p className="text-slate-400 mt-2">History of all claimed rewards and tokens.</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
         <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 p-6 shadow-xl group hover:border-emerald-500/30 transition-all">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Trophy className="h-24 w-24 text-emerald-400" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                  <Coins className="h-5 w-5" />
                </div>
                <span className="text-slate-400 text-sm font-semibold uppercase tracking-wider">Total Value Earned</span>
              </div>
              <div className="text-4xl font-black text-white px-1 tracking-tight">{formatUsd(totalValue)}</div>
            </div>
         </div>

         <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 p-6 shadow-xl group hover:border-indigo-500/30 transition-all">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Wallet className="h-24 w-24 text-indigo-400" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
                  <Wallet className="h-5 w-5" />
                </div>
                <span className="text-slate-400 text-sm font-semibold uppercase tracking-wider">Total Drops Claimed</span>
              </div>
              <div className="text-4xl font-black text-white px-1 tracking-tight">{totalTokens}</div>
            </div>
         </div>
      </div>

      <ReceivedAirdropsList airdrops={received} />
    </div>
  );
}
