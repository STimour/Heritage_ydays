import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Héritage",
  description: "Transmettre les histoires qui comptent.",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icons/icon-16x16.svg", sizes: "16x16", type: "image/svg+xml" },
      { url: "/icons/icon-32x32.svg", sizes: "32x32", type: "image/svg+xml" },
    ],
    apple: "/icons/icon-192x192.svg",
  },
};

export const viewport: Viewport = { themeColor: "#4f46e5" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="bg-slate-100 text-slate-900">{children}</body>
    </html>
  );
}
