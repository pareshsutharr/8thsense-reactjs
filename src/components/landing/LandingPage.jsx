import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { AlbumsSection } from "@/components/landing/AlbumsSection";
import { CollaborationSection, QuotationSection } from "@/components/landing/LeadForms";
import { ContactSection } from "@/components/landing/ContactSection";
import { FeedbackSection } from "@/components/landing/FeedbackSection";
import { GallerySection } from "@/components/landing/GallerySection";
import { HeroSection } from "@/components/landing/HeroSection";
import { MetricsStrip } from "@/components/landing/MetricsStrip";
import { ServicesSection } from "@/components/landing/ServicesSection";
import { SiteHeader } from "@/components/landing/SiteHeader";

export function LandingPage({ user }) {
  const [galleryUploads, setGalleryUploads] = useState([]);

  useEffect(() => {
    let mounted = true;

    async function loadGalleryUploads() {
      const { data } = await supabase
        .from("community_posts")
        .select("id,image_url,caption,author_name,created_at")
        .order("created_at", { ascending: false })
        .limit(12);

      if (!mounted) return;
      setGalleryUploads(
        (data ?? []).map((post) => ({
          id: post.id,
          src: post.image_url,
          alt: post.caption || "8thSense client uploaded gallery image",
          title: post.caption || "Client Studio Upload",
          tag: post.author_name ? `Uploaded by ${post.author_name}` : "Live upload",
        })),
      );
    }

    loadGalleryUploads();

    const channel = supabase
      .channel("public:community_posts:gallery")
      .on("postgres_changes", { event: "*", schema: "public", table: "community_posts" }, loadGalleryUploads)
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <main className="bg-[#151219] text-white">
      <SiteHeader user={user} />
      <HeroSection />
      <MetricsStrip />
      <ServicesSection />
      <AlbumsSection />
      <GallerySection uploads={galleryUploads} />
      <CollaborationSection />
      <QuotationSection />
      <FeedbackSection />
      <ContactSection />
      <footer className="border-t border-white/10 px-6 py-10 text-center text-white/60">
        8thSense Productions Pvt. Ltd. - Photography, videography and social media content creation.
      </footer>
    </main>
  );
}
