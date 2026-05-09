import { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Image as ImageIcon, Camera, Users } from "lucide-react";
import { ImageTrail } from "@/components/ui/image-trail";
import { StaggerTestimonials } from "@/components/ui/stagger-testimonials";
import { PhotoGallery } from "@/components/ui/gallery";

export function Landing() {
  const ref = useRef(null);
  
  const images = [
    "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05",
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
    "https://images.unsplash.com/photo-1426604966848-d7adac402bff",
    "https://images.unsplash.com/photo-1472214103451-9374bd1c798e",
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e",
    "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d",
  ].map(url => `${url}?auto=format&fit=crop&w=300&q=80`);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-20">
        <div className="page-container relative z-10 grid gap-12 lg:grid-cols-2 lg:gap-8 items-center pointer-events-auto">
          <div className="flex flex-col items-start gap-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-900">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-900 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-900"></span>
              </span>
              Now accepting bookings for 2026
            </div>
            <h1 className="heading-xl bg-white/50 backdrop-blur-sm rounded-2xl py-2">
              Capturing moments<br />
              <span className="text-slate-400">creating history</span>
            </h1>
            <p className="text-body text-xl bg-white/50 backdrop-blur-sm rounded-xl p-2 -ml-2">
              8thSense Production delivers premium photography, videography, and social media content for modern brands and discerning clients.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link to="/portfolio" className="btn-primary">
                View Portfolio <ArrowRight size={18} />
              </Link>
              <Link to="/contact" className="btn-secondary">
                Get in touch
              </Link>
            </div>
          </div>
          
          <div className="relative">
            <div className="aspect-[4/5] overflow-hidden rounded-3xl bg-slate-100 shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1502982720700-bfff97f2ecac?auto=format&fit=crop&w=1200&q=80" 
                alt="Photography Hero" 
                className="h-full w-full object-cover"
              />
            </div>
            
            {/* Floating feature card */}
            <div className="absolute -bottom-8 -left-8 glass-card max-w-[280px] hidden md:block">
              <div className="flex items-center gap-4 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-white">
                  <Camera size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Premium Quality</h3>
                  <p className="text-sm text-slate-500">Cinematic visuals</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Image Trail Albums Section */}
      <section className="flex w-full min-h-[72vh] justify-center items-center bg-white relative overflow-hidden py-20" ref={ref}>
        <div className="absolute inset-0 z-0">
          <ImageTrail containerRef={ref}>
            {images.map((url, index) => (
              <div
                key={index}
                className="flex relative overflow-hidden w-24 h-24 rounded-xl shadow-md border border-slate-100 bg-white p-1"
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
        <Link to="/portfolio" className="z-10 group relative block cursor-pointer select-none pointer-events-auto">
          <h2 className="text-6xl md:text-8xl font-black bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-400 drop-shadow-sm transition-transform group-hover:scale-105">
            ALBUMS
          </h2>
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity font-bold text-slate-900">
            View All <ArrowRight size={18} />
          </div>
        </Link>
      </section>



      {/* Community Gallery Teaser */}
      <section className="bg-white">
        <PhotoGallery 
          title="Community Highlights" 
          heading={<>Real <span className="text-slate-400">Moments</span></>} 
        />
        <div className="flex w-full justify-center pb-20">
          <Link to="/gallery" className="btn-primary">
            View the Full Gallery <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-white pb-20 overflow-hidden">
        <div className="page-container mb-12 text-center pt-20">
          <h2 className="heading-lg">What Our Clients Say</h2>
          <p className="text-body mt-4 max-w-2xl mx-auto">
            Don't just take our word for it. Hear from the amazing people and brands we've had the pleasure to work with.
          </p>
        </div>
        <StaggerTestimonials />
      </section>

      {/* Quick Links Section (Moved to above footer) */}
      <section className="section-padding bg-slate-50 border-t border-slate-100 pb-24">
        <div className="page-container">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="glass-card bg-white transition-transform hover:-translate-y-1 hover:shadow-md cursor-pointer relative group">
              <Link to="/portfolio" className="absolute inset-0 z-10" />
              <ImageIcon className="mb-4 h-8 w-8 text-slate-900 group-hover:scale-110 transition-transform" />
              <h3 className="heading-md mb-2">Our Work</h3>
              <p className="text-body mb-6">Explore our curated portfolio of weddings, events, and brand campaigns.</p>
              <span className="font-semibold text-slate-900 group-hover:underline inline-flex items-center gap-1">Browse albums <ArrowRight size={16} /></span>
            </div>
            <div className="glass-card bg-white transition-transform hover:-translate-y-1 hover:shadow-md cursor-pointer relative group">
              <Link to="/services" className="absolute inset-0 z-10" />
              <Camera className="mb-4 h-8 w-8 text-slate-900 group-hover:scale-110 transition-transform" />
              <h3 className="heading-md mb-2">Services</h3>
              <p className="text-body mb-6">Discover how we can bring your visual story to life with our expertise.</p>
              <span className="font-semibold text-slate-900 group-hover:underline inline-flex items-center gap-1">View services <ArrowRight size={16} /></span>
            </div>
            <div className="glass-card bg-slate-900 text-white border-none transition-transform hover:-translate-y-1 hover:shadow-lg cursor-pointer relative group">
              <Link to="/gallery" className="absolute inset-0 z-10" />
              <Users className="mb-4 h-8 w-8 text-white group-hover:scale-110 transition-transform" />
              <h3 className="heading-md mb-2 text-white">Community</h3>
              <p className="text-slate-300 mb-6 text-lg">Join our client studio, share your photos, and connect with others.</p>
              <span className="font-semibold text-white group-hover:underline inline-flex items-center gap-1">Enter gallery <ArrowRight size={16} /></span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
