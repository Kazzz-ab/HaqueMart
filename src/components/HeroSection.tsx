"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import Link from "next/link";

export function HeroSection() {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // ── Three.js — warm bokeh sprite orbs ─────────────────────────────────
    // Unique to HaqueMart: soft floating light rather than sharp point-scatter.
    const canvas  = canvasRef.current;
    const section = canvas?.parentElement;
    if (!canvas || !section) return;

    let W = section.offsetWidth;
    let H = section.offsetHeight;

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(58, W / H, 0.1, 100);
    camera.position.z = 9;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));

    // ── Soft radial gradient texture for bokeh ──
    const bc   = document.createElement("canvas");
    bc.width   = 128; bc.height = 128;
    const bctx = bc.getContext("2d")!;
    const grad = bctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0,    "rgba(230, 158, 55, 0.95)");
    grad.addColorStop(0.35, "rgba(200, 115, 28, 0.45)");
    grad.addColorStop(1,    "rgba(180,  75,  8, 0)");
    bctx.fillStyle = grad;
    bctx.fillRect(0, 0, 128, 128);
    const bokehTex = new THREE.CanvasTexture(bc);

    // ── Bokeh orb sprites — varying sizes, very slow drift ──
    const N = 24;
    type Orb = { x: number; y: number; z: number; vx: number; vy: number; sprite: THREE.Sprite };
    const orbs: Orb[] = Array.from({ length: N }, () => {
      const mat = new THREE.SpriteMaterial({
        map:         bokehTex,
        transparent: true,
        opacity:     0.12 + Math.random() * 0.18,
        blending:    THREE.AdditiveBlending,
        depthWrite:  false,
      });
      const sprite = new THREE.Sprite(mat);
      const x = (Math.random() - .5) * 16;
      const y = (Math.random() - .5) * 9;
      const z = (Math.random() - .5) * 4;
      sprite.position.set(x, y, z);
      sprite.scale.setScalar(1.8 + Math.random() * 3.5);
      scene.add(sprite);
      return { x, y, z, vx: (Math.random() - .5) * 0.0035, vy: (Math.random() - .5) * 0.003, sprite };
    });

    // ── Gentle mouse parallax (no repulsion — warm, inviting) ──
    let targetX = 0, targetY = 0, currX = 0, currY = 0;
    const onMove = (e: MouseEvent) => {
      const r = section.getBoundingClientRect();
      targetX = ((e.clientX - r.left) / W - .5) * 0.4;
      targetY = ((e.clientY - r.top)  / H - .5) * 0.25;
    };
    const onLeave = () => { targetX = 0; targetY = 0; };
    section.addEventListener("mousemove", onMove);
    section.addEventListener("mouseleave", onLeave);

    let rafId = 0;
    function tick() {
      rafId = requestAnimationFrame(tick);

      currX += (targetX - currX) * 0.04;
      currY += (targetY - currY) * 0.04;

      orbs.forEach((o) => {
        o.x += o.vx; o.y += o.vy;
        // Wrap-around (no hard bounce — gentle loop)
        if (o.x < -9) o.x = 9;
        if (o.x > 9)  o.x = -9;
        if (o.y < -5) o.y = 5;
        if (o.y > 5)  o.y = -5;
        o.sprite.position.set(o.x + currX, o.y - currY, o.z);
      });

      renderer.render(scene, camera);
    }
    tick();

    const onResize = () => {
      W = section.offsetWidth; H = section.offsetHeight;
      renderer.setSize(W, H);
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    // ── GSAP hero entrance ─────────────────────────────────────────────────
    const el = contentRef.current;
    if (el) {
      const badge = el.querySelector(".hero-badge");
      const h1    = el.querySelector("h1");
      const p     = el.querySelector("p");
      const a     = el.querySelector("a");
      gsap.timeline({ delay: 0.15 })
        .from(badge, { opacity: 0, y:  10, duration: 0.6,  ease: "power3.out" })
        .from(h1,    { opacity: 0, y:  24, duration: 0.95, ease: "power3.out" }, "-=0.3")
        .from(p,     { opacity: 0, y:  16, duration: 0.75, ease: "power3.out" }, "-=0.45")
        .from(a,     { opacity: 0, y:  12, duration: 0.6,  ease: "power3.out" }, "-=0.35");
    }

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      section.removeEventListener("mousemove", onMove);
      section.removeEventListener("mouseleave", onLeave);
      orbs.forEach((o) => { (o.sprite.material as THREE.SpriteMaterial).map?.dispose(); o.sprite.material.dispose(); });
      bokehTex.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <section className="relative overflow-hidden rounded-2xl border border-border/60 bg-card px-8 py-16 text-center">
      {/* Three.js canvas fills the section */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 h-full w-full"
        aria-hidden="true"
      />

      {/* Radial spotlight layered above canvas */}
      <div className="pointer-events-none absolute left-1/2 -top-24 size-80 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 -bottom-16 size-56 rounded-full bg-primary/8 blur-3xl" />

      {/* Content */}
      <div ref={contentRef} className="relative z-10">
        <span className="hero-badge mb-5 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
          <span className="size-1.5 animate-pulse rounded-full bg-primary" />
          New arrivals in store
        </span>
        <h1 className="mb-4 bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-5xl">
          Quality goods,<br className="hidden sm:block" /> curated for you
        </h1>
        <p className="mx-auto mb-8 max-w-md text-base text-muted-foreground sm:text-lg">
          Discover hand-picked everyday essentials and thoughtful gifts — made to last.
        </p>
        <Link
          href="#products"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition-all duration-300 hover:bg-primary/85 hover:shadow-primary/50 hover:-translate-y-0.5 active:translate-y-px"
        >
          Shop all products →
        </Link>
      </div>
    </section>
  );
}
