import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  webhookUrl: z.string().url().or(z.literal("")),
});

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Webhook invalide." }, { status: 400 });
    }

    const setting = await prisma.discordSetting.upsert({
      where: { userId: user.id },
      update: {
        webhookUrl: parsed.data.webhookUrl,
        enabled: parsed.data.webhookUrl.length > 0,
      },
      create: {
        userId: user.id,
        webhookUrl: parsed.data.webhookUrl,
        enabled: parsed.data.webhookUrl.length > 0,
      },
    });

    return NextResponse.json(setting);
  } catch {
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
