import { SectionHeading } from "@/components/common/SectionChrome";
import { services } from "@/data/site";

export function ServicesSection() {
  return (
    <section id="services" className="bg-[#1d1a24] py-24">
      <SectionHeading eyebrow="Services" title="Photography, videography and social-first content creation." />
      <div className="mx-auto mt-12 grid max-w-[1280px] gap-7 px-6 md:grid-cols-3">
        {services.map(({ icon: Icon, title, text }) => (
          <article key={title} className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 shadow-2xl transition duration-300 hover:-translate-y-2 hover:border-emerald-400/50">
            <Icon className="mb-8 text-emerald-400" size={48} />
            <h3 className="mb-4 text-3xl font-bold">{title}</h3>
            <p className="leading-relaxed text-white/70">{text}</p>
            <a href="#collaboration" className="mt-8 inline-flex rounded-xl bg-emerald-500 px-6 py-3 font-bold text-black">
              Request Now
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
