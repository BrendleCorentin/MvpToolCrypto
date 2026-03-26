import Link from "next/link";
import { ArrowRight, Bot, Wallet, ShieldCheck, Zap, Terminal, Database, LineChart } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-white selection:bg-indigo-500/30 selection:text-indigo-200 overflow-x-hidden">
      
      {/* Navigation */}
      <header className="fixed top-0 w-full z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">Web3<span className="text-indigo-400">Toolkit</span></span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#about" className="hover:text-white transition-colors">About</a>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Log in
            </Link>
            <Link href="/register" className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-950 hover:bg-slate-200 transition-colors shadow-lg shadow-white/10">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 pt-32 pb-20">
        <div className="container mx-auto px-6 text-center">
            
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-300 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                beta v1.0.2 live
            </div>

            <h1 className="mx-auto max-w-5xl text-5xl font-black tracking-tight md:text-7xl lg:text-8xl bg-gradient-to-b from-white via-white/90 to-white/50 bg-clip-text text-transparent mb-8 drop-shadow-sm animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
              Your Ultimate <br /> 
              <span className="text-indigo-500">Web3 Command Center</span>
            </h1>
            
            <p className="mx-auto max-w-2xl text-lg text-slate-400 mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 leading-relaxed">
              Manage hundreds of wallets, farm airdrops automatically, and track your portfolio worth across all EVM chains. The only tool you need for serious farming.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
              <Link href="/register" className="w-full sm:w-auto group flex items-center justify-center gap-2 rounded-full bg-indigo-600 px-8 py-4 text-base font-bold text-white transition-all hover:bg-indigo-500 hover:scale-105 active:scale-95 shadow-lg shadow-indigo-500/25">
                Start Farming Now
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/login" className="w-full sm:w-auto flex items-center justify-center rounded-full border border-slate-700 bg-slate-900/50 px-8 py-4 text-base font-semibold text-white transition-all hover:bg-slate-800 hover:border-slate-600">
                View Demo
              </Link>
            </div>

            {/* Dashboard Preview */}
            <div className="mt-20 relative mx-auto max-w-6xl rounded-2xl border border-slate-800 bg-slate-900/50 p-2 shadow-2xl backdrop-blur-sm animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500 group">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10"></div>
                
                {/* Mock UI */}
                <div className="rounded-xl bg-slate-950 overflow-hidden relative border border-slate-800 aspect-[16/10] flex flex-col">
                    {/* Mock Header */}
                    <div className="h-14 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900/50">
                        <div className="flex gap-2">
                           <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                           <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/50"></div>
                           <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/50"></div>
                        </div>
                        <div className="h-2 w-32 bg-slate-800 rounded-full"></div>
                    </div>
                    {/* Mock Content */}
                    <div className="p-8 grid grid-cols-3 gap-6 flex-1">
                        <div className="col-span-1 space-y-4">
                            <div className="h-32 rounded-2xl bg-slate-900 border border-slate-800 p-4">
                                <div className="h-8 w-8 rounded-lg bg-indigo-500/20 mb-3"></div>
                                <div className="h-4 w-24 bg-slate-800 rounded mb-2"></div>
                                <div className="h-8 w-16 bg-slate-700 rounded"></div>
                            </div>
                            <div className="h-48 rounded-2xl bg-slate-900 border border-slate-800 p-4 space-y-3">
                                 <div className="h-4 w-full bg-slate-800 rounded"></div>
                                 <div className="h-4 w-3/4 bg-slate-800 rounded"></div>
                                 <div className="h-4 w-5/6 bg-slate-800 rounded"></div>
                            </div>
                        </div>
                        <div className="col-span-2 rounded-2xl bg-slate-900 border border-slate-800 p-6">
                            <div className="flex justify-between mb-6">
                                <div className="h-6 w-32 bg-slate-800 rounded"></div>
                                <div className="h-6 w-20 bg-emerald-900/30 rounded border border-emerald-500/20"></div>
                            </div>
                            <div className="space-y-4">
                                {[1,2,3,4].map(i => (
                                    <div key={i} className="h-12 w-full bg-slate-800/50 rounded-lg flex items-center px-4 justify-between">
                                        <div className="flex gap-4">
                                            <div className="h-6 w-6 rounded-full bg-slate-700"></div>
                                            <div className="h-6 w-32 bg-slate-700 rounded"></div>
                                        </div>
                                        <div className="h-6 w-16 bg-slate-700 rounded"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 rounded-xl border border-slate-700 bg-slate-900 p-4 shadow-xl flex gap-8 z-20">
                     <div className="text-center">
                        <div className="text-2xl font-bold text-white">500+</div>
                        <div className="text-xs text-slate-400 uppercase tracking-widest">Wallets</div>
                     </div>
                     <div className="w-px bg-slate-800"></div>
                     <div className="text-center">
                        <div className="text-2xl font-bold text-indigo-400">$2.4M</div>
                        <div className="text-xs text-slate-400 uppercase tracking-widest">Tracked</div>
                     </div>
                </div>
            </div>
        </div>

        {/* Features Grid */}
        <div id="features" className="container mx-auto px-6 py-32">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-black text-white mb-6">Everything you need to scale</h2>
                <p className="text-slate-400 max-w-2xl mx-auto text-lg">Detailed tracking, automated flows, and industrial-grade security tools.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
                <div className="p-8 rounded-3xl border border-slate-800 bg-slate-900/40 hover:bg-slate-900/60 transition-colors group hover:border-indigo-500/30">
                    <div className="h-14 w-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform duration-500 border border-indigo-500/20">
                        <Wallet className="h-7 w-7" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-white">Multi-Wallet Management</h3>
                    <p className="text-slate-400 leading-relaxed mb-6">Generate thousands of wallets, track balances, and manage private keys securely with local encryption.</p>
                    <ul className="space-y-2 text-sm text-slate-500">
                        <li className="flex gap-2 items-center"><span className="text-indigo-500">•</span> Bulk Generation</li>
                        <li className="flex gap-2 items-center"><span className="text-indigo-500">•</span> Export to Excel/CSV</li>
                    </ul>
                </div>
                <div className="p-8 rounded-3xl border border-slate-800 bg-slate-900/40 hover:bg-slate-900/60 transition-colors group hover:border-emerald-500/30">
                    <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform duration-500 border border-emerald-500/20">
                        <Zap className="h-7 w-7" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-white">Automated Actions</h3>
                    <p className="text-slate-400 leading-relaxed mb-6">Execute complex transaction flows across multiple chains simultaneously. Swap, bridge, and mint in 1-click.</p>
                    <ul className="space-y-2 text-sm text-slate-500">
                        <li className="flex gap-2 items-center"><span className="text-emerald-500">•</span> Auto-bridge</li>
                        <li className="flex gap-2 items-center"><span className="text-emerald-500">•</span> Volume generation</li>
                    </ul>
                </div>
                <div className="p-8 rounded-3xl border border-slate-800 bg-slate-900/40 hover:bg-slate-900/60 transition-colors group hover:border-amber-500/30">
                    <div className="h-14 w-14 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-400 mb-6 group-hover:scale-110 transition-transform duration-500 border border-amber-500/20">
                        <ShieldCheck className="h-7 w-7" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-white">Sybil Protection</h3>
                    <p className="text-slate-400 leading-relaxed mb-6">Smart randomization of amounts, delays, and routes to keep your wallets safe from anti-sybil detection.</p>
                    <ul className="space-y-2 text-sm text-slate-500">
                        <li className="flex gap-2 items-center"><span className="text-amber-500">•</span> Route Randomizer</li>
                        <li className="flex gap-2 items-center"><span className="text-amber-500">•</span> Delay Injection</li>
                    </ul>
                </div>
            </div>
        </div>

        {/* Tech Stack Strip */}
        <div className="border-y border-slate-900 bg-slate-950/50 py-16">
            <div className="container mx-auto px-6 text-center">
                <p className="text-sm font-semibold uppercase tracking-widest text-slate-500 mb-8">Built with modern stack</p>
                <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                   <div className="flex items-center gap-2 text-slate-300 font-bold text-xl"><Terminal className="h-6 w-6"/> Next.js 15</div>
                   <div className="flex items-center gap-2 text-slate-300 font-bold text-xl"><Database className="h-6 w-6"/> PrismaORM</div>
                   <div className="flex items-center gap-2 text-slate-300 font-bold text-xl"><LineChart className="h-6 w-6"/> TailwindCSS</div>
                   <div className="flex items-center gap-2 text-slate-300 font-bold text-xl"><ShieldCheck className="h-6 w-6"/> NextAuth</div>
                </div>
            </div>
        </div>

      </main>

      <footer className="border-t border-slate-900 py-12 bg-slate-950">
          <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-2">
                 <Bot className="h-5 w-5 text-slate-600" />
                 <div className="text-slate-500 text-sm">© 2024 Web3 Toolkit.</div>
              </div>
              <div className="flex gap-6 text-sm text-slate-400">
                  <a href="#" className="hover:text-white transition-colors">Twitter</a>
                  <a href="#" className="hover:text-white transition-colors">Discord</a>
                  <a href="#" className="hover:text-white transition-colors">GitHub</a>
              </div>
          </div>
      </footer>
    </div>
  );
}
