import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { TaskManager } from "@/components/airdrops/task-manager";
import { ProgressMatrix } from "@/components/airdrops/progress-matrix";
import { ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";

export default async function ProjectDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) return null;

  const project = await prisma.airdropProject.findFirst({
    where: { id: id, userId: user.id },
    include: { tasks: true },
  });

  if (!project) notFound();

  const wallets = await prisma.wallet.findMany({
    where: { userId: user.id },
    orderBy: { index: "asc" },
  });

  // Fetch all progress records for these tasks
  const progressEntries = await prisma.walletTaskProgress.findMany({
    where: {
      walletId: { in: wallets.map(w => w.id) },
      taskId: { in: project.tasks.map(t => t.id) },
    },
  });

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto">
      <div>
        <Link href="/dashboard/airdrops" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-indigo-400 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to List
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tight">{project.name}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-slate-400">
               <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">{project.chain}</span>
               <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border
                ${project.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                  project.status === 'Snapshot' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                {project.status}
              </span>
               {project.funding && <span className="text-emerald-400 text-sm font-semibold flex items-center gap-1">💰 {project.funding}</span>}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column: Details & Tasks */}
        <div className="space-y-8 lg:col-span-1">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 space-y-6 shadow-xl">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-1 h-6 bg-indigo-500 rounded-full"/> Project Info
            </h3>
            
            <div className="space-y-4">
              {project.description && (
                <div>
                  <label className="text-xs uppercase text-slate-500 font-bold tracking-wider">Description</label>
                  <p className="text-sm text-slate-300 mt-1 leading-relaxed">{project.description}</p>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                {project.potential && (
                  <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800">
                    <label className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">Potential</label>
                    <p className="text-sm font-semibold text-indigo-400 mt-0.5">{project.potential}</p>
                  </div>
                )}

                {project.difficulty && (
                  <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800">
                    <label className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">Difficulty</label>
                    <p className="text-sm font-semibold text-white mt-0.5">{project.difficulty}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <TaskManager project={project} />
        </div>

        {/* Right Column: Progress Matrix */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-lg font-bold text-white">Wallet Progress</h3>
            <span className="text-xs font-semibold text-slate-500 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
              {wallets.length} wallets • {project.tasks.length} tasks
            </span>
          </div>
          
          <ProgressMatrix 
            wallets={wallets} 
            tasks={project.tasks} 
            initialProgress={progressEntries} 
          />
        </div>
      </div>
    </div>
  );
}
