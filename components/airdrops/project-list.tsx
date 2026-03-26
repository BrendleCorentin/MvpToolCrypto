"use client";

import { AirdropProject, AirdropTask } from "@prisma/client";
import { CheckCircle2, Circle } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function ProjectList({ projects }: { projects: (AirdropProject & { tasks: AirdropTask[] })[] }) {
  const router = useRouter();

  if (projects.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500">
        No projects yet. Add one to get started!
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <div 
          key={project.id} 
          onClick={() => router.push(`/dashboard/airdrops/${project.id}`)}
          className="group relative cursor-pointer overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/10"
        >
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 via-indigo-500/0 to-indigo-500/5 transition-opacity group-hover:from-indigo-500/5 group-hover:via-indigo-500/5 group-hover:to-indigo-500/10" />

          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-slate-100 group-hover:text-white">{project.name}</h3>
                <p className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-500">{project.chain}</p>
              </div>
              <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wide
                ${project.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                  project.status === 'Snapshot' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}>
                {project.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 rounded-xl bg-slate-950/50 p-3 mb-4">
              <div className="space-y-1">
                <span className="text-[10px] uppercase text-slate-500 font-semibold">Funding</span>
                <div className="text-sm font-medium text-slate-200">{project.funding || "-"}</div>
              </div>
              <div className="space-y-1 text-right">
                 <span className="text-[10px] uppercase text-slate-500 font-semibold">Potential</span>
                 <div className="text-sm font-medium text-indigo-400">{project.potential || "-"}</div>
              </div>
            </div>
            
            <div className="flex items-center justify-between border-t border-slate-800 pt-4 mt-2">
               <span className="text-xs font-medium text-slate-500 group-hover:text-slate-400 transition-colors">
                 {project.tasks.length} {project.tasks.length === 1 ? 'task' : 'tasks'}
               </span>
               <span className="text-sm font-semibold text-indigo-400 opacity-0 transform translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0">
                 View Details →
               </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
