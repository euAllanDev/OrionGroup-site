"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { motion } from "motion/react";
import { VaultCore3D } from "./VaultCore3D";
import { MagneticLink } from "./MagneticLink";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const knowledge = [
  ["NOTAS", "Ideias, referências e informações importantes deixam de viver isoladas."],
  ["CONEXÕES", "Relações revelam contexto entre pessoas, projetos, assuntos e decisões."],
  ["CONTEXTO", "O conhecimento certo reaparece quando ele realmente faz sentido."],
];

export function VaultSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const ringsRef = useRef<HTMLDivElement>(null);
  const stepRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const insideCopyRef = useRef<HTMLDivElement>(null);
  const featureRef = useRef<HTMLDivElement>(null);
  const signoffRef = useRef<HTMLDivElement>(null);
  const interiorBgRef = useRef<HTMLDivElement>(null);
  const exitWashRef = useRef<HTMLDivElement>(null);
  const transitionRef = useRef<HTMLDivElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);

  useGSAP(() => {
    const section = sectionRef.current;
    if (!section) return;

    const labels = gsap.utils.toArray<HTMLElement>(".knowledge-node-label", section);
    const features = gsap.utils.toArray<HTMLElement>(".vault-knowledge-card", section);
    const enterRings = gsap.utils.toArray<HTMLElement>(".vault-enter-ring", section);
    const header = document.querySelector<HTMLElement>(".site-header");

    gsap.set(introRef.current, { opacity: 0, x: -34, y: 20 });
    gsap.set(insideCopyRef.current, { opacity: 0, y: 54, scale: 0.95 });
    gsap.set(featureRef.current, { opacity: 0, y: 44 });
    gsap.set(signoffRef.current, { opacity: 0, y: 32 });
    gsap.set(labels, { opacity: 0, scale: 0.76, filter: "blur(10px)" });
    gsap.set(features, { opacity: 0, y: 34, scale: 0.95 });
    gsap.set(interiorBgRef.current, { opacity: 0 });
    gsap.set(enterRings, { opacity: 0, scale: 0.45 });
    gsap.set(exitWashRef.current, { opacity: 0, scale: 0.15 });
    gsap.set(transitionRef.current, { opacity: 0, y: 24, scale: 0.94 });
    gsap.set(portalRef.current, { opacity: 0, scale: 0.18 });
    gsap.set(".vault-door-flash", { opacity: 0, scale: 0.45 });

    const hideHeader = () => {
      if (!header) return;
      gsap.to(header, { y: -112, opacity: 0, duration: 0.32, ease: "power2.inOut", overwrite: true });
    };
    const showHeader = () => {
      if (!header) return;
      gsap.to(header, { y: 0, opacity: 1, duration: 0.34, ease: "power2.out", overwrite: true });
    };

    const tl = gsap.timeline({
      defaults: { ease: "power2.inOut" },
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "+=2350",
        pin: true,
        scrub: 0.56,
        anticipatePin: 1,
        fastScrollEnd: true,
        onEnter: hideHeader,
        onEnterBack: hideHeader,
        onLeave: showHeader,
        onLeaveBack: showHeader,
        onUpdate: (self) => {
          progressRef.current = self.progress;
          if (!stepRef.current) return;
          const p = self.progress;
          if (p < 0.11) stepRef.current.textContent = "COFRE / BLOQUEADO";
          else if (p < 0.23) stepRef.current.textContent = "AUTENTICANDO / GIRANDO DIAL";
          else if (p < 0.38) stepRef.current.textContent = "ACESSO / DESTRAVANDO";
          else if (p < 0.57) stepRef.current.textContent = "ENTRANDO / ORION VAULT";
          else if (p < 0.73) stepRef.current.textContent = "CONSTELAÇÃO / FORMANDO";
          else if (p < 0.91) stepRef.current.textContent = "KNOWLEDGE GRAPH / ONLINE";
          else stepRef.current.textContent = "CONHECIMENTO → AÇÃO";
        },
      },
    });

    // 1. The vault is the protagonist. Text stays to the side and leaves early.
    tl.to(introRef.current, { opacity: 1, x: 0, y: 0, duration: 0.12, ease: "power3.out" }, 0)
      .to(ringsRef.current, { rotate: 46, scale: 1.05, opacity: 0.4, duration: 0.28, ease: "none" }, 0.05)
      .to(introRef.current, { opacity: 0, x: -36, y: -12, duration: 0.1 }, 0.16)

      // 2. Mechanical opening and push-through. The portal now performs the
      // full-screen transition instead of blowing the 3D vault up past the canvas.
      .to(".vault-door-flash", { opacity: 0.5, scale: 0.95, duration: 0.08, ease: "power2.out" }, 0.31)
      .to(enterRings, { opacity: 0.44, scale: 1.02, duration: 0.12, stagger: 0.018, ease: "power2.out" }, 0.37)
      .to(portalRef.current, { opacity: 0.92, scale: 0.62, duration: 0.08, ease: "power2.out" }, 0.44)
      .to(portalRef.current, { opacity: 1, scale: 4.8, duration: 0.14, ease: "power3.inOut" }, 0.49)
      .to(interiorBgRef.current, { opacity: 1, duration: 0.1 }, 0.51)
      .to(enterRings, { opacity: 0.08, scale: 1.45, duration: 0.1 }, 0.51)
      .to(".vault-door-flash", { opacity: 0, scale: 1.8, duration: 0.1 }, 0.52)
      .to(portalRef.current, { opacity: 0, scale: 5.4, duration: 0.1, ease: "power2.out" }, 0.56)

      // 3. Let the constellation breathe before the copy arrives.
      .fromTo(".vault-graph-caption", { opacity: 0, y: 16 }, { opacity: 0.75, y: 0, duration: 0.09 }, 0.61)
      .fromTo(insideCopyRef.current, { opacity: 0, y: 54, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.15, ease: "power3.out" }, 0.69)
      .fromTo(".constellation-rule", { scaleX: 0 }, { scaleX: 1, duration: 0.14, ease: "power3.out" }, 0.71)
      .to(labels, { opacity: 1, scale: 1, filter: "blur(0px)", stagger: 0.018, duration: 0.12, ease: "back.out(1.35)" }, 0.75)
      .to(featureRef.current, { opacity: 1, y: 0, duration: 0.1 }, 0.8)
      .to(features, { opacity: 1, y: 0, scale: 1, stagger: 0.018, duration: 0.12, ease: "back.out(1.28)" }, 0.81)
      .to(signoffRef.current, { opacity: 1, y: 0, duration: 0.11, ease: "power3.out" }, 0.86)

      // 4. Knowledge reorganizes into action, then a light portal becomes the Task background.
      .to([insideCopyRef.current, featureRef.current, signoffRef.current], { opacity: 0.34, y: -16, duration: 0.09 }, 0.91)
      .to(labels, { opacity: 0.2, scale: 0.88, duration: 0.08 }, 0.91)
      .to(transitionRef.current, { opacity: 1, y: 0, scale: 1, duration: 0.08, ease: "power3.out" }, 0.92)
      .to(exitWashRef.current, { opacity: 1, scale: 3.8, duration: 0.11, ease: "power3.inOut" }, 0.94)
      .to(transitionRef.current, { color: "#0b1a38", duration: 0.06 }, 0.955)
      .to([insideCopyRef.current, featureRef.current, signoffRef.current], { opacity: 0, duration: 0.05 }, 0.965)
      .to(labels, { opacity: 0, duration: 0.05 }, 0.965);

    return () => {
      showHeader();
      tl.kill();
    };
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="project-section vault-section vault-cinematic vault-immersive vault-v3">
      <div ref={interiorBgRef} className="vault-interior-bg" aria-hidden="true" />
      <div className="vault-star-field" aria-hidden="true"><i /><i /><i /><i /><i /><i /></div>
      <div className="vault-door-flash" aria-hidden="true" />
      <div ref={portalRef} className="vault-entry-portal" aria-hidden="true" />
      <div className="vault-enter-rings" aria-hidden="true"><i className="vault-enter-ring" /><i className="vault-enter-ring" /><i className="vault-enter-ring" /></div>

      <div ref={introRef} className="vault-cinematic-intro vault-v3-intro">
        <span>01 / PRODUTO ORION</span>
        <h2>PRIVADO<br /><em>POR PRINCÍPIO.</em></h2>
        <p>Entre em um espaço local-first criado para organizar conhecimento sem abrir mão do controle.</p>
      </div>

      <div ref={stepRef} className="vault-step">COFRE / BLOQUEADO</div>

      <div className="vault-world-stage">
        <div ref={ringsRef} className="vault-rings vault-rings-full"><i /><i /><i /></div>
        <div className="vault-3d-shell vault-3d-shell-full"><VaultCore3D progressRef={progressRef} sectionIndex={2} /></div>
      </div>

      <div className="vault-graph-caption" aria-hidden="true">NÓ POR NÓ. CONEXÃO POR CONEXÃO.</div>

      <div ref={insideCopyRef} className="vault-inside-copy">
        <div className="vault-inside-index">ORION VAULT / CONHECIMENTO LOCAL-FIRST</div>
        <h2>SUAS INFORMAÇÕES<br /><span>CONECTADAS.</span></h2>
        <div className="constellation-rule" />
        <p>Notas, relações e contexto permanecem no seu ambiente. A IA pode sugerir; você continua no controle de cada mudança.</p>
      </div>

      <div className="vault-node-labels" aria-hidden="true">
        <span className="knowledge-node-label label-note">NOTA</span>
        <span className="knowledge-node-label label-project">PROJETO</span>
        <span className="knowledge-node-label label-person">PESSOA</span>
        <span className="knowledge-node-label label-idea">IDEIA</span>
        <span className="knowledge-node-label label-context">CONTEXTO</span>
      </div>

      <div ref={featureRef} className="vault-knowledge-grid">
        {knowledge.map(([title, text], index) => (
          <motion.article
            key={title}
            className="vault-knowledge-card interactive"
            whileHover={{ y: -8, rotate: index === 1 ? 0 : index === 0 ? -1.5 : 1.5, scale: 1.025 }}
            transition={{ type: "spring", stiffness: 280, damping: 22 }}
          >
            <span>0{index + 1}</span>
            <h3>{title}</h3>
            <p>{text}</p>
          </motion.article>
        ))}
      </div>

      <div ref={signoffRef} className="vault-signoff">
        <div>
          <small>ORION VAULT</small>
          <strong>Seu conhecimento continua seu.<br /><span>Organizado, conectado e sob controle.</span></strong>
        </div>
        <MagneticLink className="vault-signoff-link" href="https://github.com/euAllanDev/Orion-Vault" target="_blank" rel="noreferrer">
          Conhecer o Orion Vault <i>↗</i>
        </MagneticLink>
      </div>

      <div ref={transitionRef} className="vault-to-task" aria-hidden="true">
        <span>CONHECIMENTO</span><i>→</i><span>AÇÃO</span>
      </div>
      <div ref={exitWashRef} className="vault-exit-wash" aria-hidden="true" />
    </section>
  );
}
