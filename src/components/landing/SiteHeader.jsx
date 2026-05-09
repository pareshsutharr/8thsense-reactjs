import { useState } from "react";
import { Link } from "react-router-dom";
import { Camera, ChevronDown, Handshake, Home, Menu, Sparkles, Star, X } from "lucide-react";
import { BrandMark } from "@/components/common/BrandMark";

const primaryLinks = [
  ["#home", "Home", Home],
  ["#albums", "Albums", Camera],
  ["#gallery", "Gallery", Sparkles],
  ["#services", "Services", Sparkles],
];

const moreLinks = [
  ["#collaboration", "Collaboration", Handshake],
  ["#feedback", "Feedback", Star],
  ["#quotation", "Quotation", Sparkles],
  ["#contact", "Contact", Handshake],
];

function NavLink({ href, label, Icon, onClick }) {
  return (
    <a
      href={href}
      onClick={onClick}
      className="flex items-center gap-2 rounded-full px-3 py-2 transition duration-300 hover:-translate-y-0.5 hover:bg-white/10 hover:text-emerald-300"
    >
      <Icon size={20} />
      {label}
    </a>
  );
}

export function SiteHeader({ user }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const closeMenus = () => {
    setMenuOpen(false);
    setMoreOpen(false);
  };

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-[#07090b]/70 px-4 py-4 text-white shadow-2xl shadow-black/25 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-[1480px] items-center justify-between gap-5">
        <a href="#home" className="flex shrink-0 items-center" aria-label="8th Sense home">
          <BrandMark variant="light" className="w-[150px] md:w-[210px]" />
        </a>

        <div className="hidden items-center gap-2 rounded-full bg-black/25 px-5 py-2 text-base font-semibold ring-1 ring-white/10 xl:flex">
          {primaryLinks.map(([href, label, Icon]) => (
            <NavLink key={href} href={href} label={label} Icon={Icon} />
          ))}
          <div className="relative">
            <button
              type="button"
              onClick={() => setMoreOpen((value) => !value)}
              className="flex items-center gap-2 rounded-full px-3 py-2 transition duration-300 hover:bg-white/10 hover:text-emerald-300"
            >
              More <ChevronDown size={18} className={moreOpen ? "rotate-180 transition" : "transition"} />
            </button>
            {moreOpen && (
              <div className="absolute right-0 top-12 grid min-w-56 gap-1 rounded-2xl border border-white/10 bg-black/90 p-2 shadow-2xl backdrop-blur-xl">
                {moreLinks.map(([href, label, Icon]) => (
                  <NavLink key={href} href={href} label={label} Icon={Icon} onClick={closeMenus} />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            className="rounded-xl border border-white/70 px-5 py-2.5 font-semibold transition duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-black hover:shadow-[0_0_35px_rgba(255,255,255,.25)]"
            to={user ? "/studio" : "/login"}
          >
            {user ? "Studio" : "Sign In"}
          </Link>
          <button
            type="button"
            className="grid h-11 w-11 place-items-center rounded-xl border border-white/20 bg-white/10 xl:hidden"
            onClick={() => setMenuOpen((value) => !value)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="mx-auto mt-4 grid max-w-[1480px] gap-2 rounded-3xl border border-white/10 bg-black/85 p-4 text-lg font-semibold shadow-2xl xl:hidden">
          {[...primaryLinks, ...moreLinks].map(([href, label, Icon]) => (
            <NavLink key={href} href={href} label={label} Icon={Icon} onClick={closeMenus} />
          ))}
        </div>
      )}
    </header>
  );
}
