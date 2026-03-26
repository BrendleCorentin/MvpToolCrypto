"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { AirdropProject, AirdropTask } from "@prisma/client";

export function TaskManager({ project }: { project: AirdropProject & { tasks: AirdropTask[] } }) {
  const [tasks, setTasks] = useState(project.tasks);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAddTask = async () => {
    if (!newTaskTitle) return;
    setLoading(true);

    try {
      const res = await fetch("/api/airdrops/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTaskTitle,
          projectId: project.id,
        }),
      });

      const newTask = await res.json();
      setTasks([...tasks, newTask]);
      setNewTaskTitle("");
      router.refresh();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 rounded-2xl border border-slate-800 bg-slate-900/50 p-6 shadow-xl">
      <h3 className="text-lg font-bold text-white flex items-center gap-2">
        <span className="w-1 h-6 bg-indigo-500 rounded-full"/> Tasks
      </h3>
      
      <div className="flex gap-3">
        <input 
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Add new task..."
          className="flex-1 rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all shadow-inner"
        />
        <button 
          onClick={handleAddTask}
          disabled={loading || !newTaskTitle}
          className="rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-500 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:shadow-none"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>

      <ul className="space-y-3">
        {tasks.map((task) => (
          <li key={task.id} className="group flex items-center justify-between rounded-xl bg-slate-800/40 border border-slate-700/50 p-4 text-sm text-slate-300 transition-all hover:bg-slate-800/60 hover:border-slate-600 hover:shadow-lg hover:-translate-x-1">
             <div className="flex items-center gap-3">
               <div className="h-2 w-2 rounded-full bg-indigo-500/50 group-hover:bg-indigo-400 transition-colors" />
               <span className="font-medium group-hover:text-white transition-colors">{task.title}</span>
             </div>
          </li>
        ))}
        {tasks.length === 0 && (
          <li className="flex flex-col items-center justify-center rounded-xl bg-slate-950/30 border border-dashed border-slate-800 py-8 text-center">
            <div className="rounded-full bg-slate-900 p-3 mb-2">
              <Plus className="h-5 w-5 text-slate-600" />
            </div>
            <p className="text-sm font-medium text-slate-400">No tasks defined yet</p>
            <p className="text-xs text-slate-600 mt-1">Add your first task above</p>
          </li>
        )}
      </ul>
    </div>
  );
}
