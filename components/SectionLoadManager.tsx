"use client";

import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";

const ActiveSectionContext = createContext(0);
const ACTIVE_RANGE = 1;

export function SectionLoadManager({ children }: PropsWithChildren) {
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("main section"));
    const managerPaused = new WeakSet<Animation>();
    let currentSection = -1;
    let frame = 0;

    const setSectionState = (activeIndex: number) => {
      sections.forEach((section, index) => {
        const isEnabled = Math.abs(activeIndex - index) <= ACTIVE_RANGE;
        section.dataset.animationState = isEnabled ? "running" : "paused";

        section.getAnimations({ subtree: true }).forEach((animation) => {
          const isCssAnimation = typeof CSSAnimation !== "undefined" && animation instanceof CSSAnimation;
          if (isCssAnimation) return;

          if (!isEnabled && animation.playState === "running") {
            managerPaused.add(animation);
            animation.pause();
          } else if (isEnabled && managerPaused.has(animation)) {
            managerPaused.delete(animation);
            animation.play();
          }
        });
      });
    };

    const update = () => {
      frame = 0;
      const viewportCenter = window.innerHeight / 2;
      let closestIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;

      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        const distance = rect.top <= viewportCenter && rect.bottom >= viewportCenter
          ? 0
          : Math.min(Math.abs(rect.top - viewportCenter), Math.abs(rect.bottom - viewportCenter));

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      if (closestIndex === currentSection) return;
      currentSection = closestIndex;
      setSectionState(closestIndex);
      setActiveSection(closestIndex);
    };

    const scheduleUpdate = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate, { passive: true });
    frame = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      sections.forEach((section) => {
        delete section.dataset.animationState;
        section.getAnimations({ subtree: true }).forEach((animation) => {
          if (managerPaused.has(animation)) animation.play();
        });
      });
    };
  }, []);

  return <ActiveSectionContext.Provider value={activeSection}>{children}</ActiveSectionContext.Provider>;
}

export function useSectionLoaded(sectionIndex: number) {
  const activeSection = useContext(ActiveSectionContext);
  return Math.abs(activeSection - sectionIndex) <= ACTIVE_RANGE;
}
