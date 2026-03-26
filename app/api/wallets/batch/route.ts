import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const batchWalletSchema = z.object({
  wallets: z.array(z.object({
    index: z.number(),
    address: z.string(),
    privateKey: z.string(),
    mnemonic: z.string(),
  })),
});

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return new NextResponse("Unauthorized", { status: 401 });

    const body = await req.json();
    const { wallets } = batchWalletSchema.parse(body);

    // Create many wallets
    // Prisma createMany is faster
    await prisma.wallet.createMany({
      data: wallets.map(w => ({
        userId: user.id,
        address: w.address,
        privateKey: w.privateKey,
        mnemonic: w.mnemonic,
        index: w.index,
        label: `Generated Wallet #${w.index}`,
        chain: "Ethereum", // Default
        tokenSymbol: "ETH",
        tokenAmount: 0,
        estimatedUsd: 0,
      })),
    });

    return NextResponse.json({ success: true, count: wallets.length });
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}