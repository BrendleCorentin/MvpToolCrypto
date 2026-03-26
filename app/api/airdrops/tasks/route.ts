import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const json = await request.json();
    const task = await prisma.airdropTask.create({
      data: {
        title: json.title,
        description: json.description,
        projectId: json.projectId,
      },
    });
    return NextResponse.json(task);
  } catch (error) {
    console.error(error);
    return new NextResponse("Error creating task", { status: 500 });
  }
}
