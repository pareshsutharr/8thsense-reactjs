import { MapPin, Phone, Mail, ArrowRight } from "lucide-react";
import { ContactForm } from "@/components/ui/contact-form";

export function Contact() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header Section */}
      <section className="bg-slate-50 pt-32 pb-20 border-b border-slate-100">
        <div className="page-container text-center max-w-3xl mx-auto">
          <p className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">Get in Touch</p>
          <h1 className="heading-xl mb-6">Let's create something beautiful together.</h1>
          <p className="text-body text-lg">
            Whether you're looking to book a session, discuss a brand campaign, or just want to say hello, we'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-padding">
        <div className="page-container">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            
            {/* Contact Information */}
            <div className="flex flex-col gap-12">
              <div className="prose prose-slate max-w-none">
                <h2 className="text-3xl font-bold text-slate-900 mb-4">Contact Information</h2>
                <p className="text-slate-600 mb-8 leading-relaxed">
                  Fill out the form to send us a direct message, or reach out using the information below. We aim to respond to all inquiries within 24-48 hours.
                </p>
              </div>

              <div className="grid gap-8">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-900">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">Our Studio</h3>
                    <p className="text-slate-500">123 Creative Avenue, Suite 400<br/>New York, NY 10012</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-900">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">Phone</h3>
                    <p className="text-slate-500">+1 (555) 123-4567<br/>Mon-Fri, 9am-6pm EST</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-900">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">Email</h3>
                    <p className="text-slate-500">hello@8thsense.com<br/>bookings@8thsense.com</p>
                  </div>
                </div>
              </div>
              
              {/* Decorative Image */}
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-slate-100 mt-4 hidden md:block">
                <img 
                  src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80" 
                  alt="Studio interior" 
                  className="object-cover w-full h-full"
                />
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
              <h3 className="text-2xl font-bold text-slate-900 mb-8">Send a Message</h3>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
