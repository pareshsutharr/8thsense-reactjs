export function FormGrid({ children }) {
  return <div className="grid gap-6 md:grid-cols-2">{children}</div>;
}

export function Field({ name, label, type = "text", textarea = false, required = false, placeholder, dark = false }) {
  const className = dark
    ? "mt-2 w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-white placeholder:text-white/40 outline-none focus:border-emerald-400"
    : "mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500";

  return (
    <label className={dark ? "block font-semibold text-white" : "block font-semibold text-slate-700"}>
      {label}
      {textarea ? (
        <textarea className={className} name={name} rows={6} required={required} placeholder={placeholder || `Enter ${label.toLowerCase()}`} />
      ) : (
        <input className={className} name={name} type={type} required={required} placeholder={placeholder || `Enter ${label.toLowerCase()}`} />
      )}
    </label>
  );
}

export function SubmitButton({ busy, label, blue = false }) {
  return (
    <button className={`rounded-xl px-7 py-4 text-lg font-bold ${blue ? "bg-blue-600 text-white" : "bg-emerald-500 text-black"} disabled:opacity-60`} disabled={busy}>
      {busy ? "Submitting..." : label}
    </button>
  );
}

export function Status({ text, dark = false }) {
  if (!text) return null;
  return <p className={`rounded-xl p-4 text-center font-semibold ${dark ? "bg-white/10 text-white" : "bg-slate-100 text-slate-700"}`}>{text}</p>;
}
