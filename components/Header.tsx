"use client";

import { motion } from "motion/react";
import { MagneticLink } from "./MagneticLink";

export function Header() {
  return (
    <motion.header
      className="site-header"
      initial={{ y: -28, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
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
        <a href="#top">Início</a>
        <a href="#projects">Produtos</a>
        <a href="#ecosystem">Ecossistema</a>
        <a href="#services">Soluções</a>
        <a href="#journey">Contato</a>
      </nav>

      <MagneticLink className="header-cta" href="#journey">
        Pedir orçamento <span>↗</span>
      </MagneticLink>
    </motion.header>
  );
}
