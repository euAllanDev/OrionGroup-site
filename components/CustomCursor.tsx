"use client";

import { useEffect, useRef } from "react";

export function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!ring || !dot) return;

    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    let x = tx;
    let y = ty;
    let prevX = tx;
    let prevY = ty;
    let frame = 0;

    const move = (event: MouseEvent) => {
      tx = event.clientX;
      ty = event.clientY;
      dot.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
    };

    const loop = () => {
      x += (tx - x) * 0.16;
      y += (ty - y) * 0.16;
      const vx = x - prevX;
      const vy = y - prevY;
      const speed = Math.min(1, Math.hypot(vx, vy) / 18);
      const angle = Math.atan2(vy, vx) * (180 / Math.PI);
      ring.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${angle}deg) scaleX(${1 + speed * 0.34}) scaleY(${1 - speed * 0.12})`;
      prevX = x;
      prevY = y;
      frame = requestAnimationFrame(loop);
    };

    const enter = () => ring.classList.add("is-active");
    const leave = () => ring.classList.remove("is-active");

    document.addEventListener("mousemove", move);
    const interactive = document.querySelectorAll("a, button, .interactive");
    interactive.forEach((node) => {
      node.addEventListener("mouseenter", enter);
      node.addEventListener("mouseleave", leave);
    });
    loop();

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("mousemove", move);
      interactive.forEach((node) => {
        node.removeEventListener("mouseenter", enter);
        node.removeEventListener("mouseleave", leave);
      });
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
    </>
  );
}
