import { useRef } from "react";
import { SectionHeading } from "@/components/common/SectionChrome";
import { ImageTrail } from "@/components/ui/image-trail";
import { portfolio, stockImages } from "@/data/site";

export function AlbumsSection() {
  return (
    <section id="albums" className="py-24">
      <SectionHeading eyebrow="Albums" title="Recent work, campaigns and visual direction." />
      <AlbumTrailSection />
      <div className="mx-auto mt-12 grid max-w-[1480px] gap-5 px-6 md:grid-cols-3">
        {portfolio.map((item) => (
          <article key={item.title} className="group overflow-hidden rounded-[2rem] bg-white/5">
            <img className="h-72 w-full object-cover transition duration-700 group-hover:scale-110" src={item.image} alt={item.title} />
            <div className="p-6">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-400">{item.tag}</p>
              <h3 className="mt-2 text-2xl font-bold">{item.title}</h3>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function AlbumTrailSection() {
  const ref = useRef(null);
  const images = [
    stockImages.hero,
    stockImages.campaign,
    stockImages.photography,
    stockImages.videography,
    stockImages.social,
    stockImages.event,
  ];

  return (
    <div
      ref={ref}
      className="relative mx-auto mt-12 flex h-[70vh] min-h-[520px] max-w-[1480px] items-center justify-center overflow-hidden rounded-[2rem] border border-white/10 bg-white px-6 text-center shadow-2xl shadow-black/25"
    >
      <ImageTrail containerRef={ref} rotationRange={18} interval={80}>
        {images.map((url, index) => (
          <div
            key={url}
            className="relative flex h-28 w-28 overflow-hidden rounded-xl border border-white/40 bg-black shadow-2xl md:h-36 md:w-36"
          >
            <img
              src={url}
              alt={`8thSense album trail ${index + 1}`}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        ))}
      </ImageTrail>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,transparent_38%,rgba(255,255,255,.86)_76%)]" />
      <div className="relative z-10">
        <p className="mb-4 text-sm font-black uppercase tracking-[0.35em] text-[#ff5616]">Move cursor</p>
        <h3 className="select-none bg-gradient-to-r from-neutral-950 to-neutral-500 bg-clip-text text-7xl font-black uppercase leading-none text-transparent md:text-9xl">
          Albums
        </h3>
      </div>
    </div>
  );
}
