export default function Testimonial() {
  return (
    <section className="bg-[#22221F] py-24 px-6 relative overflow-hidden">
      <div className="max-w-[1240px] mx-auto">

        {/* Guillemet décoratif */}
        <span className="font-display font-bold text-[#E6A8D9] leading-none select-none
          text-[120px] sm:text-[180px] absolute top-4 left-6 opacity-80">
          "
        </span>

        <div className="relative pt-16 sm:pt-20">
          <blockquote className="font-display font-medium text-[#FBFAF4] leading-tight mb-10
            text-[24px] sm:text-[32px] lg:text-[38px] max-w-4xl">
            Pour la première fois, mes enfants m&apos;ont demandé de raconter —
            parce qu&apos;ils savaient que ça resterait.
          </blockquote>

          <div className="flex items-center gap-4 mb-10">
            <div className="w-14 h-14 rounded-full bg-[#E6A8D9] flex items-center justify-center">
              <span className="text-[16px] font-bold text-[#22221F]">MA</span>
            </div>
            <div>
              <p className="text-[15px] font-bold text-[#FBFAF4]">Marguerite Achard</p>
              <p className="text-[12px] text-[#E5E3D5]">82 ans · Bretagne · 12 récits publiés</p>
            </div>
          </div>

          {/* Dots pagination */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-2 bg-[#E6A8D9] rounded-full" />
            <div className="w-2 h-2 bg-[#585852] rounded-full" />
            <div className="w-2 h-2 bg-[#585852] rounded-full" />
            <div className="w-2 h-2 bg-[#585852] rounded-full" />
          </div>
        </div>

      </div>
    </section>
  );
}
