import { Link, useLocation } from "react-router-dom";
import { BrandMark } from "@/components/common/BrandMark";

export function Navbar({ user, profile }) {
  const location = useLocation();

  const links = [
    { label: "Home", path: "/" },
    { label: "Services", path: "/services" },
    { label: "Portfolio", path: "/portfolio" },
    { label: "Gallery", path: "/gallery" },
    { label: "Contact", path: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="page-container flex h-20 items-center justify-between">
        <Link to="/" className="flex shrink-0 items-center">
          <BrandMark className="max-w-[42vw]" />
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-semibold transition-colors hover:text-slate-900 ${
                location.pathname === link.path ? "text-slate-900" : "text-slate-500"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4">
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
      </div>
    </header>
  );
}
