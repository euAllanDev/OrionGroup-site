"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { OrionMascot3D } from "./OrionMascot3D";
import { MagneticLink } from "./MagneticLink";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const questions = [
  "Vocês podem criar um site para a minha barbearia?",
  "Vocês podem criar um site para a minha pizzaria?",
  "Vocês podem criar um site para a minha loja de maquiagem?",
  "Vocês podem criar um site para a minha...?",
];

export function ServicesStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const phoneTiltRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const mascotRef = useRef<HTMLDivElement>(null);
  const previewsRef = useRef<HTMLDivElement>(null);
  const finaleRef = useRef<HTMLDivElement>(null);
  const finaleInnerRef = useRef<HTMLDivElement>(null);
  const finalAnswerRef = useRef<HTMLDivElement>(null);
  const stepRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const orbitPathRef = useRef<SVGPathElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = sectionRef.current;
    const tilt = phoneTiltRef.current;
    if (!stage || !tilt || window.matchMedia("(pointer: coarse)").matches) return;

    const rotX = gsap.quickTo(tilt, "rotationX", { duration: 0.42, ease: "power3.out" });
    const rotY = gsap.quickTo(tilt, "rotationY", { duration: 0.42, ease: "power3.out" });

    const move = (event: PointerEvent) => {
      const rect = stage.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
      rotY(x * 3.2);
      rotX(-y * 2.2);
    };
    const leave = () => { rotX(0); rotY(0); };

    stage.addEventListener("pointermove", move, { passive: true });
    stage.addEventListener("pointerleave", leave);
    return () => {
      stage.removeEventListener("pointermove", move);
      stage.removeEventListener("pointerleave", leave);
    };
  }, []);

  useGSAP(() => {
    const section = sectionRef.current;
    const phone = phoneRef.current;
    const chat = chatRef.current;
    const orbitPath = orbitPathRef.current;
    if (!section || !phone || !chat || !orbitPath) return;

    const messages = gsap.utils.toArray<HTMLElement>(".chat-message", section);
    const previews = gsap.utils.toArray<HTMLElement>(".service-preview", section);
    const floatIcons = gsap.utils.toArray<HTMLElement>(".service-float-icon", section);

    gsap.set(messages, { opacity: 0, y: 58, scale: 0.92, filter: "blur(5px)" });
    gsap.set(previews, { opacity: 0, x: 135, rotate: 8, scale: 0.84, filter: "blur(14px)" });
    gsap.set(floatIcons, { opacity: 0, scale: 0.55, y: 25 });
    gsap.set(phone, { x: 420, rotateZ: 10, scale: 0.7, opacity: 0 });
    gsap.set(mascotRef.current, { x: 330, y: -100, rotate: -14, scale: 0.62, opacity: 0 });
    gsap.set(finaleRef.current, { opacity: 1, pointerEvents: "none", clipPath: "circle(0% at 72% 52%)" });
    gsap.set(finaleInnerRef.current, { opacity: 0, scale: 0.62, y: 54 });
    gsap.set(orbitPath, { strokeDasharray: 1700, strokeDashoffset: 1700, opacity: 0 });

    const tl = gsap.timeline({
      defaults: { ease: "power2.out" },
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "+=6800",
        pin: true,
        scrub: 0.62,
        anticipatePin: 1,
        fastScrollEnd: true,
        onUpdate: (self) => {
          if (!stepRef.current) return;
          const p = self.progress;
          if (p < 0.2) stepRef.current.textContent = "01 / BARBEARIA";
          else if (p < 0.38) stepRef.current.textContent = "02 / PIZZARIA";
          else if (p < 0.56) stepRef.current.textContent = "03 / MAQUIAGEM";
          else if (p < 0.74) stepRef.current.textContent = "04 / E SE FOR...";
          else stepRef.current.textContent = "05 / QUALQUER IDEIA";
        },
      },
    });

    tl.to(orbitPath, { strokeDashoffset: 0, opacity: 0.42, duration: 1.3, ease: "none" }, 0)
      .fromTo(copyRef.current, { x: -90, opacity: 0 }, { x: 0, opacity: 1, duration: 0.75, ease: "power3.out" }, 0)
      .to(phone, { x: 0, rotateZ: 0, scale: 1, opacity: 1, duration: 1.05, ease: "back.out(1.15)" }, 0.12)
      .to(mascotRef.current, { x: 0, y: -20, rotate: 3, scale: 1, opacity: 1, duration: 1.0, ease: "back.out(1.2)" }, 0.15)
      .to(glowRef.current, { xPercent: -7, scale: 1.12, duration: 1.0, ease: "none" }, 0.22)

      // Barbearia
      .to(messages[0], { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 0.42, ease: "back.out(1.3)" }, 0.88)
      .to(previews[0], { opacity: 0.96, x: 0, rotate: -1.8, scale: 1, filter: "blur(0px)", duration: 0.62, ease: "power3.out" }, 0.9)
      .to(floatIcons[0], { opacity: 1, scale: 1, y: 0, rotate: -8, duration: 0.42, ease: "back.out(1.8)" }, 1.0)
      .to(messages[1], { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 0.4, ease: "back.out(1.45)" }, 1.28)
      .to(phone, { scale: 1.025, duration: 0.14, yoyo: true, repeat: 1, ease: "power2.inOut" }, 1.31)
      .to(mascotRef.current, { x: -72, y: 72, rotate: -9, duration: 0.48, ease: "power2.inOut" }, 1.6)
      .to(previews[0], { opacity: 0, x: -120, rotate: -5, scale: 0.86, filter: "blur(12px)", duration: 0.45 }, 1.73)
      .to(floatIcons[0], { opacity: 0, y: -35, scale: 0.65, duration: 0.3 }, 1.75)
      .to(chat, { y: -142, duration: 0.52, ease: "power2.inOut" }, 1.76)

      // Pizzaria
      .to(messages[2], { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 0.4, ease: "back.out(1.3)" }, 2.02)
      .to(previews[1], { opacity: 0.96, x: 0, rotate: 1.8, scale: 1, filter: "blur(0px)", duration: 0.62, ease: "power3.out" }, 2.04)
      .to(floatIcons[1], { opacity: 1, scale: 1, y: 0, rotate: 10, duration: 0.42, ease: "back.out(1.8)" }, 2.1)
      .to(messages[3], { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 0.4, ease: "back.out(1.45)" }, 2.38)
      .to(phone, { rotateZ: 1.4, scale: 1.025, duration: 0.16, yoyo: true, repeat: 1 }, 2.41)
      .to(mascotRef.current, { x: 38, y: 122, rotate: 8, duration: 0.5, ease: "power2.inOut" }, 2.65)
      .to(previews[1], { opacity: 0, x: -120, rotate: 5, scale: 0.86, filter: "blur(12px)", duration: 0.45 }, 2.82)
      .to(floatIcons[1], { opacity: 0, y: -35, scale: 0.65, duration: 0.3 }, 2.84)
      .to(chat, { y: -292, duration: 0.54, ease: "power2.inOut" }, 2.86)

      // Maquiagem
      .to(messages[4], { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 0.4, ease: "back.out(1.3)" }, 3.12)
      .to(previews[2], { opacity: 0.96, x: 0, rotate: -1.2, scale: 1, filter: "blur(0px)", duration: 0.62, ease: "power3.out" }, 3.14)
      .to(floatIcons[2], { opacity: 1, scale: 1, y: 0, rotate: -4, duration: 0.42, ease: "back.out(1.8)" }, 3.2)
      .to(messages[5], { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 0.4, ease: "back.out(1.45)" }, 3.5)
      .to(phone, { rotateZ: -1.2, scale: 1.025, duration: 0.16, yoyo: true, repeat: 1 }, 3.53)
      .to(mascotRef.current, { x: -38, y: -6, rotate: -4, scale: 1.11, duration: 0.58, ease: "power2.inOut" }, 3.76)
      .to(previews[2], { opacity: 0, x: -120, rotate: -5, scale: 0.86, filter: "blur(12px)", duration: 0.45 }, 3.95)
      .to(floatIcons[2], { opacity: 0, y: -35, scale: 0.65, duration: 0.3 }, 3.97)
      .to(chat, { y: -448, duration: 0.56, ease: "power2.inOut" }, 4.0)

      // Pergunta final + pausa
      .to(messages[6], { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 0.46, ease: "back.out(1.25)" }, 4.32)
      .to(mascotRef.current, { y: -38, rotate: 6, scale: 1.14, duration: 0.22, yoyo: true, repeat: 3, ease: "sine.inOut" }, 4.7)
      .to(glowRef.current, { scale: 1.35, opacity: 0.75, duration: 0.6 }, 4.74)
      .to(messages[7], { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 0.44, ease: "back.out(1.6)" }, 5.12)
      .to(phone, { scale: 1.055, duration: 0.18, yoyo: true, repeat: 1 }, 5.14)

      // Explosão da resposta — then an opaque circular wipe cleans the old scene completely.
      .to(finalAnswerRef.current, { scale: 5.25, x: -78, y: -52, rotate: -2, duration: 0.72, ease: "power3.inOut" }, 5.55)
      .to(phone, { x: 220, rotateZ: -8, scale: 0.56, opacity: 0, filter: "blur(7px)", duration: 0.58, ease: "power3.in" }, 5.6)
      .to(mascotRef.current, { x: -260, y: -130, rotate: -16, scale: 0.72, opacity: 0, duration: 0.54, ease: "power3.in" }, 5.6)
      .to([copyRef.current, previewsRef.current, glowRef.current, orbitPath, ...floatIcons], { opacity: 0, duration: 0.38, ease: "power2.in" }, 5.66)
      .to(finaleRef.current, { clipPath: "circle(145% at 72% 52%)", pointerEvents: "auto", duration: 0.58, ease: "power3.inOut" }, 5.78)
      .to(finalAnswerRef.current, { opacity: 0, duration: 0.16 }, 5.9)
      .to(finaleInnerRef.current, { opacity: 1, scale: 1, y: 0, duration: 0.52, ease: "back.out(1.16)" }, 5.94)
      .fromTo(".finale-ray", { scaleX: 0, opacity: 0 }, { scaleX: 1, opacity: 1, stagger: 0.045, duration: 0.48, ease: "power2.out" }, 6.0);

    return () => tl.kill();
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="services-story" id="services">
      <div ref={glowRef} className="services-story-glow" aria-hidden="true" />
      <svg className="services-orbit-svg" viewBox="0 0 1600 900" preserveAspectRatio="none" aria-hidden="true">
        <path ref={orbitPathRef} d="M -100 680 C 260 420, 430 750, 690 540 C 920 355, 1120 260, 1710 360" />
      </svg>

      <div ref={copyRef} className="services-copy">
        <div className="services-label">✦ SITES QUE CONECTAM NEGÓCIOS</div>
        <h2>Criamos sites<br />para o seu <span>negócio.</span></h2>
        <p>Barbearia, pizzaria, loja de maquiagem e muito mais. O segmento muda. A resposta não.</p>
        <div className="services-types"><span>✂ Barbearias</span><span>◉ Pizzarias</span><span>✦ Lojas</span><span>+ Muito mais</span></div>
        <div ref={stepRef} className="story-step">01 / BARBEARIA</div>
      </div>

      <div ref={previewsRef} className="previews-layer" aria-hidden="true">
        <div className="service-preview barber-preview">
          <div className="browser-bar"><b>BLACK / CHAIR</b><span>•••</span></div>
          <div className="browser-hero"><small>BARBER STUDIO</small><strong>Seu corte.<br />Sua identidade.</strong><button>AGENDAR</button></div>
          <div className="preview-cards"><i /><i /><i /></div>
        </div>
        <div className="service-preview pizza-preview">
          <div className="browser-bar"><b>FORNO / 12</b><span>•••</span></div>
          <div className="browser-hero"><small>PIZZA ARTESANAL</small><strong>Quente.<br />Rápida. Sua.</strong><button>PEDIR AGORA</button></div>
          <div className="preview-cards"><i /><i /><i /></div>
        </div>
        <div className="service-preview makeup-preview">
          <div className="browser-bar"><b>GLOW / BEAUTY</b><span>•••</span></div>
          <div className="browser-hero"><small>BEAUTY STORE</small><strong>Beauty that<br />feels like you.</strong><button>EXPLORAR</button></div>
          <div className="preview-cards"><i /><i /><i /></div>
        </div>
      </div>

      <div className="service-float-icon service-float-barber" aria-hidden="true">✂</div>
      <div className="service-float-icon service-float-pizza" aria-hidden="true">🍕</div>
      <div className="service-float-icon service-float-makeup" aria-hidden="true">✦</div>

      <div ref={mascotRef} className="services-mascot"><OrionMascot3D compact /></div>

      <div ref={phoneTiltRef} className="story-phone-shell">
        <div ref={phoneRef} className="story-phone">
          <div className="phone-notch" />
          <div className="phone-screen">
            <div className="phone-head"><span className="phone-avatar">O</span><div><b>Orion Web Studio</b><small>online agora</small></div><i>•••</i></div>
            <div ref={chatRef} className="chat-flow">
              {questions.flatMap((question, index) => [
                <div className="chat-message question" key={`q-${index}`}><span className="chat-user">U</span>{question}</div>,
                <div
                  ref={index === 3 ? finalAnswerRef : undefined}
                  className={`chat-message answer ${index === 3 ? "answer-final" : ""}`}
                  key={`a-${index}`}
                >
                  {index === 3 ? "CLARO QUE SIIIIIM!!!!" : "Claro que sim!!"}<span className="chat-orion">O</span>
                </div>,
              ])}
            </div>
            <div className="typing"><i /><i /><i /></div>
          </div>
        </div>
      </div>

      <div ref={finaleRef} className="services-finale">
        <div className="finale-rays" aria-hidden="true"><i className="finale-ray" /><i className="finale-ray" /><i className="finale-ray" /><i className="finale-ray" /></div>
        <div ref={finaleInnerRef} className="services-finale-inner">
          <span>ORION GROUP / WEB STUDIO</span>
          <h3>CLARO<br /><em>QUE SIM.</em></h3>
          <p>Não importa se é uma barbearia, pizzaria, loja ou uma ideia que ainda nem tem nome. A gente pode construir uma experiência digital para ela.</p>
          <MagneticLink className="button button-primary" href="#journey">Quero meu site <b>↗</b></MagneticLink>
        </div>
      </div>
    </section>
  );
}
