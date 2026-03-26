"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type AuthFormProps = {
  mode: "login" | "register";
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState(mode === "login" ? "demo@web3toolkit.local" : "");
  const [password, setPassword] = useState(mode === "login" ? "demo1234" : "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Une erreur est survenue.");
      }

      // Force refresh and redirect
      router.refresh(); 
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Erreur inconnue.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {mode === "register" && (
        <div>
          <label className="mb-2 block text-sm text-slate-300">Nom</label>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
            placeholder="Corentin"
          />
        </div>
      )}

      <div>
        <label className="mb-2 block text-sm text-slate-300">Email</label>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm text-slate-300">Mot de passe</label>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
          placeholder="••••••••"
        />
      </div>

      {error && <p className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-2xl bg-indigo-500 px-4 py-3 font-medium text-white transition hover:bg-indigo-400 disabled:opacity-50"
      >
        {loading ? "Chargement..." : mode === "login" ? "Se connecter" : "Créer le compte"}
      </button>
    </form>
  );
}
