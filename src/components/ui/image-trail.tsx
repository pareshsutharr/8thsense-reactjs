"use client";

import { Children, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AnimationSequence,
  motion,
  Target,
  Transition,
  useAnimate,
  useAnimationFrame,
} from "framer-motion";
import { v4 as uuidv4 } from "uuid";

import { useMouseVector } from "@/components/hooks/use-mouse-vector";

type TrailSegment = [Target, Transition];
type TrailAnimationSequence = TrailSegment[];

interface ImageTrailProps {
  children: React.ReactNode;
  containerRef?: React.RefObject<HTMLElement>;
  newOnTop?: boolean;
  rotationRange?: number;
  animationSequence?: TrailAnimationSequence;
  interval?: number;
  velocityDependentSpawn?: boolean;
}

interface TrailItem {
  id: string;
  x: number;
  y: number;
  rotation: number;
  animationSequence: TrailAnimationSequence;
  child: React.ReactNode;
}

const ImageTrail = ({
  children,
  newOnTop = true,
  rotationRange = 15,
  containerRef,
  animationSequence = [
    [{ scale: 1.2, opacity: 1 }, { duration: 0.12, ease: "circOut" }],
    [{ scale: 0, opacity: 0 }, { duration: 0.55, ease: "circIn" }],
  ],
  interval = 95,
}: ImageTrailProps) => {
  const [trail, setTrail] = useState<TrailItem[]>([]);
  const lastAddedTimeRef = useRef<number>(0);
  const { position: mousePosition } = useMouseVector(containerRef);
  const lastMousePosRef = useRef(mousePosition);
  const currentIndexRef = useRef(0);
  const childrenArray = useMemo(() => Children.toArray(children), [children]);

  const addToTrail = useCallback(
    (mousePos: { x: number; y: number }) => {
      if (!childrenArray.length) return;

      const newItem: TrailItem = {
        id: uuidv4(),
        x: mousePos.x,
        y: mousePos.y,
        rotation: (Math.random() - 0.5) * rotationRange * 2,
        animationSequence,
        child: childrenArray[currentIndexRef.current],
      };

      currentIndexRef.current = (currentIndexRef.current + 1) % childrenArray.length;

      setTrail((current) => {
        const next = newOnTop ? [...current, newItem] : [newItem, ...current];
        return next.slice(-18);
      });
    },
    [childrenArray, rotationRange, animationSequence, newOnTop],
  );

  const removeFromTrail = useCallback((itemId: string) => {
    setTrail((current) => current.filter((item) => item.id !== itemId));
  }, []);

  useAnimationFrame((time) => {
    if (
      lastMousePosRef.current.x === mousePosition.x &&
      lastMousePosRef.current.y === mousePosition.y
    ) {
      return;
    }

    lastMousePosRef.current = mousePosition;

    if (time - lastAddedTimeRef.current < interval) {
      return;
    }

    lastAddedTimeRef.current = time;
    addToTrail(mousePosition);
  });

  return (
    <div className="pointer-events-none absolute inset-0 z-20 h-full w-full">
      {trail.map((item) => (
        <TrailItem key={item.id} item={item} onComplete={removeFromTrail} />
      ))}
    </div>
  );
};

interface TrailItemProps {
  item: TrailItem;
  onComplete: (id: string) => void;
}

const TrailItem = ({ item, onComplete }: TrailItemProps) => {
  const [scope, animate] = useAnimate();

  useEffect(() => {
    const sequence = item.animationSequence.map((segment: TrailSegment) => [
      scope.current,
      ...segment,
    ]);

    animate(sequence as AnimationSequence).then(() => {
      onComplete(item.id);
    });
  }, [animate, item, onComplete, scope]);

  return (
    <motion.div
      ref={scope}
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{
        left: item.x,
        top: item.y,
        rotate: item.rotation,
      }}
    >
      {item.child}
    </motion.div>
  );
};

export { ImageTrail };
