"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { useGSAP } from "@gsap/react";
import { OrionMascot3D } from "./OrionMascot3D";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin, useGSAP);

export function ServicesBridge() {
  const sectionRef = useRef<HTMLElement>(null);
  const mascotRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const wordRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const section = sectionRef.current;
    const mascot = mascotRef.current;
    const path = pathRef.current;
    if (!section || !mascot || !path) return;

    gsap.set(path, { strokeDasharray: 1500, strokeDashoffset: 1500 });
    gsap.set(mascot, { opacity: 0, scale: 0.68 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 100%",
        end: "bottom 42%",
        scrub: 0.4,
      },
    });

    tl.fromTo(textRef.current, { y: 48, opacity: 0.28 }, { y: 0, opacity: 1, duration: 0.42, ease: "power3.out" })
      .fromTo(wordRef.current, { backgroundSize: "0% 16%" }, { backgroundSize: "100% 16%", duration: 0.38, ease: "power2.out" }, 0.16)
      .to(path, { strokeDashoffset: 0, duration: 0.8, ease: "none" }, 0.1)
      .to(mascot, { opacity: 1, scale: 1, duration: 0.16 }, 0.16)
      .to(mascot, {
        motionPath: { path, align: path, alignOrigin: [0.5, 0.5], autoRotate: 0, start: 0, end: 1 },
        rotation: -8,
        duration: 0.86,
        ease: "none",
      }, 0.18)
      .to(mascot, { scale: 1.08, rotation: 4, duration: 0.12, yoyo: true, repeat: 1 }, 0.88);
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="services-bridge services-bridge-v3" id="ecosystem">
      <div ref={textRef} className="bridge-copy">
        <span>03 / Do nosso produto para o seu negócio</span>
        <h2>SEU NEGÓCIO<br />PODE SER<br /><em ref={wordRef}>O PRÓXIMO.</em></h2>
        <p>A mesma capacidade usada para criar nossos produtos agora transforma a necessidade do seu estabelecimento em uma solução própria.</p>
      </div>

      <svg className="bridge-motion-path" viewBox="0 0 1600 900" preserveAspectRatio="none" aria-hidden="true">
        <path ref={pathRef} id="services-bridge-path" d="M 1700 150 C 1320 120, 1240 400, 1050 400 C 800 400, 930 690, 660 720 C 470 742, 390 650, 290 745" />
      </svg>
      <div ref={mascotRef} className="bridge-mascot bridge-motion-mascot"><OrionMascot3D sectionIndex={4} compact sleepy /></div>
      <div className="bridge-cloud b1" /><div className="bridge-cloud b2" />
      <div className="bridge-spark s1">✦</div><div className="bridge-spark s2">✦</div>
    </section>
  );
}
