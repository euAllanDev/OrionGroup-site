"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { motion } from "motion/react";
import { TaskMotion3D } from "./TaskMotion3D";
import { MagneticLink } from "./MagneticLink";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const tasks = [
  ["Cliente sem acesso ao painel", "ABERTO", "Urgente"],
  ["Dúvida sobre faturamento", "11:00", "Média prioridade"],
  ["Configurar novo usuário", "14:20", "Alta prioridade"],
  ["Atualização concluída", "16:00", "Resolvido"],
];

export function TaskSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const flowRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const section = sectionRef.current;
    const shell = shellRef.current;
    const copy = copyRef.current;
    const cards = cardsRef.current?.querySelectorAll(".task-card");
    if (!section || !shell || !copy || !cards) return;

    gsap.set(cards, {
      x: (i) => (i % 2 === 0 ? 100 : -82),
      y: (i) => 54 + i * 6,
      rotate: (i) => (i - 1.5) * 5,
      opacity: 0,
      scale: 0.94,
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 98%",
        end: "center 34%",
        scrub: 0.42,
      },
    });

    tl.fromTo(shell, { x: -72, y: 34, rotate: -4, opacity: 0.2, scale: 0.94 }, { x: 0, y: 0, rotate: -1.2, opacity: 1, scale: 1, duration: 0.52, ease: "power3.out" }, 0)
      .fromTo(copy, { x: 58, opacity: 0.2 }, { x: 0, opacity: 1, duration: 0.44, ease: "power3.out" }, 0.02)
      .fromTo(flowRef.current, { opacity: 0.18, scale: 0.9, rotate: 5 }, { opacity: 0.82, scale: 1, rotate: 0, duration: 0.46, ease: "power3.out" }, 0.08)
      .to(cards, { x: 0, y: 0, rotate: 0, opacity: 1, scale: 1, stagger: 0.075, duration: 0.34, ease: "back.out(1.28)" }, 0.28)
      .to(".task-progress span", { width: "86%", duration: 0.6, ease: "none" }, 0.42)
      .to(flowRef.current, { x: 26, y: -12, rotate: -3, duration: 0.42, ease: "none" }, 0.72);
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="project-section task-section task-section-v3">
      <div className="task-orb t1" /><div className="task-orb t2" />
      <div ref={flowRef} className="task-flow-3d" aria-hidden="true"><TaskMotion3D sectionIndex={3} /></div>
      <div className="task-speed-lines" aria-hidden="true"><i /><i /><i /><i /></div>

      <div className="project-grid reverse project-grid-motion">
        <motion.div ref={shellRef} className="task-ui-shell interactive" whileHover={{ rotate: 0, scale: 1.012 }} transition={{ type: "spring", stiffness: 230, damping: 24 }}>
          <div className="task-ui-top"><strong>ORION TASK</strong><span>CENTRAL DE SUPORTE</span></div>
          <div className="task-progress"><span style={{ width: "68%" }} /></div>
          <div className="task-columns">
            <div className="task-sidebar"><b>ATENDIMENTO</b><span>Novos <i>6</i></span><span>Em andamento</span><span>Clientes</span><span>Relatórios</span></div>
            <div ref={cardsRef} className="task-list">
              <div className="task-list-title"><div><small>FILA DA EQUIPE</small><strong>Tickets</strong></div><b>4 chamados</b></div>
              {tasks.map(([name, time, priority], index) => (
                <motion.div className="task-card" key={name} whileHover={{ x: 8, scale: 1.012 }} transition={{ type: "spring", stiffness: 360, damping: 24 }}>
                  <span className={`task-check ${index === 0 ? "done" : ""}`}>{index === 0 ? "✓" : ""}</span>
                  <div><b>{name}</b><small>{priority}</small></div>
                  <time>{time}</time>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        <div ref={copyRef} className="project-copy-block task-copy">
          <div className="project-index"><span>02</span> EM DESENVOLVIMENTO</div>
          <h2>ORION<br /><span>TASK</span></h2>
          <h3>Atendimento organizado.<br />Cliente acompanhado.</h3>
          <p>Um sistema de suporte e gestão de tickets pensado para pequenas empresas acompanharem solicitações, prioridades e clientes em um só lugar.</p>
          <div className="tag-row"><span>Suporte</span><span>Tickets</span><span>Clientes</span><span>Gestão</span></div>
          <MagneticLink className="project-link" href="https://github.com/euAllanDev/OrionTask" target="_blank" rel="noreferrer">
            Acompanhar o desenvolvimento <i>↗</i>
          </MagneticLink>
        </div>
      </div>
    </section>
  );
}
