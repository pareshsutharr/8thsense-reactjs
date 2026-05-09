import { FeedbackForm } from "@/components/landing/LeadForms";
import { PageBand } from "@/components/common/SectionChrome";
import { StaggerTestimonials } from "@/components/ui/stagger-testimonials";
import { stockImages } from "@/data/site";

export function FeedbackSection() {
  return (
    <section id="feedback" className="bg-white py-24 text-slate-900">
      <PageBand image={stockImages.feedback} title="Feedback" />
      <div className="mx-auto mb-16 max-w-[1480px] px-6">
        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-50 shadow-2xl shadow-slate-200/70">
          <StaggerTestimonials />
        </div>
      </div>
      <FeedbackForm />
    </section>
  );
}
