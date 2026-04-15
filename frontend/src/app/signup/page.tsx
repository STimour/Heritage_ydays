"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api/services";
import { ApiError } from "@/lib/http/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ fullName: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <main className="grid min-h-screen place-items-center p-4">
      <form
        className="w-full max-w-md space-y-3 rounded-2xl bg-white p-6"
        onSubmit={async (e) => {
          e.preventDefault();
          if (form.password !== form.confirmPassword) {
            setError("Les mots de passe ne correspondent pas.");
            return;
          }
          setLoading(true);
          setError("");
          try {
            await authApi.signup(form);
            router.push("/app/discover");
            router.refresh();
          } catch (err) {
            if (err instanceof ApiError) {
              setError(err.message);
            } else {
              setError("Impossible de créer le compte.");
            }
          } finally {
            setLoading(false);
          }
        }}
      >
        <h1 className="text-2xl font-bold">Créer un compte</h1>
        <label className="text-sm">Nom complet<Input required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} /></label>
        <label className="text-sm">Email<Input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
        <label className="text-sm">Mot de passe<Input required type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label>
        <label className="text-sm">Confirmer<Input required type="password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} /></label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button disabled={loading} type="submit" className="w-full">{loading ? "Création..." : "Créer mon compte"}</Button>
        <p className="text-sm">Déjà inscrit ? <Link className="text-indigo-600" href="/login">Connexion</Link></p>
      </form>
    </main>
  );
}
