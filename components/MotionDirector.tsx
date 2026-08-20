"use client";

import { motion, useMotionValueEvent, useScroll, useSpring, useTransform } from "motion/react";
import { useEffect } from "react";

export function MotionDirector() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 95,
    damping: 24,
    mass: 0.34,
    restDelta: 0.0005,
  });

  const ambientAY = useTransform(progress, [0, 1], ["-8vh", "52vh"]);
  const ambientARotate = useTransform(progress, [0, 1], [-18, 145]);
  const ambientBY = useTransform(progress, [0, 1], ["18vh", "-46vh"]);
  const ambientBRotate = useTransform(progress, [0, 1], [24, -120]);

  useMotionValueEvent(progress, "change", (value) => {
    document.documentElement.style.setProperty("--page-progress", value.toFixed(4));
  });

  useEffect(() => {
    const root = document.documentElement;
    let frame = 0;
    let tx = 0.5;
    let ty = 0.5;
    let x = tx;
    let y = ty;

    const onPointerMove = (event: PointerEvent) => {
      tx = event.clientX / window.innerWidth;
      ty = event.clientY / window.innerHeight;
      if (!frame) frame = requestAnimationFrame(loop);
    };

    const loop = () => {
      x += (tx - x) * 0.075;
      y += (ty - y) * 0.075;
      root.style.setProperty("--pointer-x", x.toFixed(4));
      root.style.setProperty("--pointer-y", y.toFixed(4));
      if (Math.abs(tx - x) + Math.abs(ty - y) > 0.001) {
        frame = requestAnimationFrame(loop);
      } else {
        x = tx;
        y = ty;
        frame = 0;
      }
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, []);

  return (
    <div className="motion-director" aria-hidden="true">
      <motion.div className="global-progress" style={{ scaleX: progress }} />
      <motion.div className="ambient-blob ambient-blob-a" style={{ y: ambientAY, rotate: ambientARotate }} />
      <motion.div className="ambient-blob ambient-blob-b" style={{ y: ambientBY, rotate: ambientBRotate }} />
      <div className="grain-layer" />
    </div>
  );
}
