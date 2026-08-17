"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { MouseEvent, PropsWithChildren } from "react";

type Props = PropsWithChildren<{
  href: string;
  className?: string;
  target?: string;
  rel?: string;
}>;

export function MagneticLink({ href, className = "", target, rel, children }: Props) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 330, damping: 22, mass: 0.35 });
  const sy = useSpring(y, { stiffness: 330, damping: 22, mass: 0.35 });

  const move = (event: MouseEvent<HTMLAnchorElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - rect.left - rect.width / 2) * 0.16);
    y.set((event.clientY - rect.top - rect.height / 2) * 0.16);
  };

  const leave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      href={href}
      target={target}
      rel={rel}
      className={`${className} magnetic interactive`}
      style={{ x: sx, y: sy }}
      onMouseMove={move}
      onMouseLeave={leave}
      whileTap={{ scale: 0.96 }}
    >
      {children}
    </motion.a>
  );
}
