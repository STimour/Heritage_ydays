import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-20 bg-[#FBFAF4]/90 backdrop-blur-sm border-b border-[#E5E3D5]">
      <div className="max-w-[1440px] mx-auto px-[60px] h-full flex items-center justify-between">

        <Link href="/">
          <Image src="/images/logo.svg" alt="Héritage Écrit" width={152} height={49} priority />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {["Découvrir", "Comment ça marche", "Tarifs", "Aide"].map((label) => (
            <Link key={label} href="#" className="text-[13px] font-medium text-[#22221F] hover:opacity-60 transition-opacity">
              {label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link href="/login" className="hidden md:block text-[13px] font-medium text-[#22221F] px-4 py-2 hover:opacity-60 transition-opacity">
            Se connecter
          </Link>
          <Link href="/signup" className="text-[13px] font-bold text-[#FBFAF4] bg-[#22221F] px-5 py-2 rounded-[17px] hover:opacity-80 transition-opacity">
            Commencer
          </Link>
        </div>

      </div>
    </nav>
  );
}
