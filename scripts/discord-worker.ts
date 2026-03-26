import { PrismaClient } from "@prisma/client";

/**
 * Simple worker example to send a Discord alert manually.
 * Usage:
 *   npx tsx scripts/discord-worker.ts
 */

const prisma = new PrismaClient();

async function main() {
  let webhookUrl = process.env.DISCORD_WEBHOOK_URL;

  if (!webhookUrl) {
    console.log("No DISCORD_WEBHOOK_URL in environment, checking database...");
    const setting = await prisma.discordSetting.findFirst({
      where: { enabled: true },
    });
    if (setting) {
      webhookUrl = setting.webhookUrl;
      console.log("Found webhook in database.");
    }
  }

  if (!webhookUrl) {
    console.error("No webhook found in ENV or Database.");
    process.exit(1);
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: "🚀 Web3 Toolkit test alert: your worker pipeline is connected!",
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Discord error: ${response.status} - ${text}`);
    }

    console.log("✅ Discord alert sent successfully.");
  } catch (error) {
    console.error("❌ Failed to send alert:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
