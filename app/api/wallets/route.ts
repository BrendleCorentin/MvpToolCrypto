import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const walletSchema = z.object({
  label: z.string().min(1),
  address: z.string().min(8),
  chain: z.string().min(1),
  tokenSymbol: z.string().min(1),
  tokenAmount: z.number().min(0),
  estimatedUsd: z.number().min(0),
});

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = walletSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Wallet invalide." }, { status: 400 });
    }

    const wallet = await prisma.wallet.create({
      data: {
        ...parsed.data,
        userId: user.id,
      },
    });

    return NextResponse.json(wallet, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur serveur.";
    if (message.includes("Unique constraint")) {
      return NextResponse.json({ error: "Ce wallet existe déjà pour cet utilisateur." }, { status: 409 });
    }
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
