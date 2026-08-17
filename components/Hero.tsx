"use client";

import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useRef } from "react";
import { OrionMascot3D } from "./OrionMascot3D";
import { MagneticLink } from "./MagneticLink";

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const smooth = useSpring(scrollYProgress, { stiffness: 105, damping: 25, mass: 0.4 });
  const copyY = useTransform(smooth, [0, 1], [0, 115]);
  const copyOpacity = useTransform(smooth, [0, 0.75, 1], [1, 0.75, 0]);
  const visualY = useTransform(smooth, [0, 1], [0, -95]);
  const visualScale = useTransform(smooth, [0, 1], [1, 1.12]);
  const orbitRotate = useTransform(smooth, [0, 1], [0, 45]);

  return (
    <section ref={sectionRef} className="hero-section" id="top">
      <motion.div className="hero-orbit hero-orbit-a" style={{ rotate: orbitRotate }} />
      <motion.div className="hero-orbit hero-orbit-b" style={{ rotate: orbitRotate }} />
      <motion.span className="spark spark-a" animate={{ y: [0, -8, 0], rotate: [0, 18, 0] }} transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}>✦</motion.span>
      <motion.span className="spark spark-b" animate={{ y: [0, 9, 0], scale: [1, 1.18, 1] }} transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut" }}>✦</motion.span>
      <motion.span className="spark spark-c" animate={{ y: [0, -5, 0], rotate: [0, -16, 0] }} transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}>✦</motion.span>

      <div className="hero-inner">
        <motion.div className="hero-copy" style={{ y: copyY, opacity: copyOpacity }}>
          <motion.div
            className="hero-kicker"
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
          >
            ✦ Sistemas que pensam. Produtos que ficam.
          </motion.div>

          <h1 aria-label="We build what should exist">
            <span className="hero-line-mask">
              <motion.span
                initial={{ y: "115%", rotate: 2 }}
                animate={{ y: 0, rotate: 0 }}
                transition={{ duration: 0.9, delay: 0.22, ease: [0.2, 0.9, 0.2, 1] }}
              >
                WE BUILD
              </motion.span>
            </span>
            <span className="hero-line-mask">
              <motion.span
                className="blue"
                initial={{ y: "115%", rotate: 2 }}
                animate={{ y: 0, rotate: 0 }}
                transition={{ duration: 0.9, delay: 0.31, ease: [0.2, 0.9, 0.2, 1] }}
              >
                WHAT SHOULD
              </motion.span>
            </span>
            <span className="hero-line-mask">
              <motion.span
                className="blue hero-exist"
                initial={{ y: "115%", rotate: 2 }}
                animate={{ y: 0, rotate: 0 }}
                transition={{ duration: 0.9, delay: 0.4, ease: [0.2, 0.9, 0.2, 1] }}
              >
                EXIST.
              </motion.span>
            </span>
          </h1>

          <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.72, duration: 0.75 }}>
            O Orion Group transforma ideias em produtos digitais, sistemas inteligentes e experiências que têm personalidade própria.
          </motion.p>

          <motion.div className="hero-actions" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.84, duration: 0.7 }}>
            <MagneticLink href="#projects" className="button button-primary">Explorar projetos <span>↘</span></MagneticLink>
            <MagneticLink href="#services" className="button button-secondary">Ver serviços <span>✦</span></MagneticLink>
          </motion.div>
        </motion.div>

        <motion.div
          className="hero-visual"
          style={{ y: visualY, scale: visualScale }}
          initial={{ opacity: 0, scale: 0.82, x: 110, rotate: 4 }}
          animate={{ opacity: 1, scale: 1, x: 0, rotate: 0 }}
          transition={{ duration: 1.18, delay: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <div className="mascot-glow" />
          <motion.div className="mascot-canvas hero-mascot-shell" animate={{ y: [0, -10, 0] }} transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}>
            <OrionMascot3D />
          </motion.div>
          <motion.div className="orbit-line orbit-line-1" animate={{ rotate: [-13, 347] }} transition={{ duration: 26, repeat: Infinity, ease: "linear" }} />
          <motion.div className="orbit-line orbit-line-2" animate={{ rotate: [24, -336] }} transition={{ duration: 32, repeat: Infinity, ease: "linear" }} />

        </motion.div>
      </div>

      <motion.div className="scroll-hint" animate={{ y: [0, 7, 0] }} transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}>
        <span className="scroll-pill"><i /></span> Role para entrar no universo
      </motion.div>
    </section>
  );
}
