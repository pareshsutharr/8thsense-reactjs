import { useState } from "react";
import { Star } from "lucide-react";
import { Field, FormGrid, Status, SubmitButton } from "@/components/common/FormControls";
import { PageBand, SectionHeading } from "@/components/common/SectionChrome";
import { supabase } from "@/lib/supabase";
import { stockImages } from "@/data/site";

function useFormStatus() {
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  return { status, setStatus, busy, setBusy };
}

async function insertRow(table, payload) {
  const { error } = await supabase.from(table).insert(payload);
  if (error) throw error;
}

export function CollaborationSection() {
  return (
    <section id="collaboration" className="bg-white py-24 text-slate-900">
      <PageBand image={stockImages.collaboration} title="Request Collaboration" />
      <CollaborationForm />
    </section>
  );
}

export function QuotationSection() {
  return (
    <section id="quotation" className="bg-[#151219] py-24">
      <SectionHeading eyebrow="Quotation" title="Tell us your shoot requirement and budget." />
      <QuoteForm />
    </section>
  );
}

export function FeedbackForm() {
  const { status, setStatus, busy, setBusy } = useFormStatus();
  const [rating, setRating] = useState(5);

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setStatus("");
    const form = new FormData(event.currentTarget);
    try {
      await insertRow("feedback", { ...Object.fromEntries(form.entries()), rating });
      event.currentTarget.reset();
      setRating(5);
      setStatus("Feedback submitted successfully.");
    } catch (error) {
      setStatus(error.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="mx-auto grid max-w-[980px] gap-7 rounded-[2rem] bg-white px-6 md:p-10">
      <FormGrid>
        <Field name="name" label="Full Name" required />
        <Field name="email" label="Email Address" type="email" required />
        <Field name="phone" label="Phone Number" />
      </FormGrid>
      <label className="block text-xl font-semibold">
        Overall Rating
        <span className="mt-3 flex gap-2">
          {[1, 2, 3, 4, 5].map((value) => (
            <button key={value} type="button" onClick={() => setRating(value)} className={value <= rating ? "text-amber-400" : "text-slate-300"}>
              <Star size={34} fill="currentColor" />
            </button>
          ))}
        </span>
      </label>
      <Field name="message" label="Your Feedback" textarea required />
      <SubmitButton busy={busy} label="Submit Feedback" blue />
      <Status text={status} />
    </form>
  );
}

export function ContactForm() {
  const { status, setStatus, busy, setBusy } = useFormStatus();

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setStatus("");
    const form = new FormData(event.currentTarget);
    try {
      await insertRow("contacts", Object.fromEntries(form.entries()));
      event.currentTarget.reset();
      setStatus("Message sent successfully.");
    } catch (error) {
      setStatus(error.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-5 rounded-[2rem] bg-white p-7 text-slate-900">
      <Field name="name" label="Full Name" required />
      <Field name="email" label="Email Address" type="email" required />
      <Field name="subject" label="Subject" required />
      <Field name="message" label="Message" textarea required />
      <SubmitButton busy={busy} label="Send Message" />
      <Status text={status} />
    </form>
  );
}

function CollaborationForm() {
  const { status, setStatus, busy, setBusy } = useFormStatus();

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setStatus("");
    const form = new FormData(event.currentTarget);
    try {
      await insertRow("collaboration_requests", Object.fromEntries(form.entries()));
      event.currentTarget.reset();
      setStatus("Collaboration request submitted successfully.");
    } catch (error) {
      setStatus(error.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="mx-auto grid max-w-[1320px] gap-7 px-6">
      <FormGrid>
        <Field name="name" label="Full Name" required />
        <Field name="email" label="Email Address" type="email" required />
        <Field name="phone" label="Phone Number" />
        <Field name="company" label="Company" />
        <Field name="project" label="Project Type" required />
        <Field name="budget" label="Budget" />
        <Field name="timeline" label="Timeline" />
        <Field name="portfolio" label="Portfolio Link" />
      </FormGrid>
      <Field name="details" label="Project Details" textarea required />
      <SubmitButton busy={busy} label="Submit Collaboration" />
      <Status text={status} />
    </form>
  );
}

function QuoteForm() {
  const { status, setStatus, busy, setBusy } = useFormStatus();

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setStatus("");
    const form = new FormData(event.currentTarget);
    try {
      await insertRow("quotations", Object.fromEntries(form.entries()));
      event.currentTarget.reset();
      setStatus("Quotation request submitted successfully.");
    } catch (error) {
      setStatus(error.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="mx-auto mt-12 grid max-w-[1120px] gap-7 px-6">
      <FormGrid>
        <Field name="name" label="Full Name" required dark />
        <Field name="email" label="Email Address" type="email" required dark />
        <Field name="phone" label="Phone Number" required dark />
        <Field name="service" label="Service" placeholder="Photography, videography, social content..." required dark />
        <Field name="budget" label="Budget" dark />
      </FormGrid>
      <Field name="details" label="Details" textarea required dark />
      <SubmitButton busy={busy} label="Get Quotation" />
      <Status text={status} dark />
    </form>
  );
}
