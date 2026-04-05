"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
} from "framer-motion";
import {
  Brain,
  LineChart,
  Zap,
  Globe,
  FileDown,
  Shield,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  span: 1 | 2;
  visual?: "sentiment" | "platforms";
}

const features: Feature[] = [
  {
    icon: Brain,
    title: "AI Sentiment Analysis",
    description:
      "Advanced NLP models detect positive, negative, neutral, and mixed sentiments with 97% accuracy across 50+ languages.",
    span: 2,
    visual: "sentiment",
  },
  {
    icon: LineChart,
    title: "Trend Detection",
    description:
      "Identify emerging patterns in customer feedback before they become problems. Track sentiment over time with visual dashboards.",
    span: 1,
  },
  {
    icon: Zap,
    title: "Instant Processing",
    description:
      "Analyze thousands of reviews in seconds, not hours. Batch import from CSV, API, or connect directly to your e-commerce platform.",
    span: 1,
  },
  {
    icon: Globe,
    title: "Multi-Platform Support",
    description:
      "Connect Shopify, WooCommerce, Amazon, and more. Aggregate reviews from all your channels in one unified dashboard.",
    span: 2,
    visual: "platforms",
  },
  {
    icon: FileDown,
    title: "Export & Reports",
    description:
      "Generate beautiful PDF reports, export to CSV/JSON, and schedule automated weekly insights delivered to your inbox.",
    span: 1,
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description:
      "SOC 2 compliant, encrypted at rest and in transit. Your review data is protected with industry-leading security standards.",
    span: 1,
  },
];

/* ------------------------------------------------------------------ */
/*  Sentiment bars visual                                              */
/* ------------------------------------------------------------------ */

const sentimentData = [
  { label: "Positive", pct: 72, color: "from-emerald-500 to-emerald-400" },
  { label: "Neutral", pct: 18, color: "from-amber-500 to-yellow-400" },
  { label: "Negative", pct: 10, color: "from-rose-500 to-red-400" },
];

function SentimentBars() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <div ref={ref} className="mt-5 space-y-3">
      {sentimentData.map((s, i) => (
        <div key={s.label} className="flex items-center gap-3">
          <span className="text-xs text-zinc-400 w-16 shrink-0">
            {s.label}
          </span>
          <div className="relative flex-1 h-5 rounded-full bg-white/5 overflow-hidden">
            <motion.div
              className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${s.color}`}
              initial={{ width: 0 }}
              animate={inView ? { width: `${s.pct}%` } : { width: 0 }}
              transition={{
                duration: 1,
                delay: i * 0.2,
                ease: [0.22, 1, 0.36, 1],
              }}
            />
          </div>
          <motion.span
            className="text-xs font-medium text-white tabular-nums w-10 text-right"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.4, delay: 0.6 + i * 0.2 }}
          >
            {s.pct}%
          </motion.span>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Platform badges visual                                             */
/* ------------------------------------------------------------------ */

const platforms = [
  { name: "Google", bg: "bg-blue-500/15 border-blue-500/20 text-blue-400" },
  { name: "Yelp", bg: "bg-red-500/15 border-red-500/20 text-red-400" },
  { name: "Amazon", bg: "bg-amber-500/15 border-amber-500/20 text-amber-400" },
  {
    name: "Shopify",
    bg: "bg-green-500/15 border-green-500/20 text-green-400",
  },
  {
    name: "Trustpilot",
    bg: "bg-emerald-500/15 border-emerald-500/20 text-emerald-400",
  },
  {
    name: "WooCommerce",
    bg: "bg-purple-500/15 border-purple-500/20 text-purple-400",
  },
];

function PlatformBadges() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <div ref={ref} className="mt-5 flex flex-wrap gap-2">
      {platforms.map((p, i) => (
        <motion.span
          key={p.name}
          className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${p.bg}`}
          initial={{ opacity: 0, y: 12, scale: 0.9 }}
          animate={
            inView
              ? { opacity: 1, y: 0, scale: 1 }
              : { opacity: 0, y: 12, scale: 0.9 }
          }
          transition={{
            duration: 0.4,
            delay: i * 0.1,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {p.name}
        </motion.span>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Feature card                                                       */
/* ------------------------------------------------------------------ */

function FeatureCard({ feature, index }: { feature: Feature; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className={`group relative rounded-2xl border border-white/5 bg-white/[0.02] p-6 hover:border-amber-500/20 hover:bg-amber-500/[0.02] transition-all duration-300 ${
        feature.span === 2 ? "md:col-span-2" : "md:col-span-1"
      }`}
    >
      {/* icon */}
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 mb-4 group-hover:from-amber-500/30 group-hover:to-orange-500/30 transition-all duration-300">
        <feature.icon className="h-5 w-5 text-amber-400" />
      </div>

      <h3 className="text-lg font-semibold text-white mb-2">
        {feature.title}
      </h3>
      <p className="text-sm text-zinc-400 leading-relaxed">
        {feature.description}
      </p>

      {/* visual elements for wide cards */}
      {feature.visual === "sentiment" && <SentimentBars />}
      {feature.visual === "platforms" && <PlatformBadges />}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main section                                                       */
/* ------------------------------------------------------------------ */

export function Features() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const gridY = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <section id="features" ref={sectionRef} className="py-24 relative overflow-hidden">
      {/* background glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute bottom-0 left-0 w-[600px] h-[400px] bg-gradient-to-tr from-orange-500/5 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-sm font-medium text-amber-400 mb-3">Features</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Everything you need to understand your customers
          </h2>
          <p className="mt-4 text-zinc-400 max-w-2xl mx-auto">
            Powerful tools to analyze, visualize, and act on customer feedback at
            scale.
          </p>
        </motion.div>

        {/* bento grid with scroll parallax */}
        <motion.div
          style={{ y: gridY }}
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
        >
          {features.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
