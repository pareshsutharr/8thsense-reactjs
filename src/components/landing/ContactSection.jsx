import { Mail, MapPin, Phone } from "lucide-react";
import { SectionHeading } from "@/components/common/SectionChrome";
import { ContactForm } from "@/components/landing/LeadForms";

function InfoLine({ icon: Icon, label, value }) {
  return (
    <div className="mb-7 flex gap-4 last:mb-0">
      <Icon className="mt-1 text-emerald-400" />
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-white/40">{label}</p>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </div>
  );
}

export function ContactSection() {
  return (
    <section id="contact" className="bg-[#1d1a24] py-24">
      <SectionHeading eyebrow="Contact" title="Connect with 8thSense Production." />
      <div className="mx-auto grid max-w-[1180px] gap-8 px-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-[2rem] bg-black/25 p-8">
          <InfoLine icon={Mail} label="Email" value="pareshsutharr@gmail.com" />
          <InfoLine icon={Phone} label="Phone" value="+91 81408 82454" />
          <InfoLine icon={MapPin} label="Location" value="Surat, Gujarat" />
        </div>
        <ContactForm />
      </div>
    </section>
  );
}
