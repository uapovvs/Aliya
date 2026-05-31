"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const INJECTED_STYLES = `
  .gsap-reveal { visibility: hidden; }

  .film-grain {
    position: absolute; inset: 0; width: 100%; height: 100%;
    pointer-events: none; z-index: 50; opacity: 0.05; mix-blend-mode: overlay;
    background: url('data:image/svg+xml;utf8,<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><filter id="noiseFilter"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23noiseFilter)"/></svg>');
  }

  .bg-grid-ch {
    background-size: 60px 60px;
    background-image:
      linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px);
    mask-image: radial-gradient(ellipse at center, black 0%, transparent 70%);
    -webkit-mask-image: radial-gradient(ellipse at center, black 0%, transparent 70%);
  }

  .text-3d-matte-ch {
    color: var(--color-foreground, #fff);
    text-shadow:
      0 10px 30px rgba(255,255,255,0.2),
      0 2px 4px rgba(255,255,255,0.1);
  }

  .text-silver-matte-ch {
    background: linear-gradient(180deg, #fff 0%, rgba(255,255,255,0.4) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    transform: translateZ(0);
    filter:
      drop-shadow(0px 10px 20px rgba(255,255,255,0.15))
      drop-shadow(0px 2px 4px rgba(255,255,255,0.1));
  }

  .text-card-silver-matte-ch {
    background: linear-gradient(180deg, #FFFFFF 0%, #A1A1AA 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    transform: translateZ(0);
    filter:
      drop-shadow(0px 12px 24px rgba(0,0,0,0.8))
      drop-shadow(0px 4px 8px rgba(0,0,0,0.6));
  }

  .premium-depth-card-ch {
    background: linear-gradient(145deg, #162C6D 0%, #0A101D 100%);
    box-shadow:
      0 40px 100px -20px rgba(0,0,0,0.9),
      0 20px 40px -20px rgba(0,0,0,0.8),
      inset 0 1px 2px rgba(255,255,255,0.2),
      inset 0 -2px 4px rgba(0,0,0,0.8);
    border: 1px solid rgba(255,255,255,0.04);
    position: relative;
  }

  .card-sheen-ch {
    position: absolute; inset: 0; border-radius: inherit; pointer-events: none; z-index: 50;
    background: radial-gradient(800px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.06) 0%, transparent 40%);
    mix-blend-mode: screen; transition: opacity 0.3s ease;
  }

  .iphone-bezel-ch {
    background-color: #111;
    box-shadow:
      inset 0 0 0 2px #52525B,
      inset 0 0 0 7px #000,
      0 40px 80px -15px rgba(0,0,0,0.9),
      0 15px 25px -5px rgba(0,0,0,0.7);
    transform-style: preserve-3d;
  }

  .hardware-btn-ch {
    background: linear-gradient(90deg, #404040 0%, #171717 100%);
    box-shadow:
      -2px 0 5px rgba(0,0,0,0.8),
      inset -1px 0 1px rgba(255,255,255,0.15),
      inset 1px 0 2px rgba(0,0,0,0.8);
    border-left: 1px solid rgba(255,255,255,0.05);
  }

  .screen-glare-ch {
    background: linear-gradient(110deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 45%);
  }

  .widget-depth-ch {
    background: linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%);
    box-shadow:
      0 10px 20px rgba(0,0,0,0.3),
      inset 0 1px 1px rgba(255,255,255,0.05),
      inset 0 -1px 1px rgba(0,0,0,0.5);
    border: 1px solid rgba(255,255,255,0.03);
  }

  .floating-ui-badge-ch {
    background: linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.01) 100%);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    box-shadow:
      0 0 0 1px rgba(255,255,255,0.1),
      0 25px 50px -12px rgba(0,0,0,0.8),
      inset 0 1px 1px rgba(255,255,255,0.2),
      inset 0 -1px 1px rgba(0,0,0,0.5);
  }

  .btn-ch-light, .btn-ch-dark {
    transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
  }
  .btn-ch-light {
    background: linear-gradient(180deg, #FFFFFF 0%, #F1F5F9 100%);
    color: #0F172A;
    box-shadow: 0 0 0 1px rgba(0,0,0,0.05), 0 2px 4px rgba(0,0,0,0.1), 0 12px 24px -4px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,1), inset 0 -3px 6px rgba(0,0,0,0.06);
  }
  .btn-ch-light:hover {
    transform: translateY(-3px);
    box-shadow: 0 0 0 1px rgba(0,0,0,0.05), 0 6px 12px -2px rgba(0,0,0,0.15), 0 20px 32px -6px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,1), inset 0 -3px 6px rgba(0,0,0,0.06);
  }
  .btn-ch-light:active { transform: translateY(1px); }
  .btn-ch-dark {
    background: linear-gradient(180deg, #27272A 0%, #18181B 100%);
    color: #FFFFFF;
    box-shadow: 0 0 0 1px rgba(255,255,255,0.1), 0 2px 4px rgba(0,0,0,0.6), 0 12px 24px -4px rgba(0,0,0,0.9), inset 0 1px 1px rgba(255,255,255,0.15), inset 0 -3px 6px rgba(0,0,0,0.8);
  }
  .btn-ch-dark:hover {
    transform: translateY(-3px);
    background: linear-gradient(180deg, #3F3F46 0%, #27272A 100%);
    box-shadow: 0 0 0 1px rgba(255,255,255,0.15), 0 6px 12px -2px rgba(0,0,0,0.7), 0 20px 32px -6px rgba(0,0,0,1), inset 0 1px 1px rgba(255,255,255,0.2), inset 0 -3px 6px rgba(0,0,0,0.8);
  }
  .btn-ch-dark:active { transform: translateY(1px); }

  .progress-ring-ch {
    transform: rotate(-90deg);
    transform-origin: center;
    stroke-dasharray: 402;
    stroke-dashoffset: 402;
    stroke-linecap: round;
  }
`;

export interface CinematicHeroProps extends React.HTMLAttributes<HTMLDivElement> {
  brandName?: string;
  tagline1?: string;
  tagline2?: string;
  cardHeading?: string;
  cardDescription?: React.ReactNode;
  metricValue?: number;
  metricLabel?: string;
  ctaHeading?: string;
  ctaDescription?: string;
  ctaButtons?: React.ReactNode;
  badge1Label?: string;
  badge1Sub?: string;
  badge2Label?: string;
  badge2Sub?: string;
}

export function CinematicHero({
  brandName = "DMAIC",
  tagline1 = "Непрерывное",
  tagline2 = "совершенствование.",
  cardHeading = "Методология роста для КМГ.",
  cardDescription = (
    <>
      <span className="text-white font-semibold">DMAIC Platform</span> — инструмент структурированного улучшения процессов. Определяй, измеряй, анализируй, улучшай и контролируй результат.
    </>
  ),
  metricValue = 100,
  metricLabel = "Прогресс",
  ctaHeading = "Начните путь улучшений.",
  ctaDescription = "Присоединяйтесь к программе непрерывного совершенствования КазМунайГаза и управляйте своим прогрессом.",
  ctaButtons,
  badge1Label = "Этап D завершён",
  badge1Sub = "Результат одобрен",
  badge2Label = "Новый этап",
  badge2Sub = "M/A открыт",
  className,
  ...props
}: CinematicHeroProps) {

  const containerRef   = useRef<HTMLDivElement>(null);
  const mainCardRef    = useRef<HTMLDivElement>(null);
  const mockupRef      = useRef<HTMLDivElement>(null);
  const rafRef         = useRef<number>(0);
  const scrollLocked   = useRef(false);
  const heroEndScroll  = useRef(0);

  // Prevent scrolling back into the hero after animation finishes
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (!scrollLocked.current) return;
      if (e.deltaY < 0 && window.scrollY <= heroEndScroll.current + 20) {
        e.preventDefault();
      }
    };
    let touchStartY = 0;
    const onTouchStart = (e: TouchEvent) => { touchStartY = e.touches[0].clientY; };
    const onTouchMove  = (e: TouchEvent) => {
      if (!scrollLocked.current) return;
      if (e.touches[0].clientY > touchStartY && window.scrollY <= heroEndScroll.current + 20) {
        e.preventDefault();
      }
    };
    window.addEventListener('wheel',      onWheel,      { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true  });
    window.addEventListener('touchmove',  onTouchMove,  { passive: false });
    return () => {
      window.removeEventListener('wheel',      onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove',  onTouchMove);
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (window.scrollY > window.innerHeight * 2) return;
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        if (mainCardRef.current && mockupRef.current) {
          const rect = mainCardRef.current.getBoundingClientRect();
          mainCardRef.current.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
          mainCardRef.current.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
          const xVal = (e.clientX / window.innerWidth - 0.5) * 2;
          const yVal = (e.clientY / window.innerHeight - 0.5) * 2;
          gsap.to(mockupRef.current, { rotationY: xVal * 12, rotationX: -yVal * 12, ease: "power3.out", duration: 1.2 });
        }
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => { window.removeEventListener("mousemove", handleMouseMove); cancelAnimationFrame(rafRef.current); };
  }, []);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const cardScale = isMobile ? 0.92 : 0.85;
    const cardRadius = isMobile ? 32 : 40;

    const ctx = gsap.context(() => {
      // Intro: no blur (GPU-heavy), just y + opacity + scale
      gsap.set(".ch-text-track", { autoAlpha: 0, y: 50, scale: 0.9 });
      gsap.set(".ch-text-days", { autoAlpha: 1, clipPath: "inset(0 100% 0 0)" });
      // Card uses scale instead of width/height — no layout reflow
      gsap.set(".ch-main-card", { y: window.innerHeight + 200, scale: cardScale, borderRadius: cardRadius, autoAlpha: 1, force3D: true });
      gsap.set([".ch-card-left", ".ch-card-right", ".ch-mockup", ".ch-badge", ".ch-widget"], { autoAlpha: 0, force3D: true });
      gsap.set(".ch-cta", { autoAlpha: 0, scale: 0.85 });

      gsap.timeline({ delay: 0.3 })
        .to(".ch-text-track", { duration: 1.5, autoAlpha: 1, y: 0, scale: 1, ease: "expo.out" })
        .to(".ch-text-days", { duration: 1.4, clipPath: "inset(0 0% 0 0)", ease: "power4.inOut" }, "-=1.0");

      gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=4000",
          pin: true,
          scrub: 0.5,
          anticipatePin: 1,
          onLeave: () => {
            scrollLocked.current = true;
            heroEndScroll.current = window.scrollY;
          },
          onEnterBack: () => {
            // Allow scrolling back only if not locked
            if (scrollLocked.current) {
              window.scrollTo({ top: heroEndScroll.current + 1 });
            }
          },
        },
      })
        // Hero text fades out gently — keeps 0.2 opacity so it's still faintly visible
        .to([".ch-hero-text", ".bg-grid-ch"], { scale: 1.1, opacity: 0.15, ease: "power2.inOut", duration: 2 }, 0)
        // Card slides up (transform only)
        .to(".ch-main-card", { y: 0, ease: "power3.inOut", duration: 2 }, 0)
        // Card expands to fill screen via scale (NO width/height — no reflow)
        .to(".ch-main-card", { scale: 1, borderRadius: 0, ease: "power3.inOut", duration: 1.5 })
        .fromTo(".ch-mockup",
          { y: 250, rotationX: 40, rotationY: -20, autoAlpha: 0, scale: 0.65 },
          { y: 0, rotationX: 0, rotationY: 0, autoAlpha: 1, scale: 1, ease: "expo.out", duration: 2 }, "-=0.6"
        )
        .fromTo(".ch-widget", { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.12, ease: "power3.out", duration: 1.2 }, "-=1.2")
        .to(".progress-ring-ch", { strokeDashoffset: 60, duration: 1.8, ease: "power3.inOut" }, "-=1.0")
        .to(".ch-counter", { innerHTML: metricValue, snap: { innerHTML: 1 }, duration: 1.8, ease: "expo.out" }, "-=1.8")
        .fromTo(".ch-badge", { y: 80, autoAlpha: 0, scale: 0.75 }, { y: 0, autoAlpha: 1, scale: 1, ease: "back.out(1.2)", duration: 1.2, stagger: 0.15 }, "-=1.5")
        .fromTo(".ch-card-left",  { x: -40, autoAlpha: 0 }, { x: 0, autoAlpha: 1, ease: "power4.out", duration: 1.2 }, "-=1.2")
        .fromTo(".ch-card-right", { x:  40, autoAlpha: 0 }, { x: 0, autoAlpha: 1, ease: "power4.out", duration: 1.2 }, "<")
        .to({}, { duration: 2 })
        .set(".ch-hero-text", { autoAlpha: 0 })
        .set(".ch-cta", { autoAlpha: 1 })
        .to({}, { duration: 1 })
        .to([".ch-mockup", ".ch-badge", ".ch-card-left", ".ch-card-right"], { scale: 0.92, y: -30, autoAlpha: 0, ease: "power3.in", duration: 1, stagger: 0.04 })
        // Pullback: scale back (NO width/height)
        .to(".ch-main-card", { scale: cardScale, borderRadius: cardRadius, ease: "expo.inOut", duration: 1.5 }, "pullback")
        .to(".ch-cta", { scale: 1, ease: "expo.inOut", duration: 1.5 }, "pullback")
        .to(".ch-main-card", { y: -window.innerHeight - 300, ease: "power3.in", duration: 1.2 });

    }, containerRef);
    return () => ctx.revert();
  }, [metricValue]);

  const defaultButtons = (
    <div className="flex flex-col sm:flex-row gap-6">
      <a href="/login" className="btn-ch-light flex items-center justify-center gap-3 px-8 py-4 rounded-[1.25rem] text-xl font-bold tracking-tight focus:outline-none focus:ring-2 focus:ring-blue-500">
        Войти в систему
      </a>
      <a href="/" className="btn-ch-dark flex items-center justify-center gap-3 px-8 py-4 rounded-[1.25rem] text-xl font-bold tracking-tight focus:outline-none focus:ring-2 focus:ring-blue-500">
        О программе
      </a>
    </div>
  );

  return (
    <div
      ref={containerRef}
      className={cn("relative w-screen h-screen overflow-hidden flex items-center justify-center bg-[#050914] text-white antialiased", className)}
      style={{ perspective: "1500px", fontFamily: "'Gilroy', system-ui, sans-serif" }}
      {...props}
    >
      <style dangerouslySetInnerHTML={{ __html: INJECTED_STYLES }} />
      <div className="film-grain" aria-hidden="true" />
      <div className="bg-grid-ch absolute inset-0 z-0 pointer-events-none opacity-50" aria-hidden="true" />

      {/* Hero text */}
      <div className="ch-hero-text absolute z-10 flex flex-col items-center justify-center text-center w-screen px-4">
        <h1 className="ch-text-track gsap-reveal text-3d-matte-ch text-5xl md:text-7xl lg:text-[6rem] font-bold tracking-tight mb-2">
          {tagline1}
        </h1>
        <h1 className="ch-text-days gsap-reveal text-silver-matte-ch text-5xl md:text-7xl lg:text-[6rem] font-extrabold tracking-tighter">
          {tagline2}
        </h1>
      </div>

      {/* CTA */}
      <div className="ch-cta absolute z-10 flex flex-col items-center justify-center text-center w-screen px-4 gsap-reveal pointer-events-auto">
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight text-silver-matte-ch">
          {ctaHeading}
        </h2>
        <p className="text-white/50 text-lg md:text-xl mb-12 max-w-xl mx-auto font-light leading-relaxed">
          {ctaDescription}
        </p>
        {ctaButtons ?? defaultButtons}
      </div>

      {/* Main card */}
      <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none" style={{ perspective: "1500px" }}>
        <div
          ref={mainCardRef}
          className="ch-main-card premium-depth-card-ch relative overflow-hidden gsap-reveal flex items-center justify-center pointer-events-auto w-screen h-screen"
        >
          <div className="card-sheen-ch" aria-hidden="true" />

          <div className="relative w-full h-full max-w-7xl mx-auto px-4 lg:px-12 flex flex-col justify-evenly lg:grid lg:grid-cols-3 items-center lg:gap-8 z-10 py-6 lg:py-0">

            {/* Brand name */}
            <div className="ch-card-right gsap-reveal order-1 lg:order-3 flex justify-center lg:justify-end z-20 w-full">
              <h2 className="text-6xl md:text-[6rem] lg:text-[8rem] font-black uppercase tracking-tighter text-card-silver-matte-ch">
                {brandName}
              </h2>
            </div>

            {/* Phone mockup */}
            <div className="ch-mockup order-2 lg:order-2 relative w-full h-[380px] lg:h-[600px] flex items-center justify-center z-10" style={{ perspective: "1000px" }}>
              <div className="relative w-full h-full flex items-center justify-center transform scale-[0.65] md:scale-85 lg:scale-100">
                <div ref={mockupRef} className="relative w-[280px] h-[580px] rounded-[3rem] iphone-bezel-ch flex flex-col will-change-transform">
                  <div className="absolute top-[120px] -left-[3px] w-[3px] h-[25px] hardware-btn-ch rounded-l-md" aria-hidden="true" />
                  <div className="absolute top-[160px] -left-[3px] w-[3px] h-[45px] hardware-btn-ch rounded-l-md" aria-hidden="true" />
                  <div className="absolute top-[220px] -left-[3px] w-[3px] h-[45px] hardware-btn-ch rounded-l-md" aria-hidden="true" />
                  <div className="absolute top-[170px] -right-[3px] w-[3px] h-[70px] hardware-btn-ch rounded-r-md scale-x-[-1]" aria-hidden="true" />

                  <div className="absolute inset-[7px] bg-[#050914] rounded-[2.5rem] overflow-hidden text-white z-10">
                    <div className="absolute inset-0 screen-glare-ch z-40 pointer-events-none" aria-hidden="true" />
                    <div className="absolute top-[5px] left-1/2 -translate-x-1/2 w-[100px] h-[28px] bg-black rounded-full z-50 flex items-center justify-end px-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)] animate-pulse" />
                    </div>

                    <div className="relative w-full h-full pt-12 px-5 pb-8 flex flex-col">
                      <div className="ch-widget flex justify-between items-center mb-8">
                        <div className="flex flex-col">
                          <span className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold mb-1">Сегодня</span>
                          <span className="text-xl font-bold tracking-tight text-white">DMAIC</span>
                        </div>
                        <div className="w-9 h-9 rounded-full bg-white/5 text-neutral-200 flex items-center justify-center font-bold text-sm border border-white/10">КМГ</div>
                      </div>

                      <div className="ch-widget relative w-44 h-44 mx-auto flex items-center justify-center mb-8 drop-shadow-[0_15px_25px_rgba(0,0,0,0.8)]">
                        <svg className="absolute inset-0 w-full h-full" aria-hidden="true">
                          <circle cx="88" cy="88" r="64" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="12" />
                          <circle className="progress-ring-ch" cx="88" cy="88" r="64" fill="none" stroke="#3B82F6" strokeWidth="12" />
                        </svg>
                        <div className="text-center z-10 flex flex-col items-center">
                          <span className="ch-counter text-4xl font-extrabold tracking-tighter text-white">0</span>
                          <span className="text-[8px] text-blue-200/50 uppercase tracking-[0.1em] font-bold mt-0.5">{metricLabel}</span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {(["Define", "Measure / Analyze"] as const).map((stage, i) => (
                          <div key={stage} className="ch-widget widget-depth-ch rounded-2xl p-3 flex items-center">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-3 border shadow-inner ${i === 0 ? 'bg-gradient-to-br from-blue-500/20 to-blue-600/5 border-blue-400/20' : 'bg-gradient-to-br from-emerald-500/20 to-emerald-600/5 border-emerald-400/20'}`}>
                              <svg className={`w-4 h-4 ${i === 0 ? 'text-blue-400' : 'text-emerald-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={i === 0 ? "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" : "M5 13l4 4L19 7"} />
                              </svg>
                            </div>
                            <div className="flex-1">
                              <div className="h-2 w-20 bg-neutral-300 rounded-full mb-2 shadow-inner" />
                              <div className="h-1.5 w-12 bg-neutral-600 rounded-full shadow-inner" />
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[120px] h-[4px] bg-white/20 rounded-full" />
                    </div>
                  </div>
                </div>

                {/* Badges */}
                <div className="ch-badge absolute flex top-6 lg:top-12 left-[-15px] lg:left-[-80px] floating-ui-badge-ch rounded-xl lg:rounded-2xl p-3 lg:p-4 items-center gap-3 z-30">
                  <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-gradient-to-b from-blue-500/20 to-blue-900/10 flex items-center justify-center border border-blue-400/30">
                    <span className="text-base lg:text-xl" aria-hidden="true">🏆</span>
                  </div>
                  <div>
                    <p className="text-white text-xs lg:text-sm font-bold tracking-tight">{badge1Label}</p>
                    <p className="text-blue-200/50 text-[10px] lg:text-xs font-medium">{badge1Sub}</p>
                  </div>
                </div>

                <div className="ch-badge absolute flex bottom-12 lg:bottom-20 right-[-15px] lg:right-[-80px] floating-ui-badge-ch rounded-xl lg:rounded-2xl p-3 lg:p-4 items-center gap-3 z-30">
                  <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-gradient-to-b from-indigo-500/20 to-indigo-900/10 flex items-center justify-center border border-indigo-400/30">
                    <span className="text-base lg:text-lg" aria-hidden="true">📊</span>
                  </div>
                  <div>
                    <p className="text-white text-xs lg:text-sm font-bold tracking-tight">{badge2Label}</p>
                    <p className="text-blue-200/50 text-[10px] lg:text-xs font-medium">{badge2Sub}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Left text */}
            <div className="ch-card-left gsap-reveal order-3 lg:order-1 flex flex-col justify-center text-center lg:text-left z-20 w-full px-4 lg:px-0">
              <h3 className="text-white text-2xl md:text-3xl lg:text-4xl font-bold mb-0 lg:mb-5 tracking-tight">
                {cardHeading}
              </h3>
              <p className="hidden md:block text-blue-100/70 text-sm md:text-base lg:text-lg font-normal leading-relaxed mx-auto lg:mx-0 max-w-sm lg:max-w-none">
                {cardDescription}
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
