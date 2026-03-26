import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user) return new NextResponse("Unauthorized", { status: 401 });

  const projects = await prisma.airdropProject.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: { tasks: true },
  });

  return NextResponse.json(projects);
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const json = await request.json();
    const project = await prisma.airdropProject.create({
      data: {
        ...json,
        userId: user.id,
        score: parseInt(json.score || "0"),
      },
    });
    return NextResponse.json(project);
  } catch (error) {
    return new NextResponse("Error creating project", { status: 500 });
  }
}
