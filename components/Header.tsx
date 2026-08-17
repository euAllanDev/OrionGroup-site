"use client";

import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { MagneticLink } from "./MagneticLink";

export function Header() {
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, { stiffness: 105, damping: 28, mass: 0.36 });
  const width = useTransform(smooth, [0, 0.055, 1], ["94vw", "88vw", "86vw"]);
  const background = useTransform(
    smooth,
    [0, 0.055],
    ["rgba(255,255,255,.83)", "rgba(255,255,255,.91)"],
  );

  return (
    <motion.header
      className="site-header"
      style={{ width, backgroundColor: background }}
      initial={{ y: -35, opacity: 0, scale: 0.97 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
    >
      <a href="#top" className="brand interactive">
        <motion.span className="orion-logo" aria-hidden="true" whileHover={{ rotate: 18, scale: 1.08 }} transition={{ type: "spring", stiffness: 260, damping: 18 }}>
          <span />
        </motion.span>
        <span className="brand-copy">
          <strong>ORION</strong>
          <small>GROUP</small>
        </span>
      </a>

      <nav className="header-nav" aria-label="Navegação principal">
        <a href="#projects">Projetos</a>
        <a href="#ecosystem">Ecossistema</a>
        <a href="#services">Serviços</a>
        <a href="#journey">Jornada</a>
      </nav>

      <MagneticLink className="header-cta" href="#services">
        Fale com a gente <span>↗</span>
      </MagneticLink>
    </motion.header>
  );
}
