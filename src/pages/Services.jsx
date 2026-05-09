import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2, ArrowRight } from "lucide-react";
import { ContactForm } from "@/components/ui/contact-form";

export function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState("");

  useEffect(() => {
    async function loadServices() {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("active", true)
        .order("sort_order", { ascending: true });
      
      if (!error && data) {
        setServices(data);
      }
      setLoading(false);
    }
    loadServices();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Section */}
      <section className="border-b border-slate-100 bg-slate-50 pb-14 pt-24 sm:pb-20 sm:pt-32">
        <div className="page-container text-center max-w-3xl mx-auto">
          <p className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">Our Services</p>
          <h1 className="heading-xl mb-6">Expertise tailored to your vision.</h1>
          <p className="text-body">
            We provide premium visual storytelling services across multiple disciplines. Discover how we can elevate your brand or capture your most precious moments.
          </p>
        </div>
      </section>

      {/* Services List */}
      <section className="section-padding bg-white">
        <div className="page-container">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-slate-400" size={32} />
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-20 text-slate-500">
              No services available at the moment. Please check back later.
            </div>
          ) : (
            <div className="flex flex-col gap-14 md:gap-24">
              {services.map((service, index) => (
                <div key={service.id} className={`flex flex-col items-center gap-8 md:flex-row md:gap-12 ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
                  
                  {/* Service Image */}
                  <div className="w-full md:w-1/2">
                    <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-slate-100 shadow-xl relative group">
                      {service.image_url ? (
                        <img 
                          src={service.image_url} 
                          alt={service.title} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">No Image</div>
                      )}
                    </div>
                  </div>

                  {/* Service Content */}
                  <div className="w-full md:w-1/2 flex flex-col items-start">
                    <h2 className="heading-lg mb-4">{service.title}</h2>
                    <p className="text-body mb-6 leading-relaxed sm:mb-8">
                      {service.description}
                    </p>
                    <button 
                      onClick={() => {
                        setSelectedService(service.title);
                        document.getElementById("inquiry-form")?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="btn-primary"
                    >
                      {service.cta_text || "Book this service"} <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section id="inquiry-form" className="section-padding bg-slate-50 border-t border-slate-100">
        <div className="page-container max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="heading-lg mb-4">Ready to get started?</h2>
            <p className="text-body max-w-xl mx-auto">
              Fill out the form below and let us know what you're looking for. We'll get back to you with a custom quote.
            </p>
          </div>
          
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:rounded-3xl sm:p-8 md:p-12">
            <ContactForm defaultSubject={selectedService ? `Inquiry: ${selectedService}` : "General Inquiry"} />
          </div>
        </div>
      </section>
    </div>
  );
}
