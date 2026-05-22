const features = [
  {
    color: "#E6A8D9",
    title: "Écriture guidée",
    description: "Des pistes douces pour chaque souvenir. L'IA suggère, vous décidez.",
  },
  {
    color: "#AEE290",
    title: "Groupes privés",
    description: "Partagez vos récits avec vos proches choisis, pas avec le monde.",
  },
  {
    color: "#6481DC",
    title: "Export illimité",
    description: "PDF, ePub, livre imprimé. Vos mots vous appartiennent.",
  },
  {
    color: "#F37E40",
    title: "Sauvegarde pérenne",
    description: "Chiffré de bout en bout. Transmission aux héritiers configurée.",
  },
];

export default function Features() {
  return (
    <section className="bg-[#E5E3D5] py-24 px-6">
      <div className="max-w-[1240px] mx-auto">

        <h2 className="font-display font-medium text-[#22221F] leading-tight mb-4
          text-[36px] sm:text-[48px] lg:text-[56px] max-w-2xl">
          Un outil conçu<br />pour prendre son temps.
        </h2>
        <p className="text-[#585852] text-[16px] mb-16 max-w-2xl">
          Pas d&apos;algorithme qui pousse. Pas de notifications qui arrachent.
          Juste la page, les mots, et les gens qui vous lisent avec soin.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f) => (
            <div key={f.title} className="bg-[#FBFAF4] p-8 flex flex-col gap-4">
              <div className="w-16 h-16" style={{ backgroundColor: f.color }} />
              <h3 className="font-display font-medium text-[#22221F] text-[24px]">{f.title}</h3>
              <p className="text-[#585852] text-[14px] leading-relaxed flex-1">{f.description}</p>
              <span className="text-[13px] font-bold text-[#22221F]">En savoir plus →</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
