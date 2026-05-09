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
      <div className="flex w-full h-[70vh] justify-center items-center bg-white relative overflow-hidden" ref={ref}>
        <div className="absolute inset-0 z-0">
          <ImageTrail containerRef={ref}>
            {images.map((url, index) => (
              <div
                key={index}
                className="flex relative overflow-hidden w-28 h-28 rounded-xl shadow-lg border border-slate-100 bg-white p-1"
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
        <h1 className="text-7xl md:text-9xl font-black z-10 select-none bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-400 drop-shadow-sm pointer-events-none">
          ALBUMS
        </h1>
      </div>

      {/* Portfolio Details Section */}
      <div className="page-container section-padding">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
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
