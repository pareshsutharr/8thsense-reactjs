const metrics = [
  ["500+", "visual assets delivered"],
  ["3", "core services"],
  ["24/7", "direct contact access"],
  ["100%", "responsive experience"],
];

export function MetricsStrip() {
  return (
    <section className="mx-auto grid max-w-[1480px] gap-6 px-6 py-16 md:grid-cols-4">
      {metrics.map(([value, label]) => (
        <div key={label} className="rounded-3xl border border-white/10 bg-white/[0.04] p-7 text-center transition duration-300 hover:-translate-y-1 hover:border-emerald-400/40">
          <strong className="block text-4xl font-black text-emerald-400">{value}</strong>
          <span className="mt-2 block text-white/60">{label}</span>
        </div>
      ))}
    </section>
  );
}
