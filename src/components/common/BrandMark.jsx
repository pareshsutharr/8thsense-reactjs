const LOGO_SRC = "/images/8thsense-production-logo.png";

export function BrandMark({ variant = "dark", className = "" }) {
  const invertClass = variant === "light" ? "invert brightness-0" : "";

  return (
    <img
      src={LOGO_SRC}
      alt="8th Sense Productions Pvt. Ltd."
      className={`block h-auto w-[150px] object-contain md:w-[190px] ${invertClass} ${className}`}
    />
  );
}
