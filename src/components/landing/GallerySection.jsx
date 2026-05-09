import StickyScrollGallery from "@/components/ui/sticky-scroll";

export function GallerySection({ uploads }) {
  return (
    <section id="gallery" className="bg-slate-950">
      <StickyScrollGallery uploadedImages={uploads} />
    </section>
  );
}
