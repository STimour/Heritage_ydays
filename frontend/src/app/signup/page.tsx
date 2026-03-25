"use client";
import { useState } from "react";
import Link from "next/link";
import { authApi } from "@/lib/api/services";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function SignupPage() {
  const [form, setForm] = useState({ fullName: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");

  return (
    <main className="grid min-h-screen place-items-center p-4">
      <form className="w-full max-w-md space-y-3 rounded-2xl bg-white p-6" onSubmit={async (e) => { e.preventDefault(); if (form.password !== form.confirmPassword) return setError("Les mots de passe ne correspondent pas."); await authApi.signup(form); window.location.href = "/app/discover"; }}>
        <h1 className="text-2xl font-bold">Créer un compte</h1>
        <label className="text-sm">Nom complet<Input required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} /></label>
        <label className="text-sm">Email<Input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
        <label className="text-sm">Mot de passe<Input required type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label>
        <label className="text-sm">Confirmer<Input required type="password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} /></label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" className="w-full">Créer mon compte</Button>
        <p className="text-sm">Déjà inscrit ? <Link className="text-indigo-600" href="/login">Connexion</Link></p>
      </form>
    </main>
  );
}
