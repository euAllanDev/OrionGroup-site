"use client";

import { PropsWithChildren, useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionConfig } from "motion/react";

gsap.registerPlugin(ScrollTrigger);

export function SmoothScroll({ children }: PropsWithChildren) {
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      ScrollTrigger.refresh();
      return;
    }

    const lenis = new Lenis({
      lerp: 0.075,
      smoothWheel: true,
      wheelMultiplier: 0.88,
      touchMultiplier: 1.05,
      infinite: false,
      anchors: true,
    });

    ScrollTrigger.config({ ignoreMobileResize: true });

    const update = (time: number) => lenis.raf(time * 1000);
    const refresh = () => ScrollTrigger.refresh();
    const refreshFrame = requestAnimationFrame(refresh);

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);
    window.addEventListener("load", refresh, { once: true });

    window.addEventListener("orientationchange", refresh);

    return () => {
      cancelAnimationFrame(refreshFrame);
      window.removeEventListener("load", refresh);
      window.removeEventListener("orientationchange", refresh);
      gsap.ticker.remove(update);
      lenis.destroy();
    };
  }, []);

  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
