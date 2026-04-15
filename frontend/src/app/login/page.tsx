"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api/services";
import { ApiError } from "@/lib/http/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <main className="grid min-h-screen place-items-center p-4">
      <form
        className="w-full max-w-md space-y-3 rounded-2xl bg-white p-6"
        onSubmit={async (e) => {
          e.preventDefault();
          setLoading(true);
          setError("");
          try {
            await authApi.login({ email, password });
            router.push("/app/discover");
            router.refresh();
          } catch (err) {
            if (err instanceof ApiError) {
              setError(err.message);
            } else {
              setError("Identifiants invalides.");
            }
          } finally {
            setLoading(false);
          }
        }}
      >
        <h1 className="text-2xl font-bold">Connexion</h1>
        <label className="text-sm">Email<Input value={email} onChange={(e) => setEmail(e.target.value)} required type="email" /></label>
        <label className="text-sm">Mot de passe<Input value={password} onChange={(e) => setPassword(e.target.value)} required type="password" /></label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button disabled={loading} type="submit" className="w-full">{loading ? "Connexion..." : "Se connecter"}</Button>
        <p className="text-sm">Pas de compte ? <Link className="text-indigo-600" href="/signup">S’inscrire</Link></p>
      </form>
    </main>
  );
}
