"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/app/discover", label: "Accueil", icon: "⌂" },
  { href: "/app/saved", label: "Mes sauvegardes", icon: "▣" },
  { href: "/app/groups", label: "Les groupes", icon: "◎" },
  { href: "/app/library", label: "Ma bibliothèque", icon: "▤" },
  { href: "/app/network", label: "Mon réseau", icon: "◉" },
  { href: "/app/profile", label: "Profil", icon: "◌" },
];

export function AppShell({ title, children, actions }: { title: string; children: React.ReactNode; actions?: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto flex max-w-[1400px]">
        <aside className="hidden min-h-screen w-64 border-r border-slate-200 bg-slate-100 p-5 lg:block">
          <div className="mb-8 h-14 rounded-lg bg-indigo-100" />
          <nav className="space-y-2">
            {nav.map(({ href, label, icon }) => (
              <Link key={href} href={href} className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${pathname === href ? "bg-white font-semibold" : "hover:bg-white"}`}>
                <span>{icon}</span> {label}
              </Link>
            ))}
          </nav>
          <Link href="/app/stories/new" className="mt-10 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">
            Écrire une histoire +
          </Link>
        </aside>
        <main className="flex-1 p-4 md:p-8">
          <header className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2 lg:hidden">☰</div>
            <h1 className="text-3xl font-bold">{title}</h1>
            <div>{actions}</div>
          </header>
          {children}
        </main>
      </div>
    </div>
  );
}
