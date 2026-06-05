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

    // ── Three.js particle field ────────────────────────────────────────────
    const canvas  = canvasRef.current;
    const section = canvas?.parentElement;
    if (!canvas || !section) return;

    let W = section.offsetWidth;
    let H = section.offsetHeight;

    const scene  = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(0, W, H, 0, 0.1, 10);
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));

    const N      = 80;
    const AMBER  = new THREE.Color(0xd4883a);   // HaqueMart primary
    const DIM    = new THREE.Color(0x7a4e1e);
    const BRIGHT = new THREE.Color(0xf0a040);

    const pts = Array.from({ length: N }, (_, i) => ({
      x:  Math.random() * W,
      y:  Math.random() * H,
      vx: (Math.random() - .5) * .5,
      vy: (Math.random() - .5) * .5,
      col: i % 9 === 0 ? BRIGHT : i % 4 === 0 ? DIM : AMBER,
    }));

    const posArr = new Float32Array(N * 3);
    const colArr = new Float32Array(N * 3);
    pts.forEach((p, i) => {
      posArr[i * 3] = p.x; posArr[i * 3 + 1] = p.y; posArr[i * 3 + 2] = 0;
      p.col.toArray(colArr, i * 3);
    });

    const ptGeo = new THREE.BufferGeometry();
    ptGeo.setAttribute("position", new THREE.BufferAttribute(posArr, 3));
    ptGeo.setAttribute("color",    new THREE.BufferAttribute(colArr, 3));
    const ptMat = new THREE.PointsMaterial({
      size: 2.5, vertexColors: true, transparent: true, opacity: 0.5, sizeAttenuation: false,
    });
    scene.add(new THREE.Points(ptGeo, ptMat));

    const MAX_LINES  = 170;
    const linePosArr = new Float32Array(MAX_LINES * 6);
    const lineGeo    = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.BufferAttribute(linePosArr, 3));
    lineGeo.setDrawRange(0, 0);
    const lineMesh = new THREE.LineSegments(
      lineGeo,
      new THREE.LineBasicMaterial({ color: 0xd4883a, transparent: true, opacity: 0.1 })
    );
    scene.add(lineMesh);

    let mx = -9999, my = -9999;
    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mx = e.clientX - r.left;
      my = H - (e.clientY - r.top);
    };
    const onLeave = () => { mx = -9999; my = -9999; };
    section.addEventListener("mousemove", onMove);
    section.addEventListener("mouseleave", onLeave);

    let rafId = 0;
    function tick() {
      rafId = requestAnimationFrame(tick);
      const pa = ptGeo.attributes.position;

      pts.forEach((p, i) => {
        const dx = p.x - mx, dy = p.y - my;
        const d  = Math.hypot(dx, dy);
        if (d < 90 && d > 0) {
          const f = ((90 - d) / 90) * .4;
          p.vx += (dx / d) * f;
          p.vy += (dy / d) * f;
        }
        p.vx *= .97; p.vy *= .97;
        const spd = Math.hypot(p.vx, p.vy);
        if (spd > 2) { p.vx = p.vx / spd * 2; p.vy = p.vy / spd * 2; }
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0)  { p.x = 0;  p.vx =  Math.abs(p.vx); }
        if (p.x > W)  { p.x = W;  p.vx = -Math.abs(p.vx); }
        if (p.y < 0)  { p.y = 0;  p.vy =  Math.abs(p.vy); }
        if (p.y > H)  { p.y = H;  p.vy = -Math.abs(p.vy); }
        pa.setXYZ(i, p.x, p.y, 0);
      });
      pa.needsUpdate = true;

      const la = lineGeo.attributes.position;
      let li = 0;
      outer: for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          if (Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y) < 130) {
            la.setXYZ(li * 2,     pts[i].x, pts[i].y, 0);
            la.setXYZ(li * 2 + 1, pts[j].x, pts[j].y, 0);
            if (++li >= MAX_LINES) break outer;
          }
        }
      }
      la.needsUpdate = true;
      lineGeo.setDrawRange(0, li * 2);
      renderer.render(scene, camera);
    }
    tick();

    const onResize = () => {
      W = section.offsetWidth;
      H = section.offsetHeight;
      renderer.setSize(W, H);
      camera.right = W;
      camera.top   = H;
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
      renderer.dispose();
      ptGeo.dispose();
      ptMat.dispose();
      lineGeo.dispose();
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
