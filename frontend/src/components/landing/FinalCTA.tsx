import Link from "next/link";

export default function FinalCTA() {
  return (
    <section className="bg-[#FBFAF4] py-16 px-6">
      <div className="max-w-[1240px] mx-auto">

        <div className="relative bg-[#E6A8D9] p-12 sm:p-16 overflow-hidden">

          {/* Blobs décoratifs */}
          <div className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full bg-[#F37E40] blur-2xl opacity-60 pointer-events-none" />
          <div className="absolute top-8 right-32 w-36 h-36 rounded-full bg-[#AEE290] blur-2xl opacity-50 pointer-events-none" />

          <div className="relative">
            <h2 className="font-display font-medium text-[#22221F] leading-tight mb-4
              text-[32px] sm:text-[44px] lg:text-[56px] max-w-2xl">
              Prêt·e à commencer<br />votre premier récit ?
            </h2>
            <p className="text-[#22221F] text-[16px] mb-8">
              Gratuit pour toujours jusqu&apos;à 3 récits. Sans carte bancaire.
            </p>
            <Link href="/signup" className="inline-block bg-[#22221F] text-[#FBFAF4] text-[14px] font-bold px-8 py-4 hover:opacity-80 transition-opacity">
              Écrire mon premier récit
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
