import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AddProjectForm } from "@/components/airdrops/add-project-form";
import { ProjectList } from "@/components/airdrops/project-list";

export default async function AirdropsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const projects = await prisma.airdropProject.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: { tasks: true },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Airdrop Opportunities</h1>
          <p className="text-slate-400">Track and manage your airdrop farming strategies.</p>
        </div>
        <AddProjectForm />
      </div>

      <ProjectList projects={projects} />
    </div>
  );
}
