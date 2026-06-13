"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function RevealInit() {
  useEffect(() => {
    // Respect reduced motion: leave everything at its natural (visible) state.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const triggers: ScrollTrigger[] = [];

    const reveals = gsap.utils.toArray<HTMLElement>("[data-reveal]");
    reveals.forEach((el) => {
      const tween = gsap.from(el, {
        opacity: 0,
        y: 28,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
      });
      if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
    });

    const containers = gsap.utils.toArray<HTMLElement>("[data-reveal-stagger]");
    containers.forEach((container) => {
      const children = Array.from(container.children) as HTMLElement[];
      const tween = gsap.from(children, {
        opacity: 0,
        y: 24,
        stagger: 0.1,
        duration: 0.65,
        ease: "power2.out",
        scrollTrigger: { trigger: container, start: "top 88%", once: true },
      });
      if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
    });

    // Recompute trigger positions once streaming/layout has settled.
    const refreshId = window.setTimeout(() => ScrollTrigger.refresh(), 200);

    // Safety net: if any trigger never fires (e.g. throttled rAF in a
    // background tab), guarantee the content is still revealed — never leave
    // it stuck invisible.
    const safetyId = window.setTimeout(() => {
      const all = document.querySelectorAll<HTMLElement>(
        "[data-reveal], [data-reveal-stagger] > *",
      );
      all.forEach((el) => {
        if (parseFloat(getComputedStyle(el).opacity) < 1) {
          gsap.set(el, { opacity: 1, y: 0 });
        }
      });
    }, 1600);

    return () => {
      window.clearTimeout(refreshId);
      window.clearTimeout(safetyId);
      triggers.forEach((t) => t.kill());
    };
  }, []);

  return null;
}
