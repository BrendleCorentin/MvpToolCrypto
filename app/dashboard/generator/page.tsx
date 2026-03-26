import { WalletGenerator } from "@/components/wallet-generator";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function GeneratorPage() {
  return (
    <div className="flex flex-col gap-8 max-w-[1600px] mx-auto">
      <div className="flex items-center gap-4">
        <Link 
          href="/dashboard" 
          className="group flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-all active:scale-95"
        >
          <ArrowLeft className="h-5 w-5 group-hover:-translate-x-0.5 transition-transform" />
        </Link>
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Wallet Generator</h1>
          <p className="text-slate-400 mt-1">Create multiple EVM wallets from a single seed phrase.</p>
        </div>
      </div>
      
      <WalletGenerator />
    </div>
  );
}