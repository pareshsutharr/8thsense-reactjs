export function SectionHeading({ eyebrow, title }) {
  return (
    <div className="mx-auto max-w-4xl px-6 text-center">
      <p className="mb-3 text-sm font-black uppercase tracking-[0.35em] text-emerald-400">{eyebrow}</p>
      <h2 className="text-4xl font-black leading-tight md:text-6xl">{title}</h2>
    </div>
  );
}

export function PageBand({ image, title }) {
  return (
    <div className="relative mb-16 h-72 overflow-hidden md:h-96">
      <img className="absolute inset-0 h-full w-full object-cover" src={image} alt="" />
      <div className="absolute inset-0 bg-black/55" />
      <h2 className="relative z-10 flex h-full items-center justify-center px-6 text-center text-5xl font-light text-white md:text-7xl">
        {title}
      </h2>
    </div>
  );
}
