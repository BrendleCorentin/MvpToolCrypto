import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Wallet, Target, Trophy, Percent } from "lucide-react";

export default async function WalletProgressPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const wallets = await prisma.wallet.findMany({
    where: { userId: user.id },
    orderBy: { index: "asc" },
    include: {
      taskProgress: {
        where: { status: "DONE" }
      },
      receivedAirdrops: true
    }
  });

  const allProjects = await prisma.airdropProject.findMany({
    where: { userId: user.id },
    include: { tasks: true }
  });

  const totalTasks = allProjects.reduce((acc, p) => acc + p.tasks.length, 0);

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight">Wallet Progress Overview</h1>
        <p className="text-slate-400 mt-2">Track completion rates across all your active wallets.</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
         <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 p-6 shadow-xl group hover:border-indigo-500/30 transition-all">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Wallet className="h-24 w-24 text-indigo-400" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
                  <Wallet className="h-5 w-5" />
                </div>
                <span className="text-slate-400 text-sm font-semibold uppercase tracking-wider">Total Wallets</span>
              </div>
              <div className="text-4xl font-black text-white px-1">{wallets.length}</div>
            </div>
         </div>

         <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 p-6 shadow-xl group hover:border-indigo-500/30 transition-all">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Target className="h-24 w-24 text-indigo-400" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
                  <Target className="h-5 w-5" />
                </div>
                <span className="text-slate-400 text-sm font-semibold uppercase tracking-wider">Available Tasks</span>
              </div>
              <div className="text-4xl font-black text-white px-1">{totalTasks}</div>
            </div>
         </div>

         <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 p-6 shadow-xl group hover:border-emerald-500/30 transition-all">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Percent className="h-24 w-24 text-emerald-400" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                  <Trophy className="h-5 w-5" />
                </div>
                <span className="text-slate-400 text-sm font-semibold uppercase tracking-wider">Global Completion</span>
              </div>
              <div className="text-4xl font-black text-emerald-400 px-1">
                {wallets.length > 0 ? 
                  Math.round((wallets.reduce((acc, w) => acc + w.taskProgress.length, 0) / (totalTasks * wallets.length)) * 100) || 0 
                  : 0}%
              </div>
            </div>
         </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 shadow-2xl">
        <table className="w-full text-left text-sm text-slate-400">
          <thead className="bg-slate-950/80 text-xs uppercase tracking-wider text-slate-500 font-bold backdrop-blur-sm border-b border-slate-800">
            <tr>
              <th className="p-5">Wallet</th>
              <th className="p-5 text-center">Tasks Done</th>
              <th className="p-5 text-center">All Airdrops</th>
              <th className="p-5 text-right">Completion</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {wallets.map((wallet) => {
              const doneCount = wallet.taskProgress.length;
              const percent = totalTasks > 0 ? Math.round((doneCount / totalTasks) * 100) : 0;
              
              return (
                <tr key={wallet.id} className="group hover:bg-slate-800/20 transition-colors">
                  <td className="p-5 font-medium text-slate-200">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-indigo-500/20 group-hover:text-indigo-400 transition-all">
                        <Wallet className="h-5 w-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-base group-hover:text-white transition-colors">{wallet.label || `Wallet ${wallet.index}`}</span>
                        <span className="font-mono text-xs text-slate-500">{wallet.address}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-5 text-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700">
                      {doneCount} <span className="text-slate-500 mx-1">/</span> {totalTasks}
                    </span>
                  </td>
                  <td className="p-5 text-center">
                     {wallet.receivedAirdrops.length > 0 ? (
                       <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                         {wallet.receivedAirdrops.length} received
                       </span>
                     ) : (
                       <span className="text-slate-600">-</span>
                     )}
                  </td>
                  <td className="p-5 text-right align-middle">
                    <div className="flex items-center justify-end gap-3 w-full max-w-[200px] ml-auto">
                      <span className="text-xs font-bold w-8 text-right">{percent}%</span>
                      <div className="flex-1 h-2 rounded-full bg-slate-800 overflow-hidden shadow-inner">
                        <div 
                          className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-500 ease-out" 
                          style={{ width: `${percent}%` }} 
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
