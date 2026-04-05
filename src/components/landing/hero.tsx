"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import {
  ArrowRight,
  Sparkles,
  TrendingUp,
  BarChart3,
  Star,
  ThumbsUp,
  ThumbsDown,
  Minus,
} from "lucide-react";
import { Button } from "@/components/ui/button";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

interface ReviewSnippet {
  text: string;
  rating: number;
  sentiment: "positive" | "negative" | "neutral";
  author: string;
  angle: number; // orbit position in degrees
}

const reviewSnippets: ReviewSnippet[] = [
  {
    text: "Absolutely love it! Best purchase this year.",
    rating: 5,
    sentiment: "positive",
    author: "Sarah M.",
    angle: 0,
  },
  {
    text: "Decent product but overpriced for features.",
    rating: 3,
    sentiment: "neutral",
    author: "James T.",
    angle: 60,
  },
  {
    text: "Battery life is incredible, lasts all day.",
    rating: 5,
    sentiment: "positive",
    author: "Mei L.",
    angle: 120,
  },
  {
    text: "Customer support was unresponsive.",
    rating: 2,
    sentiment: "negative",
    author: "David K.",
    angle: 180,
  },
  {
    text: "Great build quality, feels premium.",
    rating: 4,
    sentiment: "positive",
    author: "Priya S.",
    angle: 240,
  },
  {
    text: "Does the job but nothing special.",
    rating: 3,
    sentiment: "neutral",
    author: "Tom R.",
    angle: 300,
  },
];

const trustMetrics = [
  { icon: BarChart3, label: "Reviews Analyzed", value: "2M+" },
  { icon: TrendingUp, label: "Avg. Sales Boost", value: "23%" },
  { icon: Sparkles, label: "AI Accuracy", value: "97%" },
];

/* ------------------------------------------------------------------ */
/*  Sentiment Tag                                                      */
/* ------------------------------------------------------------------ */

function SentimentTag({ sentiment }: { sentiment: "positive" | "negative" | "neutral" }) {
  const config = {
    positive: {
      icon: ThumbsUp,
      label: "Positive",
      bg: "bg-emerald-500/15",
      border: "border-emerald-500/25",
      text: "text-emerald-400",
    },
    negative: {
      icon: ThumbsDown,
      label: "Negative",
      bg: "bg-rose-500/15",
      border: "border-rose-500/25",
      text: "text-rose-400",
    },
    neutral: {
      icon: Minus,
      label: "Neutral",
      bg: "bg-amber-500/15",
      border: "border-amber-500/25",
      text: "text-amber-400",
    },
  };
  const c = config[sentiment];
  const Icon = c.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-medium ${c.bg} ${c.border} ${c.text} border`}
    >
      <Icon className="w-2.5 h-2.5" />
      {c.label}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  SVG Sentiment Gauge                                                */
/* ------------------------------------------------------------------ */

function SentimentGauge() {
  const gaugeRef = useRef<SVGSVGElement>(null);
  const arcRef = useRef<SVGPathElement>(null);
  const needleRef = useRef<SVGGElement>(null);
  const valueRef = useRef<SVGTextElement>(null);
  const [mounted, setMounted] = useState(false);

  const cx = 200;
  const cy = 200;
  const r = 150;
  const startAngle = 135; // degrees, from bottom-left
  const endAngle = 405; // degrees, to bottom-right (270 deg sweep)
  const targetScore = 4.2;
  const maxScore = 5;
  const targetFraction = targetScore / maxScore; // 0.84

  // Convert polar to cartesian
  function polarToCartesian(angle: number) {
    const rad = ((angle - 90) * Math.PI) / 180;
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad),
    };
  }

  // Create arc path
  function describeArc(startA: number, endA: number) {
    const start = polarToCartesian(endA);
    const end = polarToCartesian(startA);
    const sweep = endA - startA;
    const largeArc = sweep > 180 ? 1 : 0;
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`;
  }

  // Full background arc
  const fullArc = describeArc(startAngle, endAngle);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !gaugeRef.current) return;

    const totalSweep = endAngle - startAngle; // 270
    const targetAngle = startAngle + totalSweep * targetFraction;

    // Animate the colored arc
    if (arcRef.current) {
      // Start with zero-length arc, animate to target
      const tl = gsap.timeline({ delay: 0.6 });

      const proxy = { progress: 0 };
      tl.to(proxy, {
        progress: 1,
        duration: 2,
        ease: "power3.out",
        onUpdate: () => {
          const currentAngle = startAngle + totalSweep * targetFraction * proxy.progress;
          if (currentAngle > startAngle + 0.5) {
            arcRef.current?.setAttribute("d", describeArc(startAngle, currentAngle));
          }
        },
      });
    }

    // Animate the needle
    if (needleRef.current) {
      gsap.fromTo(
        needleRef.current,
        { rotation: startAngle - 90, transformOrigin: `${cx}px ${cy}px` },
        {
          rotation: targetAngle - 90,
          transformOrigin: `${cx}px ${cy}px`,
          duration: 2,
          delay: 0.6,
          ease: "power3.out",
        }
      );
    }

    // Animate the value text
    if (valueRef.current) {
      const counter = { val: 0 };
      gsap.to(counter, {
        val: targetScore,
        duration: 2,
        delay: 0.6,
        ease: "power3.out",
        onUpdate: () => {
          if (valueRef.current) {
            valueRef.current.textContent = counter.val.toFixed(1);
          }
        },
      });
    }
  }, [mounted]);

  // Needle endpoint
  const needleLength = r - 20;
  const needleAngle = startAngle; // initial angle, GSAP will animate
  const needleRad = ((needleAngle - 90) * Math.PI) / 180;
  const needleTip = {
    x: cx + needleLength * Math.cos(needleRad),
    y: cy + needleLength * Math.sin(needleRad),
  };

  return (
    <div className="relative">
      <svg
        ref={gaugeRef}
        viewBox="0 0 400 300"
        className="w-full max-w-[400px] mx-auto"
        aria-label="Sentiment gauge showing 4.2 out of 5"
      >
        <defs>
          {/* Gradient for the arc: red -> amber -> emerald */}
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="30%" stopColor="#f59e0b" />
            <stop offset="60%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
          {/* Glow filter */}
          <filter id="gaugeGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="needleGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background arc (track) */}
        <path
          d={fullArc}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="24"
          strokeLinecap="round"
        />

        {/* Tick marks */}
        {[0, 1, 2, 3, 4, 5].map((tick) => {
          const fraction = tick / maxScore;
          const angle = startAngle + (endAngle - startAngle) * fraction;
          const innerR = r + 18;
          const outerR = r + 28;
          const rad = ((angle - 90) * Math.PI) / 180;
          const x1 = cx + innerR * Math.cos(rad);
          const y1 = cy + innerR * Math.sin(rad);
          const x2 = cx + outerR * Math.cos(rad);
          const y2 = cy + outerR * Math.sin(rad);
          const labelR = r + 40;
          const lx = cx + labelR * Math.cos(rad);
          const ly = cy + labelR * Math.sin(rad);
          return (
            <g key={tick}>
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <text
                x={lx}
                y={ly}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-zinc-500 text-[11px]"
                style={{ fontFamily: "inherit" }}
              >
                {tick}
              </text>
            </g>
          );
        })}

        {/* Colored arc (animated via GSAP) */}
        <path
          ref={arcRef}
          d={describeArc(startAngle, startAngle + 1)}
          fill="none"
          stroke="url(#gaugeGradient)"
          strokeWidth="24"
          strokeLinecap="round"
          filter="url(#gaugeGlow)"
        />

        {/* Needle */}
        <g ref={needleRef} filter="url(#needleGlow)">
          <line
            x1={cx}
            y1={cy}
            x2={needleTip.x}
            y2={needleTip.y}
            stroke="#f59e0b"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx={cx} cy={cy} r="8" fill="#f59e0b" />
          <circle cx={cx} cy={cy} r="4" fill="#0a0a0a" />
        </g>

        {/* Center score */}
        <text
          ref={valueRef}
          x={cx}
          y={cy + 45}
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-white text-[48px] font-bold"
          style={{ fontFamily: "inherit" }}
        >
          0.0
        </text>
        <text
          x={cx}
          y={cy + 72}
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-zinc-500 text-[14px]"
          style={{ fontFamily: "inherit" }}
        >
          out of 5.0
        </text>

        {/* Star icons row below score */}
        {[0, 1, 2, 3, 4].map((i) => {
          const starX = cx - 40 + i * 20;
          const starY = cy + 92;
          const filled = i < 4;
          return (
            <text
              key={i}
              x={starX}
              y={starY}
              textAnchor="middle"
              dominantBaseline="middle"
              className={`text-[14px] ${filled ? "fill-amber-400" : "fill-zinc-600"}`}
              style={{ fontFamily: "inherit" }}
            >
              ★
            </text>
          );
        })}
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Orbiting Review Card                                               */
/* ------------------------------------------------------------------ */

function ReviewCard({
  snippet,
  index,
}: {
  snippet: ReviewSnippet;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        delay: 1.2 + index * 0.15,
        duration: 0.5,
        type: "spring",
        stiffness: 120,
      }}
      className="w-[200px] px-3 py-2.5 rounded-xl bg-[#0f0d0a]/90 border border-white/[0.08] backdrop-blur-xl shadow-lg shadow-black/30"
    >
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star
              key={s}
              className={`w-2.5 h-2.5 ${
                s <= snippet.rating
                  ? "text-amber-400 fill-amber-400"
                  : "text-zinc-700"
              }`}
            />
          ))}
        </div>
        <SentimentTag sentiment={snippet.sentiment} />
      </div>
      <p className="text-[10px] text-zinc-400 leading-relaxed mb-1.5">
        &ldquo;{snippet.text}&rdquo;
      </p>
      <p className="text-[9px] text-zinc-600">— {snippet.author}</p>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Orbiting Cards Container (desktop)                                 */
/* ------------------------------------------------------------------ */

function OrbitingCards() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const cards = containerRef.current.querySelectorAll<HTMLElement>(".orbit-card");
    const orbitRadius = 280;

    // Each card gets a starting angle, then slowly orbits
    cards.forEach((card, i) => {
      const baseAngle = reviewSnippets[i].angle;

      gsap.set(card, {
        x: orbitRadius * Math.cos(((baseAngle - 90) * Math.PI) / 180),
        y: orbitRadius * Math.sin(((baseAngle - 90) * Math.PI) / 180),
      });

      // Slow continuous orbit
      gsap.to(card, {
        duration: 60 + i * 5,
        repeat: -1,
        ease: "none",
        motionPath: {
          path: [
            {
              x: orbitRadius * Math.cos((((baseAngle + 90) - 90) * Math.PI) / 180),
              y: orbitRadius * Math.sin((((baseAngle + 90) - 90) * Math.PI) / 180),
            },
            {
              x: orbitRadius * Math.cos((((baseAngle + 180) - 90) * Math.PI) / 180),
              y: orbitRadius * Math.sin((((baseAngle + 180) - 90) * Math.PI) / 180),
            },
            {
              x: orbitRadius * Math.cos((((baseAngle + 270) - 90) * Math.PI) / 180),
              y: orbitRadius * Math.sin((((baseAngle + 270) - 90) * Math.PI) / 180),
            },
            {
              x: orbitRadius * Math.cos((((baseAngle + 360) - 90) * Math.PI) / 180),
              y: orbitRadius * Math.sin((((baseAngle + 360) - 90) * Math.PI) / 180),
            },
          ],
          curviness: 1.5,
        },
      });
    });

    return () => {
      gsap.killTweensOf(".orbit-card");
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 hidden lg:block pointer-events-none"
    >
      {reviewSnippets.map((snippet, i) => (
        <div
          key={i}
          className="orbit-card absolute pointer-events-auto"
          style={{
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <ReviewCard snippet={snippet} index={i} />
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Mobile Review Cards (stacked, fly-in)                              */
/* ------------------------------------------------------------------ */

function MobileReviewCards() {
  const directions = [
    { x: -80, y: 0 },
    { x: 80, y: 0 },
    { x: -60, y: 40 },
    { x: 60, y: -40 },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8 lg:hidden">
      {reviewSnippets.slice(0, 4).map((snippet, i) => (
        <motion.div
          key={i}
          initial={{
            opacity: 0,
            x: directions[i].x,
            y: directions[i].y,
          }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{
            delay: 1.4 + i * 0.12,
            duration: 0.6,
            type: "spring",
            stiffness: 100,
          }}
        >
          <ReviewCard snippet={snippet} index={i} />
        </motion.div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero                                                               */
/* ------------------------------------------------------------------ */

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section ref={sectionRef} className="relative pt-28 pb-20 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 -z-10">
        {/* Warm radial concentric circle pattern */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `
              radial-gradient(circle at 50% 40%, transparent 80px, rgba(251,191,36,0.4) 81px, transparent 82px),
              radial-gradient(circle at 50% 40%, transparent 160px, rgba(251,191,36,0.3) 161px, transparent 162px),
              radial-gradient(circle at 50% 40%, transparent 240px, rgba(245,158,11,0.25) 241px, transparent 242px),
              radial-gradient(circle at 50% 40%, transparent 320px, rgba(245,158,11,0.2) 321px, transparent 322px),
              radial-gradient(circle at 50% 40%, transparent 400px, rgba(249,115,22,0.15) 401px, transparent 402px),
              radial-gradient(circle at 50% 40%, transparent 480px, rgba(249,115,22,0.1) 481px, transparent 482px)
            `,
          }}
        />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[700px] bg-gradient-to-b from-amber-400/10 via-orange-500/8 to-transparent rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] bg-orange-500/6 rounded-full blur-[100px]" />
        <div className="absolute top-1/3 right-1/4 w-[250px] h-[250px] bg-yellow-500/5 rounded-full blur-[80px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Headline (above gauge) */}
        <div className="text-center max-w-3xl mx-auto mb-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-1.5 text-sm text-amber-400 mb-6"
          >
            <Sparkles className="h-3.5 w-3.5" />
            AI-Powered Sentiment Intelligence
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight"
          >
            Know Exactly How Customers{" "}
            <span className="bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-500 bg-clip-text text-transparent">
              Feel About You
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-5 text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed"
          >
            Analyze thousands of reviews in seconds. Our AI dissects sentiment,
            surfaces hidden themes, and delivers recommendations that drive
            measurable growth.
          </motion.p>
        </div>

        {/* Gauge + Orbiting Cards */}
        <div className="relative max-w-[700px] mx-auto mt-4 lg:mt-8">
          {/* Orbit ring visual (desktop only) */}
          <div className="absolute inset-0 hidden lg:block pointer-events-none">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[560px] h-[560px] rounded-full border border-white/[0.03]" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[620px] h-[620px] rounded-full border border-dashed border-white/[0.02]" />
          </div>

          {/* The gauge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3, type: "spring", stiffness: 80 }}
            className="relative z-10 max-w-[360px] mx-auto"
          >
            <SentimentGauge />
            {/* Warm glow behind gauge */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-amber-500/15 rounded-full blur-[100px] -z-10" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] bg-orange-400/12 rounded-full blur-[60px] -z-10" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-yellow-500/5 rounded-full blur-[120px] -z-10" />
          </motion.div>

          {/* Desktop: orbiting cards */}
          <OrbitingCards />
        </div>

        {/* Mobile: stacked review cards */}
        <div className="max-w-lg mx-auto">
          <MobileReviewCards />
        </div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/auth/login">
            <Button size="lg" className="gap-2">
              Start Analyzing Free
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <a href="#how-it-works">
            <Button variant="outline" size="lg">
              See How It Works
            </Button>
          </a>
        </motion.div>

        {/* Trust Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto"
        >
          {trustMetrics.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 + i * 0.1, duration: 0.4 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/15 mb-3">
                <stat.icon className="h-5 w-5 text-amber-400" />
              </div>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-zinc-500">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
