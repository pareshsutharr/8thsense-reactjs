import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { BrandMark } from "@/components/common/BrandMark";
import { ThemeToggle } from "@/components/ui/curtain-theme-toggle";

export function Navbar({ user, profile }) {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const links = [
    { label: "Home", path: "/" },
    { label: "Services", path: "/services" },
    { label: "Portfolio", path: "/portfolio" },
    { label: "Gallery", path: "/gallery" },
    { label: "Contact", path: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/90 backdrop-blur-md dark:border-white/10 dark:bg-slate-950/90">
      <div className="page-container flex h-16 items-center justify-between sm:h-20">
        <Link to="/" className="flex shrink-0 items-center">
          <BrandMark className="w-[138px] max-w-[44vw] sm:w-[190px]" />
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-semibold transition-colors hover:text-slate-900 ${
                location.pathname === link.path ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-300"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-4 md:flex">
          <ThemeToggle variant="icon" defaultTheme="light" duration={600} />
          {user ? (
            <>
              {profile?.role === "admin" && (
                <Link to="/admin" className="btn-ghost">
                  Admin
                </Link>
              )}
              <Link to="/studio" className="btn-secondary">
                Studio
              </Link>
            </>
          ) : (
            <Link to="/login" className="btn-secondary px-4 py-2">
              Login
            </Link>
          )}
        </div>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-900 md:hidden dark:border-white/10 dark:bg-slate-900 dark:text-white"
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {open && (
        <div className="border-t border-slate-100 bg-white md:hidden dark:border-white/10 dark:bg-slate-950">
          <div className="page-container grid gap-2 py-4">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setOpen(false)}
                className={`rounded-xl px-3 py-3 text-sm font-semibold transition-colors ${
                  location.pathname === link.path ? "bg-slate-900 text-white dark:bg-white dark:text-slate-950" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 dark:border-white/10">
              <div className="col-span-2 flex justify-end">
                <ThemeToggle variant="icon" defaultTheme="light" duration={600} />
              </div>
              {user ? (
                <>
                  {profile?.role === "admin" && (
                    <Link to="/admin" onClick={() => setOpen(false)} className="btn-secondary px-3 py-3">
                      Admin
                    </Link>
                  )}
                  <Link
                    to="/studio"
                    onClick={() => setOpen(false)}
                    className={`btn-primary px-3 py-3 ${profile?.role === "admin" ? "" : "col-span-2"}`}
                  >
                    Studio
                  </Link>
                </>
              ) : (
                <Link to="/login" onClick={() => setOpen(false)} className="btn-primary col-span-2 px-3 py-3">
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
