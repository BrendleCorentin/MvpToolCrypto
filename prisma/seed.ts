import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("demo1234", 10);

  const user = await prisma.user.upsert({
    where: { email: "demo@web3toolkit.local" },
    update: {},
    create: {
      email: "demo@web3toolkit.local",
      name: "Demo User",
      passwordHash,
    },
  });

  await prisma.wallet.deleteMany({ where: { userId: user.id } });

  await prisma.wallet.createMany({
    data: [
      {
        userId: user.id,
        label: "Main ETH Wallet",
        address: "0x1234567890abcdef1234567890abcdef12345678",
        chain: "Ethereum",
        tokenSymbol: "ETH",
        tokenAmount: 1.42,
        estimatedUsd: 5230,
      },
      {
        userId: user.id,
        label: "Airdrop Farm #1",
        address: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
        chain: "Base",
        tokenSymbol: "USDC",
        tokenAmount: 840,
        estimatedUsd: 840,
      },
      {
        userId: user.id,
        label: "Gaming Wallet",
        address: "0xbeefbeefbeefbeefbeefbeefbeefbeefbeefbeef",
        chain: "Ronin",
        tokenSymbol: "RON",
        tokenAmount: 120,
        estimatedUsd: 315,
      },
    ],
  });

  await prisma.airdropTask.deleteMany({ where: { userId: user.id } });

  await prisma.airdropTask.createMany({
    data: [
      {
        userId: user.id,
        project: "LayerEdge",
        chain: "Ethereum",
        status: "To do",
        reward: "Unknown",
      },
      {
        userId: user.id,
        project: "Base Ecosystem Campaign",
        chain: "Base",
        status: "In progress",
        reward: "$50-$300 est.",
      },
      {
        userId: user.id,
        project: "Ronin Creator Quest",
        chain: "Ronin",
        status: "Done",
        reward: "NFT badge",
      },
      {
        userId: user.id,
        project: "ZK Wallet Social Quest",
        chain: "zkSync",
        status: "To do",
        reward: "Points",
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
