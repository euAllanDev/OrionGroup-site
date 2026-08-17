"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { useGSAP } from "@gsap/react";
import { OrionMascot3D } from "./OrionMascot3D";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin, useGSAP);

export function ProjectsIntro() {
  const sectionRef = useRef<HTMLElement>(null);
  const mascotRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const copyRef = useRef<HTMLParagraphElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const section = sectionRef.current;
    const mascot = mascotRef.current;
    const path = pathRef.current;
    if (!section || !mascot || !path) return;

    gsap.set(path, { strokeDasharray: 1200, strokeDashoffset: 1200, opacity: 0.12 });
    gsap.set(mascot, { opacity: 0, scale: 0.72 });

    const tl = gsap.timeline({
      defaults: { ease: "power2.inOut" },
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "+=760",
        pin: true,
        scrub: 0.42,
        anticipatePin: 1,
      },
    });

    tl.fromTo(labelRef.current, { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.2 })
      .fromTo(titleRef.current, { y: 70, opacity: 0, rotateX: -12 }, { y: 0, opacity: 1, rotateX: 0, duration: 0.45, ease: "power3.out" }, 0.02)
      .fromTo(copyRef.current, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3 }, 0.16)
      .to(path, { strokeDashoffset: 0, opacity: 0.68, duration: 0.78, ease: "none" }, 0.12)
      .to(mascot, { opacity: 1, scale: 1, duration: 0.18 }, 0.16)
      .to(mascot, {
        motionPath: { path, align: path, alignOrigin: [0.5, 0.5], autoRotate: 0, start: 0, end: 0.8 },
        rotation: -6,
        duration: 0.78,
        ease: "none",
      }, 0.18)
      .to(titleRef.current, { xPercent: -4.5, scale: 0.99, duration: 0.26 }, 0.7)
      .to(mascot, { rotation: 7, scale: 1.07, duration: 0.12, yoyo: true, repeat: 1, ease: "power2.inOut" }, 0.72)
      .to(mascot, {
        motionPath: { path, align: path, alignOrigin: [0.5, 0.5], autoRotate: 0, start: 0.8, end: 1 },
        scale: 0.9,
        rotation: -10,
        duration: 0.28,
        ease: "power2.in",
      }, 0.86)
      // Keep the copy present until the pin releases: no blank tail.
      .to([titleRef.current, copyRef.current, labelRef.current], { opacity: 0.72, y: -10, duration: 0.12 }, 1.02);

    return () => tl.kill();
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="projects-intro projects-intro-v3" id="projects">
      <div className="cloud cloud-1" />
      <div className="cloud cloud-2" />
      <div className="projects-intro-inner">
        <div ref={labelRef} className="intro-tag">02 / Nossos projetos</div>
        <h2 ref={titleRef}>Conheça alguns de<br />nossos <span>projetos</span></h2>
        <p ref={copyRef}>Produtos diferentes, com uma mesma ideia por trás: construir software com intenção.</p>
      </div>

      <svg className="pull-path-svg" viewBox="0 0 1600 900" preserveAspectRatio="none" aria-hidden="true">
        <path ref={pathRef} d="M 1740 420 C 1420 350, 1320 560, 1120 500 C 900 430, 820 300, 640 365 C 470 425, 510 610, 320 660" />
      </svg>
      <div ref={mascotRef} className="pull-mascot motion-path-mascot"><OrionMascot3D compact /></div>
      <div className="intro-spark i1">✦</div>
      <div className="intro-spark i2">✦</div>
      <div className="intro-spark i3">✦</div>
    </section>
  );
}
