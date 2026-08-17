"use client";

import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useRef } from "react";
import { OrionMascot3D } from "./OrionMascot3D";
import { MagneticLink } from "./MagneticLink";

export function FinalCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.42 });
  const mascotY = useTransform(smooth, [0, 1], [120, -90]);
  const mascotRotate = useTransform(smooth, [0, 1], [-8, 8]);
  const titleY = useTransform(smooth, [0, 1], [75, -35]);
  const planetScale = useTransform(smooth, [0, 1], [0.82, 1.15]);

  return (
    <section ref={sectionRef} className="final-cta" id="journey">
      <div className="final-stars">
        <motion.i animate={{ y: [0, -12, 0], rotate: [0, 24, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>✦</motion.i>
        <motion.i animate={{ y: [0, 10, 0], scale: [1, 1.25, 1] }} transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}>✦</motion.i>
        <motion.i animate={{ y: [0, -7, 0] }} transition={{ duration: 3.3, repeat: Infinity, ease: "easeInOut" }}>✦</motion.i>
      </div>

      <motion.div className="final-copy" style={{ y: titleY }}>
        <span>04 / THE NEXT ORBIT</span>
        <h2>TEM UMA<br /><em>IDEIA?</em></h2>
        <p>Vamos construir.</p>
        <div className="final-actions">
          <MagneticLink className="button final-button" href="mailto:hello@orion.group">Falar com o Orion <b>↗</b></MagneticLink>
          <MagneticLink className="final-link" href="https://github.com/euAllanDev" target="_blank" rel="noreferrer">Acompanhar a jornada →</MagneticLink>
        </div>
      </motion.div>

      <motion.div className="final-mascot" style={{ y: mascotY, rotate: mascotRotate }} whileHover={{ scale: 1.045, rotate: 2 }}>
        <OrionMascot3D />
      </motion.div>
      <motion.div className="final-planet" style={{ scale: planetScale }} />
      <div className="final-orbit-rings" aria-hidden="true"><i /><i /><i /></div>
      <footer><span>ORION GROUP © 2026</span><span>WE BUILD WHAT SHOULD EXIST.</span></footer>
    </section>
  );
}
