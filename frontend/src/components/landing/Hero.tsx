import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative bg-[#FBFAF4] overflow-hidden pt-20 min-h-[820px]">

      {/* Blobs — positionnés selon Figma (droite) */}
      <div className="absolute top-[80px] right-[20px] w-80 h-80 rounded-full bg-[#E6A8D9] opacity-60 pointer-events-none" />
      <div className="absolute top-[220px] right-[80px] w-48 h-48 rounded-full bg-[#F37E40] opacity-50 pointer-events-none" />
      <div className="absolute top-[360px] right-[280px] w-40 h-40 rounded-full bg-[#AEE290] opacity-60 pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-[100px] relative">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 border border-[#22221F] rounded-[16px] px-4 py-2 mt-[52px] mb-6">
          <span className="w-2 h-2 rounded-full bg-[#AEE290]" />
          <span className="text-[11px] font-semibold text-[#22221F]">Nouveau · écriture guidée par IA</span>
        </div>

        {/* Titre — max-w calqué sur Figma (1100px sur 1440) */}
        <h1 className="font-display font-medium text-[#22221F] leading-[1.0] mb-6 max-w-full lg:max-w-[52%]
          text-[42px] md:text-[64px] lg:text-[86px] xl:text-[104px]">
          Écrivez ce que l&apos;on n&apos;oublie pas.
        </h1>

        {/* Sous-titre */}
        <p className="text-[#585852] leading-relaxed mb-10 max-w-[560px]
          text-[16px] lg:text-[20px]">
          Vos souvenirs, vos récits, vos héritages — dans un espace calme,
          sans pub, pour celles et ceux qui comptent.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <Link
            href="/signup"
            className="bg-[#22221F] text-[#FBFAF4] text-[15px] font-bold px-8 py-4 rounded-[30px] hover:opacity-80 transition-opacity"
          >
            Commencer gratuitement
          </Link>
          <Link
            href="#demo"
            className="text-[#22221F] text-[15px] font-semibold px-8 py-4 rounded-[30px] border border-[#22221F] hover:bg-[#22221F]/5 transition-colors"
          >
            Voir la démo →
          </Link>
        </div>

        {/* Réassurance */}
        <p className="text-[12px] font-medium text-[#585852] pb-20">
          Sans carte bancaire · Données chiffrées · Export à tout moment
        </p>

        {/* Cartes flottantes — absolues sur la droite, desktop uniquement */}
        <div className="hidden lg:block absolute top-[52px] right-[100px] space-y-4">

          {/* Carte 1 — blanche */}
          <div
            className="w-[353px] bg-white rounded-[20px] border border-[#22221F] p-6 shadow-sm"
            style={{ transform: "rotate(3deg)" }}
          >
            <div className="inline-flex items-center bg-[#E6A8D9] rounded-[11px] px-3 py-1 mb-4">
              <span className="text-[10px] font-bold text-[#22221F]">Transmission</span>
            </div>
            <h3 className="font-display font-medium text-[#22221F] text-[20px] leading-tight mb-3">
              Lettre à mon<br />arrière-petite-fille
            </h3>
            <p className="text-[11px] text-[#585852] leading-relaxed mb-3">
              « Je ne te connaîtrai peut-être jamais, mais je veux que tu saches d&apos;où vient ce courage qui coule dans tes veines. »
            </p>
            <p className="text-[11px] font-bold text-[#22221F]">— Eliane R.</p>
          </div>

          {/* Carte 2 — sombre */}
          <div
            className="w-[328px] bg-[#22221F] rounded-[20px] p-6 shadow-sm ml-6"
            style={{ transform: "rotate(-3deg)" }}
          >
            <div className="inline-flex items-center bg-[#AEE290] rounded-[11px] px-3 py-1 mb-4">
              <span className="text-[10px] font-bold text-[#22221F]">Passé</span>
            </div>
            <h3 className="font-display font-medium text-[#FBFAF4] text-[20px] leading-tight mb-4">
              La maison de<br />mon enfance
            </h3>
            <p className="text-[11px] text-[#E5E3D5]">♥ 124 &nbsp; 💬 18</p>
          </div>

        </div>

      </div>
    </section>
  );
}
