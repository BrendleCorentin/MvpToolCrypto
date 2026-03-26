import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const { taskId, walletId, status } = await request.json();

    const progress = await prisma.walletTaskProgress.upsert({
      where: {
        walletId_taskId: {
          walletId,
          taskId,
        },
      },
      update: {
        status,
        completedAt: status === "DONE" ? new Date() : null,
      },
      create: {
        walletId,
        taskId,
        status,
        completedAt: status === "DONE" ? new Date() : null,
      },
    });

    return NextResponse.json(progress);
  } catch (error) {
    console.error(error);
    return new NextResponse("Error updating progress", { status: 500 });
  }
}
