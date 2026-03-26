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

  // Create a demo airdrop project to attach tasks to
  const demoProject = await prisma.airdropProject.upsert({
    where: { id: "demo-layeredge" },
    update: {},
    create: {
      id: "demo-layeredge",
      name: "LayerEdge",
      chain: "Ethereum",
      userId: user.id
    }
  });

  await prisma.airdropTask.deleteMany({ where: { projectId: demoProject.id } });

  await prisma.airdropTask.createMany({
    data: [
      {
        projectId: demoProject.id,
        title: "Daily Check-in",
        description: "Claim daily points"
      },
      {
        projectId: demoProject.id, 
        title: "Bridge ETH",
        description: "Bridge at least 0.1 ETH"
      },
      {
        title: "Staking",
        description: "Stake tokens for yield"
      }
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
