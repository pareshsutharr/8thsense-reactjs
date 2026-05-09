import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/common/SectionChrome";
import { stockImages } from "@/data/site";

const fallbackImages = [
  {
    id: "stock-camera",
    src: stockImages.hero,
    alt: "Film camera production setup",
    title: "Cinematic Production",
    tag: "Production",
  },
  {
    id: "stock-studio",
    src: stockImages.photography,
    alt: "Studio photography direction",
    title: "Studio Direction",
    tag: "Photography",
  },
  {
    id: "stock-video",
    src: stockImages.videography,
    alt: "Videographer with camera",
    title: "Video Stories",
    tag: "Videography",
  },
  {
    id: "stock-social",
    src: stockImages.social,
    alt: "Social media content production",
    title: "Social Campaigns",
    tag: "Content",
  },
];

export function GallerySection({ uploads = [] }) {
  const images = [...uploads, ...fallbackImages].slice(0, 8);

  return (
    <section id="gallery" className="bg-slate-950 py-24 text-white">
      <SectionHeading eyebrow="Gallery" title="Client uploads and production highlights." />
      <div className="mx-auto mt-12 columns-1 gap-5 px-6 sm:columns-2 lg:columns-4 max-w-[1480px]">
        {images.map((image) => (
          <figure
            key={image.id}
            className="group mb-5 break-inside-avoid overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/5"
          >
            <img
              src={image.src}
              alt={image.alt}
              className="w-full object-cover transition duration-700 group-hover:scale-105"
            />
            <figcaption className="p-5">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#ff5616]">{image.tag}</p>
              <h3 className="mt-2 text-xl font-bold text-white">{image.title}</h3>
            </figcaption>
          </figure>
        ))}
      </div>
      <div className="mt-10 flex justify-center">
        <Link to="/gallery" className="btn-primary bg-white text-slate-950 hover:bg-slate-200">
          Open Gallery <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  );
}
