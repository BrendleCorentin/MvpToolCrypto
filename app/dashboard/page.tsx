import { redirect } from "next/navigation";
import Link from "next/link";
import { AddWalletForm } from "@/components/add-wallet-form";
import { DiscordForm } from "@/components/discord-form";
import { LogoutButton } from "@/components/logout-button";
import { WalletTable } from "@/components/wallet-table";
import { getCurrentUser } from "@/lib/auth";
import { formatUsd } from "@/lib/utils";
import { Wallet, Globe, Fuel, TrendingUp, Layers, Activity } from "lucide-react";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const totalUsd = user.wallets.reduce((sum, wallet) => sum + wallet.estimatedUsd, 0);
  const totalWallets = user.wallets.length;
  const chains = new Set(user.wallets.map((wallet) => wallet.chain)).size;

  return (
    <main className="min-h-screen bg-slate-950/50 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950 px-6 py-8">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-8">
        <header className="flex flex-col gap-6 rounded-3xl border border-slate-800 bg-slate-900/60 p-8 shadow-2xl backdrop-blur-xl md:flex-row md:items-center md:justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
             <div className="h-64 w-64 rounded-full bg-indigo-500 blur-[100px]" />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
               <div className="flex items-center justify-center p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                  <Activity className="h-5 w-5 text-indigo-400" />
               </div>
               <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                  Web3 Toolkit <span className="opacity-50 mx-1">|</span> MVP v1.0
               </span>
            </div>
            <h1 className="text-4xl font-black text-white tracking-tight">Welcome back, {user.name}</h1>
            <p className="mt-2 text-slate-400 max-w-lg">Manage your wallets, track airdrops and optimize gas fees from a single command center.</p>
          </div>
          <div className="relative z-10">
             <LogoutButton />
          </div>
        </header>

        <section className="grid gap-6 md:grid-cols-3">
          <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg group hover:border-indigo-500/30 transition-all">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <TrendingUp className="h-24 w-24 text-emerald-400" />
             </div> 
             <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                   <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                      <TrendingUp className="h-5 w-5" />
                   </div>
                   <span className="text-slate-400 text-sm font-semibold uppercase tracking-wider">Total Value</span>
                </div>
                <div className="text-4xl font-black text-white tracking-tight">{formatUsd(totalUsd)}</div>
                <div className="mt-2 text-sm text-emerald-400 font-medium">+12.5% this month</div>
             </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg group hover:border-indigo-500/30 transition-all">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Wallet className="h-24 w-24 text-indigo-400" />
             </div> 
             <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                   <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
                      <Wallet className="h-5 w-5" />
                   </div>
                   <span className="text-slate-400 text-sm font-semibold uppercase tracking-wider">Active Wallets</span>
                </div>
                <div className="text-4xl font-black text-white tracking-tight">{totalWallets}</div>
                <div className="mt-2 text-sm text-indigo-400 font-medium tracking-wide">Across {chains} Networks</div>
             </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg group hover:border-indigo-500/30 transition-all">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Layers className="h-24 w-24 text-amber-400" />
             </div> 
             <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                   <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400">
                      <Layers className="h-5 w-5" />
                   </div>
                   <span className="text-slate-400 text-sm font-semibold uppercase tracking-wider">Chains Tracked</span>
                </div>
                <div className="text-4xl font-black text-white tracking-tight">{chains}</div>
                <div className="mt-2 text-sm text-amber-400 font-medium">Multi-chain support</div>
             </div>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          <Link href="/dashboard/generator" className="group relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/50 p-6 transition-all hover:border-indigo-500/50 hover:bg-slate-900/80 hover:shadow-2xl hover:shadow-indigo-500/10">
            <div className="flex items-start justify-between">
               <div className="rounded-2xl bg-indigo-500/10 p-4 text-indigo-400 group-hover:bg-indigo-500/20 group-hover:text-indigo-300 transition-colors">
                  <Wallet className="h-8 w-8" />
               </div>
               <div className="text-right opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-4 group-hover:translate-x-0">
                  <span className="text-xs font-bold bg-indigo-500 text-white px-2 py-1 rounded-full">NEW</span>
               </div>
            </div>
            <div className="mt-6">
               <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors">Wallet Generator</h3>
               <p className="mt-2 text-sm text-slate-400 font-medium">Mass generate seeds & wallets instantly.</p>
            </div>
          </Link>

          <Link href="/dashboard/airdrops" className="group relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/50 p-6 transition-all hover:border-emerald-500/50 hover:bg-slate-900/80 hover:shadow-2xl hover:shadow-emerald-500/10">
            <div className="flex items-start justify-between">
               <div className="rounded-2xl bg-emerald-500/10 p-4 text-emerald-400 group-hover:bg-emerald-500/20 group-hover:text-emerald-300 transition-colors">
                  <Globe className="h-8 w-8" />
               </div>
            </div>
            <div className="mt-6">
               <h3 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">Airdrop Tracker</h3>
               <p className="mt-2 text-sm text-slate-400 font-medium">Monitor tasks and farm airdrops efficiently.</p>
            </div>
          </Link>

          <Link href="/dashboard/gas" className="group relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/50 p-6 transition-all hover:border-amber-500/50 hover:bg-slate-900/80 hover:shadow-2xl hover:shadow-amber-500/10">
            <div className="flex items-start justify-between">
               <div className="rounded-2xl bg-amber-500/10 p-4 text-amber-400 group-hover:bg-amber-500/20 group-hover:text-amber-300 transition-colors">
                  <Fuel className="h-8 w-8" />
               </div>
            </div>
            <div className="mt-6">
               <h3 className="text-xl font-bold text-white group-hover:text-amber-300 transition-colors">Gas Manager</h3>
               <p className="mt-2 text-sm text-slate-400 font-medium">Disperse & Collect ETH across wallets.</p>
            </div>
          </Link>
        </section>

        <section className="grid gap-8 xl:grid-cols-[1.5fr_1fr]">
          <div className="space-y-8">
            <WalletTable wallets={user.wallets} />
          </div>

          <div className="space-y-8">
            <AddWalletForm />
            <DiscordForm initialWebhook={user.discordSetting?.webhookUrl} />
          </div>
        </section>
      </div>
    </main>
  );
}
