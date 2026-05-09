"use client";

import { ReactLenis } from "lenis/react";
import React, { forwardRef } from "react";

type GalleryImage = {
  id: string;
  src: string;
  alt: string;
  title: string;
  tag: string;
};

type StickyScrollProps = {
  uploadedImages?: GalleryImage[];
};

const stockImages: GalleryImage[] = [
  {
    id: "stock-camera",
    src: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=900&q=85",
    alt: "Film camera production setup",
    title: "Cinematic Production",
    tag: "Stock visual",
  },
  {
    id: "stock-studio",
    src: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=900&q=85",
    alt: "Studio production lights",
    title: "Studio Direction",
    tag: "Stock visual",
  },
  {
    id: "stock-event",
    src: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=900&q=85",
    alt: "Event lights and crowd",
    title: "Event Coverage",
    tag: "Stock visual",
  },
  {
    id: "stock-wedding",
    src: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=85",
    alt: "Wedding couple portrait",
    title: "Wedding Stories",
    tag: "Stock visual",
  },
  {
    id: "stock-brand",
    src: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=85",
    alt: "Brand film camera shoot",
    title: "Brand Campaign",
    tag: "Stock visual",
  },
  {
    id: "stock-camera-close",
    src: "https://images.unsplash.com/photo-1502982720700-bfff97f2ecac?auto=format&fit=crop&w=900&q=85",
    alt: "Camera closeup",
    title: "Photography",
    tag: "Stock visual",
  },
  {
    id: "stock-video",
    src: "https://images.unsplash.com/photo-1520390138845-fd2d229dd553?auto=format&fit=crop&w=900&q=85",
    alt: "Videographer with camera",
    title: "Videography",
    tag: "Stock visual",
  },
  {
    id: "stock-social",
    src: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?auto=format&fit=crop&w=900&q=85",
    alt: "Social media content production",
    title: "Social Content",
    tag: "Stock visual",
  },
  {
    id: "stock-collab",
    src: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=85",
    alt: "Creative collaboration meeting",
    title: "Creative Planning",
    tag: "Stock visual",
  },
];

function splitColumns(images: GalleryImage[]) {
  return [
    images.filter((_, index) => index % 3 === 0),
    images.filter((_, index) => index % 3 === 1),
    images.filter((_, index) => index % 3 === 2),
  ];
}

function GalleryFigure({ image, tall = false }: { image: GalleryImage; tall?: boolean }) {
  return (
    <figure className="group relative w-full overflow-hidden rounded-md bg-white/5">
      <img
        src={image.src}
        alt={image.alt}
        className={`w-full align-bottom object-cover transition-all duration-500 group-hover:scale-105 ${
          tall ? "h-full" : "h-80 sm:h-96"
        }`}
      />
      <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-5 text-white">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-300">{image.tag}</p>
        <h3 className="mt-1 text-xl font-black">{image.title}</h3>
      </figcaption>
    </figure>
  );
}

const StickyScrollGallery = forwardRef<HTMLElement, StickyScrollProps>(
  ({ uploadedImages = [] }, ref) => {
    const images = [...uploadedImages, ...stockImages];
    const [leftColumn, centerColumn, rightColumn] = splitColumns(images);

    return (
      <ReactLenis root>
        <section className="bg-slate-950 text-white" ref={ref}>
          <div className="wrapper">
            <section className="sticky top-0 grid h-screen w-full place-content-center overflow-hidden bg-slate-950 px-6 text-white">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:54px_54px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
              <div className="relative z-10 mx-auto max-w-5xl text-center">
                <p className="mb-5 text-sm font-black uppercase tracking-[0.4em] text-emerald-300">
                  Live Gallery
                </p>
                <h2 className="text-5xl font-black uppercase leading-[0.96] tracking-tight md:text-7xl">
                  Stock visuals and client uploads in one moving wall
                </h2>
                <p className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-white/65">
                  New studio posts appear here through Supabase Realtime, mixed with curated 8thSense production imagery.
                </p>
              </div>
            </section>
          </div>

          <section className="w-full bg-slate-950 px-2 pb-2">
            <div className="grid gap-2 lg:grid-cols-12">
              <div className="grid gap-2 lg:col-span-4">
                {leftColumn.map((image) => (
                  <GalleryFigure key={image.id} image={image} />
                ))}
              </div>
              <div className="grid gap-2 lg:sticky lg:top-0 lg:col-span-4 lg:h-screen lg:grid-rows-3">
                {centerColumn.slice(0, 3).map((image) => (
                  <GalleryFigure key={image.id} image={image} tall />
                ))}
              </div>
              <div className="grid gap-2 lg:col-span-4">
                {rightColumn.map((image) => (
                  <GalleryFigure key={image.id} image={image} />
                ))}
              </div>
            </div>
          </section>

          <footer className="group bg-slate-950 pt-10">
            <h2 className="translate-y-8 bg-gradient-to-r from-gray-300 to-gray-800 bg-clip-text text-center text-[15vw] font-black uppercase leading-[100%] text-transparent transition-all ease-linear">
              8thsense
            </h2>
            <div className="relative z-10 grid h-32 place-content-center rounded-tl-full rounded-tr-full bg-black text-center text-xl text-white/70">
              Live uploads refresh this gallery automatically.
            </div>
          </footer>
        </section>
      </ReactLenis>
    );
  },
);

StickyScrollGallery.displayName = "StickyScrollGallery";

export default StickyScrollGallery;
