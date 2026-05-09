import { ParticleTextEffect } from "@/components/ui/particle-text-effect";
import { heroTitle, stockImages } from "@/data/site";

export function HeroSection() {
  return (
    <section id="home" className="relative min-h-screen overflow-hidden">
      <img className="absolute inset-0 h-full w-full scale-105 object-cover" src={stockImages.hero} alt="" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_35%,rgba(16,185,129,.18),transparent_34%),linear-gradient(90deg,rgba(0,0,0,.88),rgba(0,0,0,.5)_48%,rgba(0,0,0,.82))]" />
      <div className="relative z-10 flex min-h-screen w-full items-center justify-center">
        <div className="h-screen w-screen">
          <ParticleTextEffect words={[heroTitle]} className="h-full w-full bg-transparent" maxFontSize={190} />
        </div>
      </div>
    </section>
  );
}
