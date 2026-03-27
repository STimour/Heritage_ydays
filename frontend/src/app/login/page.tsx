"use client";
import Link from "next/link";
import { useState } from "react";
import { authApi } from "@/lib/api/services";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  return (
    <main className="grid min-h-screen place-items-center p-4">
      <form className="w-full max-w-md space-y-3 rounded-2xl bg-white p-6" onSubmit={async (e) => { e.preventDefault(); try { await authApi.login({ email, password }); window.location.href = "/app/discover"; } catch { setError("Identifiants invalides."); } }}>
        <h1 className="text-2xl font-bold">Connexion</h1>
        <label className="text-sm">Email<Input value={email} onChange={(e) => setEmail(e.target.value)} required type="email" /></label>
        <label className="text-sm">Mot de passe<Input value={password} onChange={(e) => setPassword(e.target.value)} required type="password" /></label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" className="w-full">Se connecter</Button>
        <p className="text-sm">Pas de compte ? <Link className="text-indigo-600" href="/signup">S’inscrire</Link></p>
      </form>
    </main>
  );
}
