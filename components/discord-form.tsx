"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type DiscordFormProps = {
  initialWebhook?: string;
};

export function DiscordForm({ initialWebhook = "" }: DiscordFormProps) {
  const router = useRouter();
  const [webhookUrl, setWebhookUrl] = useState(initialWebhook);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/settings/discord", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ webhookUrl }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Erreur Discord.");
      setMessage("Webhook sauvegardé.");
      router.refresh();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Erreur inconnue.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-[1.5rem] border border-slate-800 bg-slate-900/60 p-5">
      <h3 className="text-lg font-semibold">Discord alerts</h3>
      <input
        value={webhookUrl}
        onChange={(e) => setWebhookUrl(e.target.value)}
        placeholder="https://discord.com/api/webhooks/..."
        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3"
      />
      {message && <p className="text-sm text-slate-300">{message}</p>}
      <button disabled={loading} className="rounded-xl bg-emerald-500 px-4 py-3 font-medium hover:bg-emerald-400 disabled:opacity-50">
        {loading ? "Saving..." : "Sauvegarder"}
      </button>
    </form>
  );
}
