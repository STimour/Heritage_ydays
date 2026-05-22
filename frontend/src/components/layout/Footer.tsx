const columns = [
  {
    title: "Produit",
    links: ["Fonctionnalités", "Tarifs", "Nouveautés", "Feuille de route"],
  },
  {
    title: "Ressources",
    links: ["Aide", "Blog", "Communauté", "Exemples"],
  },
  {
    title: "Entreprise",
    links: ["À propos", "Contact", "Presse", "Carrières"],
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#22221F] py-12 px-6">
      <div className="max-w-[1240px] mx-auto">

        <div className="flex flex-col md:flex-row justify-between gap-10 mb-10">
          <div>
            <p className="font-display font-medium text-[#FBFAF4] text-[22px] mb-2">héritage écrit.</p>
            <p className="text-[#E5E3D5] text-[12px] max-w-[160px] leading-relaxed">
              Des mots qui restent,<br />pour ceux qui comptent.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
            {columns.map((col) => (
              <div key={col.title}>
                <p className="text-[11px] font-bold text-[#FBFAF4] mb-3">{col.title}</p>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-[11px] text-[#E5E3D5] hover:text-white transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-[#585852] pt-6">
          <p className="text-[10px] text-[#585852]">
            © 2026 Héritage Écrit · Paris · Fait avec soin
          </p>
        </div>

      </div>
    </footer>
  );
}
