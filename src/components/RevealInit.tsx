"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function RevealInit() {
  useEffect(() => {
    // Stagger-reveal any element with data-reveal attribute
    const targets = document.querySelectorAll<HTMLElement>("[data-reveal]");
    targets.forEach((el) => {
      gsap.from(el, {
        opacity: 0,
        y: 28,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          once: true,
        },
      });
    });

    // Stagger children of any [data-reveal-stagger] container
    const staggerContainers = document.querySelectorAll<HTMLElement>("[data-reveal-stagger]");
    staggerContainers.forEach((container) => {
      const children = Array.from(container.children) as HTMLElement[];
      gsap.from(children, {
        opacity: 0,
        y: 24,
        stagger: 0.1,
        duration: 0.65,
        ease: "power2.out",
        scrollTrigger: {
          trigger: container,
          start: "top 85%",
          once: true,
        },
      });
    });
  }, []);

  return null;
}
