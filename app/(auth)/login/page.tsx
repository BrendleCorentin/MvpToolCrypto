import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { getCurrentUser } from "@/lib/auth";

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-10">
      <div className="w-full max-w-md rounded-[2rem] border border-slate-800 bg-slate-900/70 p-8">
        <p className="mb-2 text-sm uppercase tracking-[0.25em] text-indigo-300">Login</p>
        <h1 className="text-3xl font-bold">Connecte-toi</h1>
        <p className="mt-3 text-sm text-slate-300">Compte démo disponible directement prérempli.</p>
        <div className="mt-8">
          <AuthForm mode="login" />
        </div>
        <p className="mt-6 text-sm text-slate-400">
          Pas encore de compte ? <Link href="/register" className="text-indigo-300 hover:text-indigo-200">Inscription</Link>
        </p>
      </div>
    </main>
  );
}
