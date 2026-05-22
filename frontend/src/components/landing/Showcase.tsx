const stories = [
  {
    coverColor: "#E6A8D9",
    tag: "Famille",
    title: "Recette du bœuf bourguignon",
    excerpt: "Quelques lignes pour donner envie de lire la suite, une invitation à entrer dans ce récit avec douceur.",
    author: "Famille Martin",
    likes: 56,
  },
  {
    coverColor: "#AEE290",
    tag: "Voyage",
    title: "Tokyo, jour 4",
    excerpt: "Quelques lignes pour donner envie de lire la suite, une invitation à entrer dans ce récit avec douceur.",
    author: "Léa Voyage",
    likes: 178,
  },
  {
    coverColor: "#6481DC",
    tag: "Amour",
    title: "10 ans de mariage",
    excerpt: "Quelques lignes pour donner envie de lire la suite, une invitation à entrer dans ce récit avec douceur.",
    author: "Marc & Sophie",
    likes: 89,
  },
];

export default function Showcase() {
  return (
    <section className="bg-[#FBFAF4] py-24 px-6">
      <div className="max-w-[1240px] mx-auto">

        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="font-display font-medium text-[#22221F] leading-tight
              text-[36px] sm:text-[48px] lg:text-[56px]">
              Des récits<br />qui restent.
            </h2>
            <p className="text-[#585852] text-[16px] mt-3">
              Un aperçu de ce que la communauté partage en ce moment.
            </p>
          </div>
          <span className="text-[13px] font-bold text-[#22221F] whitespace-nowrap">
            Voir le fil →
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.map((s) => (
            <div key={s.title} className="bg-white flex flex-col">
              {/* Cover */}
              <div className="h-40 w-full relative" style={{ backgroundColor: s.coverColor }}>
                <div className="absolute top-3 left-3 bg-[#FBFAF4] px-3 py-1">
                  <span className="text-[10px] font-bold text-[#22221F]">{s.tag}</span>
                </div>
              </div>
              {/* Content */}
              <div className="p-6 flex flex-col gap-3 flex-1">
                <h3 className="font-display font-medium text-[#22221F] text-[24px] leading-tight">
                  {s.title}
                </h3>
                <p className="text-[#585852] text-[14px] leading-relaxed flex-1">
                  {s.excerpt}
                </p>
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full" style={{ backgroundColor: s.coverColor }} />
                    <span className="text-[12px] font-semibold text-[#22221F]">{s.author}</span>
                  </div>
                  <span className="text-[12px] text-[#585852]">♥ {s.likes}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
