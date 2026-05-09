import { useRef, useEffect, useState } from "react";
import { ImageTrail } from "@/components/ui/image-trail";
import { supabase } from "@/lib/supabase";

export function Portfolio() {
  const ref = useRef(null);
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    async function loadAlbums() {
      const { data } = await supabase.from("portfolio_items").select("*").order("sort_order", { ascending: true });
      if (data) setAlbums(data);
    }
    loadAlbums();
  }, []);

  const images = [
    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622",
    "https://images.unsplash.com/photo-1519741497674-611481863552",
    "https://images.unsplash.com/photo-1502982720700-bfff97f2ecac",
    "https://images.unsplash.com/photo-1520390138845-fd2d229dd553",
    "https://images.unsplash.com/photo-1611162616475-46b635cb6868",
    "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91",
  ].map((url) => `${url}?auto=format&fit=crop&w=300&q=80`);

  return (
    <div className="flex flex-col bg-white">
      {/* Hero with Image Trail */}
      <div className="relative flex h-[52vh] min-h-[360px] w-full items-center justify-center overflow-hidden bg-white sm:h-[64vh]" ref={ref}>
        <div className="absolute inset-0 z-0">
          <ImageTrail containerRef={ref}>
            {images.map((url, index) => (
              <div
                key={index}
                className="relative flex h-20 w-20 overflow-hidden rounded-xl border border-slate-100 bg-white p-1 shadow-lg sm:h-28 sm:w-28"
              >
                <img
                  src={url}
                  alt={`Trail image ${index + 1}`}
                  className="object-cover absolute inset-0 w-full h-full rounded-lg hover:scale-110 transition-transform"
                />
              </div>
            ))}
          </ImageTrail>
        </div>
        <h1 className="pointer-events-none z-10 select-none bg-gradient-to-r from-slate-900 to-slate-400 bg-clip-text text-5xl font-black text-transparent drop-shadow-sm sm:text-7xl md:text-9xl">
          ALBUMS
        </h1>
      </div>

      {/* Portfolio Details Section */}
      <div className="page-container section-padding">
        <div className="grid gap-8 md:grid-cols-2 md:gap-12 lg:grid-cols-3">
          {albums.map((item) => (
            <div key={item.id} className="group flex flex-col gap-4">
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-slate-100">
                <img 
                  src={item.image_url} 
                  alt={item.title} 
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {item.featured && (
                  <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate-900 shadow-sm">
                    Featured
                  </span>
                )}
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-1">{item.category} • {item.location}</p>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
