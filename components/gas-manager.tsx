"use client";

import { useState } from "react";
import { ethers } from "ethers";
import { Wallet } from "@prisma/client";
import { ArrowRightLeft, Fuel, Download, Upload } from "lucide-react";

export function GasManager({ wallets }: { wallets: Wallet[] }) {
  const [mainPrivateKey, setMainPrivateKey] = useState("");
  const [amountToSend, setAmountToSend] = useState("0.001");
  const [rpcUrl, setRpcUrl] = useState("https://eth.llamarpc.com");
  const [status, setStatus] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const disperseEth = async () => {
    if (!mainPrivateKey) return setStatus("Main Private Key required");
    setIsProcessing(true);
    setStatus("Starting dispersion...");

    try {
      const provider = new ethers.JsonRpcProvider(rpcUrl);
      const masterWallet = new ethers.Wallet(mainPrivateKey, provider);
      
      let successCount = 0;
      for (const wallet of wallets) {
        try {
          setStatus(`Sending to ${wallet.address.slice(0,6)}...`);
          const tx = await masterWallet.sendTransaction({
            to: wallet.address,
            value: ethers.parseEther(amountToSend)
          });
          await tx.wait();
          successCount++;
        } catch (e) {
          console.error(e);
        }
      }
      setStatus(`Sent to ${successCount}/${wallets.length} wallets`);
    } catch (e) {
      console.error(e);
      setStatus("Error during dispersion");
    } finally {
      setIsProcessing(false);
    }
  };

  const collectEth = async () => {
    setIsProcessing(true);
    setStatus("Starting collection...");
    
    try {
      const provider = new ethers.JsonRpcProvider(rpcUrl);
      
      // Determine main wallet address from input PK or just ask user destination
      // For now assume user wants to collect TO the wallet derived from mainPrivateKey
      if (!mainPrivateKey) {
         setStatus("Main Private Key (Destination) source required to verify address or sign commands?");
         // Actually for collection we need EACH wallet's PK to sign the send tx.
         // We only have PKs if they were stored in DB.
      }
      
      const destinationAddress = new ethers.Wallet(mainPrivateKey).address; // simplified derivation
      let successCount = 0;

      for (const wallet of wallets) {
        if (!wallet.privateKey) continue; // Skip if no PK stored
        
        try {
          const signer = new ethers.Wallet(wallet.privateKey, provider);
          const balance = await provider.getBalance(wallet.address);
          
          // Estimate gas
          const gasPrice = (await provider.getFeeData()).gasPrice || ethers.parseUnits("20", "gwei");
          const gasLimit = 21000n;
          const gasCost = gasPrice * gasLimit;
          
          if (balance > gasCost) {
            setStatus(`Draining ${wallet.address.slice(0,6)}...`);
            const valueToSend = balance - gasCost;
            
            const tx = await signer.sendTransaction({
              to: destinationAddress,
              value: valueToSend,
              gasLimit,
              gasPrice // Legacy for simplicity or use maxFeePerGas
            });
            await tx.wait();
            successCount++;
          }
        } catch (e) {
          console.error(e);
        }
      }
      setStatus(`Collected from ${successCount} wallets`);
    } catch (e) {
      console.error(e);
      setStatus("Error during collection: " + (e as any).message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* Disperse Module */}
      <div className="relative overflow-hidden rounded-[2rem] border border-indigo-500/20 bg-slate-900/60 p-8 shadow-xl backdrop-blur-sm transition-all hover:bg-slate-900/80">
        <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-indigo-500/10 blur-3xl"></div>
        
        <div className="mb-6 flex items-center gap-3">
           <div className="rounded-lg bg-indigo-500/10 p-2 text-indigo-400">
             <Upload className="h-6 w-6" />
           </div>
           <div>
             <h2 className="text-xl font-bold text-white">Disperse ETH</h2>
             <p className="text-sm text-slate-400">Send ETH to all tracked wallets simultaneously.</p>
           </div>
        </div>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Source Private Key</label>
            <input 
              type="password"
              value={mainPrivateKey}
              onChange={(e) => setMainPrivateKey(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4 text-slate-200 placeholder-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
              placeholder="0x..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Amount per Wallet (ETH)</label>
            <div className="relative">
              <input 
                type="text"
                value={amountToSend}
                onChange={(e) => setAmountToSend(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4 pr-12 text-slate-200 placeholder-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 font-medium text-slate-500">ETH</span>
            </div>
          </div>

          <div className="rounded-xl bg-indigo-500/5 p-4 border border-indigo-500/10">
             <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">Wallets to fund</span>
                <span className="text-white font-medium">{wallets.length}</span>
             </div>
             <div className="flex justify-between text-sm">
                <span className="text-slate-400">Total Calculation</span>
                <span className="text-indigo-300 font-medium">~ {(parseFloat(amountToSend || "0") * wallets.length).toFixed(4)} ETH + Gas</span>
             </div>
          </div>

          <button
            onClick={disperseEth}
            disabled={isProcessing}
            className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 py-4 font-bold text-white shadow-lg shadow-indigo-500/20 transition-all hover:from-indigo-500 hover:to-indigo-400 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? "Processing Transaction..." : "Distribute ETH"}
          </button>
        </div>
      </div>

      {/* Collect Module */}
      <div className="relative overflow-hidden rounded-[2rem] border border-emerald-500/20 bg-slate-900/60 p-8 shadow-xl backdrop-blur-sm transition-all hover:bg-slate-900/80">
        <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-emerald-500/10 blur-3xl"></div>

        <div className="mb-6 flex items-center gap-3">
           <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-400">
             <Download className="h-6 w-6" />
           </div>
           <div>
             <h2 className="text-xl font-bold text-white">Collect ETH</h2>
             <p className="text-sm text-slate-400">Sweep all funds back to the main wallet.</p>
           </div>
        </div>
        
        <div className="space-y-6">
           <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-6">
             <p className="text-sm font-medium text-emerald-300 mb-4">
               Safety Check: This will drain all available ETH (minus gas fees) from tracked wallets that have a stored private key.
             </p>
             <div className="space-y-2 text-sm">
               <div className="flex justify-between">
                 <span className="text-slate-400">Wallets with Keys</span>
                 <span className="font-mono text-emerald-400">{wallets.filter(w => w.privateKey).length} / {wallets.length}</span>
               </div>
               <div className="flex justify-between">
                 <span className="text-slate-400">Target Destination</span>
                 <span className="font-mono text-slate-300 truncate max-w-[150px]">{mainPrivateKey ? "Derived from Source Key" : "Source Key Required"}</span>
               </div>
             </div>
           </div>

           <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Confirmation (Required for Safety)</label>
             {/* Re-using the input state from Disperse for "Source/Master" key which acts as destination here for MVP simplicity */}
             {/* In a real app we might want separate destination address field */}
             <div className="p-3 bg-slate-950 rounded-lg text-xs text-slate-500 border border-slate-800">
                To enable collection, please ensure the "Source Private Key" in the Disperse module is filled. Funds will be sent to that address.
             </div>
           </div>
           
           <button
            onClick={collectEth}
            disabled={isProcessing || !mainPrivateKey}
            className="w-full rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 py-4 font-bold text-white shadow-lg shadow-emerald-500/20 transition-all hover:from-emerald-500 hover:to-emerald-400 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? "Sweeping Wallets..." : "Recover All Funds"}
          </button>
        </div>
      </div>
      
      {status && (
        <div className="lg:col-span-2 mt-4 flex items-center justify-center rounded-xl border border-slate-800 bg-slate-950 py-4">
           <p className="font-mono text-sm text-indigo-400 animate-pulse">{status}</p>
        </div>
      )}
    </div>
  );
}