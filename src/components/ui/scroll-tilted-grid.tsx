"use client";

import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
  useReducedMotion,
  cubicBezier,
} from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { PostCard } from "@/components/gallery/PostCard";

export const DEFAULT_GRID_IMAGES: readonly string[] = [
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80",
  "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80",
  "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80",
  "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80",
  "https://images.unsplash.com/photo-1520390138845-fd2d229dd553?w=800&q=80",
  "https://images.unsplash.com/photo-1502982720700-bfff97f2ecac?w=800&q=80",
  "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=800&q=80",
];

const easeIntoFocus = cubicBezier(0.22, 1, 0.36, 1);
const easeOutOfFocus = cubicBezier(0, 0, 0.58, 1);
const focusEase: [typeof easeIntoFocus, typeof easeOutOfFocus] = [
  easeIntoFocus,
  easeOutOfFocus,
];

export type MaxWidthToken =
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "none";

export type GapToken = 4 | 6 | 8 | 10 | 12 | 14;

const MAX_WIDTH_CLASS: Record<MaxWidthToken, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
  none: "",
};

const GAP_CLASS: Record<GapToken, string> = {
  4: "gap-4",
  6: "gap-6",
  8: "gap-8",
  10: "gap-10",
  12: "gap-12",
  14: "gap-14",
};

type Side = "L" | "R";

type TileConfig = {
  perspective: number;
  maxTilt: number;
  maxBlur: number;
};

function Tile({
  item,
  side,
  config,
  currentUser,
  onUpdate,
}: {
  item: any;
  side: Side;
  config: TileConfig;
  currentUser?: any;
  onUpdate?: () => void;
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress: p } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const reduce = useReducedMotion();
  const sign = side === "L" ? -1 : 1;
  const { perspective, maxTilt, maxBlur } = config;

  const blur = useTransform(p, [0, 0.5, 1], [maxBlur, 0, maxBlur], { ease: focusEase });
  const bright = useTransform(p, [0, 0.5, 1], [0.5, 1, 0.5], { ease: focusEase });
  const contrast = useTransform(p, [0, 0.5, 1], [1.5, 1, 1.5], { ease: focusEase });

  const ty = useTransform(p, [0, 0.5, 1], ["50%", "0%", "-50%"], { ease: focusEase });
  const tz = useTransform(p, [0, 0.5, 1], [200, 0, 200], { ease: focusEase });
  const rx = useTransform(p, [0, 0.5, 1], [maxTilt, 0, -maxTilt], { ease: focusEase });

  const tx = useTransform(p, [0, 0.5, 1], [`${sign * 20}%`, "0%", `${sign * 20}%`], { ease: focusEase });
  const rot = useTransform(p, [0, 0.5, 1], [-sign * 5, 0, sign * 5], { ease: focusEase });
  const sk = useTransform(p, [0, 0.5, 1], [sign * 10, 0, -sign * 10], { ease: focusEase });

  const filter = useMotionTemplate`blur(${blur}px) brightness(${bright}) contrast(${contrast})`;

  const isPostObj = typeof item === 'object' && item !== null && 'id' in item;

  if (reduce) {
    return (
      <figure ref={ref} className="relative z-10 m-0 w-full">
        {isPostObj ? (
          <PostCard post={item} currentUser={currentUser} onUpdate={onUpdate} />
        ) : (
          <div className="relative w-full aspect-[3/4] overflow-hidden rounded-xl">
             <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url("${item}")` }} />
          </div>
        )}
      </figure>
    );
  }

  return (
    <motion.figure
      ref={ref}
      className="relative z-10 m-0 w-full"
      style={{ perspective, willChange: "transform" }}
    >
      <motion.div
        className="relative w-full will-change-[filter,transform]"
        style={{
          filter,
          x: tx,
          y: ty,
          z: tz,
          rotate: rot,
          rotateX: rx,
          skewX: sk,
        }}
      >
        {isPostObj ? (
          <PostCard post={item} currentUser={currentUser} onUpdate={onUpdate} />
        ) : (
          <div className="relative w-full aspect-[3/4] overflow-hidden rounded-xl">
            <div className="absolute inset-0 bg-cover bg-center will-change-transform" style={{ backgroundImage: `url("${item}")`, backfaceVisibility: "hidden" }} />
          </div>
        )}
      </motion.div>
    </motion.figure>
  );
}

export type ScrollTiltedGridProps = {
  items?: readonly any[];
  loop?: boolean;
  initialCycles?: number;
  maxWidth?: MaxWidthToken;
  gap?: GapToken;
  perspective?: number;
  maxTilt?: number;
  maxBlur?: number;
  className?: string;
  currentUser?: any;
  onUpdate?: () => void;
};

export function ScrollTiltedGrid({
  items = DEFAULT_GRID_IMAGES,
  loop = false,
  initialCycles = 3,
  maxWidth = "3xl",
  gap = 10,
  perspective = 900,
  maxTilt = 40,
  maxBlur = 4,
  className,
  currentUser,
  onUpdate,
}: ScrollTiltedGridProps = {}) {
  const [cycles, setCycles] = useState(loop ? initialCycles : 1);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loop) return;
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setCycles((c) => c + 2);
        }
      },
      { rootMargin: "1500px 0px 1500px 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [loop]);

  const displayItems = useMemo(
    () =>
      loop
        ? Array.from({ length: cycles }, () => items).flat()
        : [...items],
    [loop, cycles, items],
  );

  const config = useMemo<TileConfig>(
    () => ({ perspective, maxTilt, maxBlur }),
    [perspective, maxTilt, maxBlur],
  );

  const gridClass = [
    "mx-auto mt-[10vh] mb-[10vh] grid w-full grid-cols-1 md:grid-cols-2 px-6 py-[10vh]",
    MAX_WIDTH_CLASS[maxWidth],
    GAP_CLASS[gap],
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section
      className={["relative w-full", className].filter(Boolean).join(" ")}
    >
      <div className={gridClass}>
        {displayItems.map((item, i) => (
          <Tile
            key={typeof item === 'string' ? `${i}-${item}` : `${i}-${item.id}`}
            item={item}
            side={i % 2 === 0 ? "L" : "R"}
            config={config}
            currentUser={currentUser}
            onUpdate={onUpdate}
          />
        ))}
      </div>
      {loop ? (
        <div ref={sentinelRef} aria-hidden className="h-px w-full" />
      ) : null}
    </section>
  );
}
