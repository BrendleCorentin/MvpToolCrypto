"use client";

import { useState } from "react";
import { ethers } from "ethers";
import { Copy, Download, Save, RefreshCw } from "lucide-react";

type GeneratedWallet = {
  index: number;
  address: string;
  privateKey: string;
  mnemonic: string;
};

export function WalletGenerator() {
  const [mnemonic, setMnemonic] = useState<string>("");
  const [wallets, setWallets] = useState<GeneratedWallet[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState("");
  const [count, setCount] = useState<number>(50);

  const generateSeed = () => {
    const wallet = ethers.Wallet.createRandom();
    if (wallet.mnemonic) {
      setMnemonic(wallet.mnemonic.phrase);
      setWallets([]);
      setStatus("New seed generated");
    }
  };

  const generateWallets = async () => {
    if (!mnemonic) return;
    setIsGenerating(true);
    setStatus("Generating wallets...");
    
    // Use setTimeout to allow UI update
    setTimeout(async () => {
      try {
        const newWallets: GeneratedWallet[] = [];
        // Create the master node at the derivation path level for accounts (m/44'/60'/0'/0)
        // Then derive indices from there to avoid re-deriving from root every time
        const mnemonicObj = ethers.Mnemonic.fromPhrase(mnemonic);
        const masterNode = ethers.HDNodeWallet.fromMnemonic(mnemonicObj, "m/44'/60'/0'/0");
        
        for (let i = 0; i < count; i++) {
          const child = masterNode.deriveChild(i);
          newWallets.push({
            index: i,
            address: child.address,
            privateKey: child.privateKey,
            mnemonic: mnemonic,
          });
        }
        setWallets(newWallets);
        setStatus(`Generated ${count} wallets`);
      } catch (error) {
        console.error(error);
        setStatus("Error generating wallets");
      } finally {
        setIsGenerating(false);
      }
    }, 100);
  };


  const exportCSV = () => {
    if (wallets.length === 0) return;
    
    const headers = "Index,Address,PrivateKey,Mnemonic\n";
    const rows = wallets.map(w => `${w.index},${w.address},${w.privateKey},${w.mnemonic}`).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `wallets_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const saveToDatabase = async () => {
    if (wallets.length === 0) return;
    setStatus("Saving to database...");
    
    try {
      const res = await fetch("/api/wallets/batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wallets }),
      });
      
      if (res.ok) {
        setStatus("Saved to database!");
      } else {
        setStatus("Failed to save.");
      }
    } catch (e) {
      console.error(e);
      setStatus("Error saving.");
    }
  };

  return (
    <div className="space-y-8">
      <div className="rounded-[2rem] border border-slate-800 bg-slate-900/60 p-8 shadow-xl backdrop-blur-sm transition-all hover:bg-slate-900/80">
        <div className="mb-6 flex items-center gap-3">
           <div className="rounded-lg bg-indigo-500/10 p-2 text-indigo-400">
             <RefreshCw className="h-6 w-6" />
           </div>
           <div>
             <h2 className="text-xl font-bold text-white">Seed & Wallet Generation</h2>
             <p className="text-sm text-slate-400">Generate a master mnemonic and derive up to {count} ETH wallets.</p>
           </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-300">Master Mnemonic Phrase</label>
            <div className="relative">
              <textarea
                value={mnemonic}
                onChange={(e) => setMnemonic(e.target.value)}
                className="w-full h-32 resize-none rounded-xl border border-slate-700 bg-slate-950 p-4 text-slate-200 placeholder-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
                placeholder="Enter existing mnemonic or generate new..."
              />
              <div className="absolute bottom-4 right-4 flex gap-2">
                <button
                  onClick={generateSeed}
                  className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-700 border border-slate-700 transition-colors"
                >
                  Regenerate New
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col justify-between space-y-4">
            <div className="rounded-xl border border-dashed border-slate-700 bg-slate-900/30 p-6">
               <div className="mb-4 flex items-center justify-between">
                 <h3 className="text-sm font-semibold text-white">Actions</h3>
                 <div className="flex items-center gap-2">
                   <span className="text-xs text-slate-400">Count:</span>
                    <input 
                      type="number" 
                      min="1" 
                      max="1000"
                      value={count} 
                      onChange={(e) => setCount(Number(e.target.value))}
                      className="w-16 rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-center text-sm text-white focus:border-indigo-500 focus:outline-none"
                    />
                 </div>
               </div>
               <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={generateWallets}
                    disabled={!mnemonic || isGenerating}
                    className="col-span-2 flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-500 px-4 py-3 font-semibold text-white shadow-lg transition-transform active:scale-[0.98] hover:from-indigo-500 hover:to-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGenerating ? <RefreshCw className="h-5 w-5 animate-spin"/> : <RefreshCw className="h-5 w-5" />}
                    Generate {count} Wallets
                  </button>
                  
                  <button
                    onClick={saveToDatabase}
                    disabled={wallets.length === 0}
                    className="flex items-center justify-center gap-2 rounded-lg bg-emerald-600/10 border border-emerald-600/20 px-4 py-3 font-medium text-emerald-400 hover:bg-emerald-600/20 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Save className="h-4 w-4" />
                    Save to DB
                  </button>

                  <button
                    onClick={exportCSV}
                    disabled={wallets.length === 0}
                    className="flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 font-medium text-slate-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Download className="h-4 w-4" />
                    CSV
                  </button>

                  <button
                    onClick={() => {
                      const text = wallets.map(w => w.privateKey).join("\n");
                      const blob = new Blob([text], { type: "text/plain" });
                      const url = URL.createObjectURL(blob);
                      const link = document.createElement("a");
                      link.href = url;
                      link.download = "private_keys.txt";
                      link.click();
                    }}
                    disabled={wallets.length === 0}
                    className="flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 font-medium text-slate-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Download className="h-4 w-4" />
                    Keys
                  </button>

                  <button
                    onClick={() => {
                        const blob = new Blob([mnemonic], { type: "text/plain" });
                        const url = URL.createObjectURL(blob);
                        const link = document.createElement("a");
                        link.href = url;
                        link.download = "mnemonic.txt";
                        link.click();
                    }}
                    disabled={!mnemonic}
                    className="flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 font-medium text-slate-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Download className="h-4 w-4" />
                    Mnemonic
                  </button>
               </div>
               {status && (
                 <div className="mt-4 flex items-center justify-center rounded-lg bg-slate-950 py-2 border border-slate-800">
                    <p className="text-sm text-indigo-400 font-mono animate-pulse">{status}</p>
                 </div>
               )}
            </div>
          </div>
        </div>
      </div>

      {wallets.length > 0 && (
        <div className="rounded-[2rem] border border-slate-800 bg-slate-900/60 overflow-hidden shadow-xl">
           <div className="border-b border-slate-800 px-8 py-4 bg-slate-900/80">
              <h3 className="font-semibold text-white">Generated Wallets ({wallets.length})</h3>
           </div>
           <div className="max-h-[500px] overflow-y-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="sticky top-0 bg-slate-950 text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-6 py-4 font-bold">Index</th>
                  <th className="px-6 py-4 font-bold">Address</th>
                  <th className="px-6 py-4 font-bold">Private Key</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {wallets.map((w) => (
                  <tr key={w.index} className="group hover:bg-indigo-500/5 transition-colors">
                    <td className="px-6 py-3 font-mono text-slate-500 text-xs">m/44'/60'/0'/0/{w.index}</td>
                    <td className="px-6 py-3 font-mono text-slate-300 select-all">{w.address}</td>
                    <td className="px-6 py-3 font-mono text-slate-600 text-xs truncate max-w-[200px] select-all group-hover:text-slate-400 transition-colors">{w.privateKey}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}