import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ContactForm({ defaultSubject = "" }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: defaultSubject,
    message: ""
  });
  const [status, setStatus] = useState("idle"); // 'idle' | 'submitting' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert([
          { 
            name: formData.name, 
            email: formData.email, 
            subject: formData.subject, 
            message: formData.message 
          }
        ]);

      if (error) throw error;
      
      setStatus("success");
      setFormData({ name: "", email: "", subject: defaultSubject, message: "" });
      
      // Reset success message after 5 seconds
      setTimeout(() => setStatus("idle"), 5000);
      
    } catch (error) {
      console.error("Error submitting contact form:", error);
      setStatus("error");
      setErrorMessage(error.message || "Failed to send message. Please try again later.");
    }
  };

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16 bg-slate-50 rounded-2xl border border-slate-100">
        <CheckCircle2 className="text-green-500 w-16 h-16 mb-4" />
        <h4 className="text-xl font-bold text-slate-900 mb-2">Message Sent!</h4>
        <p className="text-slate-500 max-w-sm">
          Thank you for reaching out. We have received your message and will get back to you shortly.
        </p>
        <Button 
          variant="outline" 
          className="mt-8"
          onClick={() => setStatus("idle")}
        >
          Send Another Message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {status === 'error' && (
        <div className="p-4 rounded-lg bg-red-50 text-red-600 text-sm border border-red-100">
          {errorMessage}
        </div>
      )}
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="text-sm font-semibold text-slate-900">Full Name</label>
          <input 
            type="text" 
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 transition-colors"
            placeholder="Jane Doe"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm font-semibold text-slate-900">Email Address</label>
          <input 
            type="email" 
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 transition-colors"
            placeholder="jane@example.com"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="subject" className="text-sm font-semibold text-slate-900">Subject</label>
        <input 
          type="text" 
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          required
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 transition-colors"
          placeholder="e.g. Wedding Photography Inquiry"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="message" className="text-sm font-semibold text-slate-900">Message</label>
        <textarea 
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={6}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 transition-colors resize-none"
          placeholder="Tell us a little bit about your project..."
        />
      </div>

      <Button 
        type="submit" 
        disabled={status === 'submitting'}
        className="w-full py-6 text-lg rounded-xl mt-2 group bg-slate-900 hover:bg-slate-800 text-white"
      >
        {status === 'submitting' ? (
          <span className="flex items-center gap-2"><Loader2 className="animate-spin" size={20} /> Sending...</span>
        ) : (
          <span className="flex items-center justify-center gap-2">Send Message <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></span>
        )}
      </Button>
    </form>
  );
}
