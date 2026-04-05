"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  TrendingUp,
  BarChart3,
  Star,
  ThumbsUp,
  ThumbsDown,
  Minus,
  MessageCircle,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";

/* ------------------------------------------------------------------ */
/*  Sentiment Analysis Dashboard Mockup                                */
/* ------------------------------------------------------------------ */

const sentimentData = [
  { label: "Positive", pct: 72, color: "bg-emerald-500", textColor: "text-emerald-400" },
  { label: "Neutral", pct: 18, color: "bg-amber-500", textColor: "text-amber-400" },
  { label: "Negative", pct: 10, color: "bg-rose-500", textColor: "text-rose-400" },
];

const topThemes = [
  { theme: "Build Quality", sentiment: "positive", count: 842, pct: 89 },
  { theme: "Battery Life", sentiment: "positive", count: 621, pct: 76 },
  { theme: "Price Point", sentiment: "mixed", count: 534, pct: 52 },
  { theme: "Customer Support", sentiment: "negative", count: 203, pct: 34 },
];

const reviewSamples = [
  {
    text: "Battery lasts all day, even with heavy usage. Best purchase this year!",
    rating: 5,
    sentiment: "positive",
    source: "Amazon",
  },
  {
    text: "Decent product but overpriced for what you get. Competitors offer more.",
    rating: 3,
    sentiment: "mixed",
    source: "Google",
  },
];

function SentimentIcon({ type }: { type: string }) {
  if (type === "positive") return <ThumbsUp className="w-3 h-3 text-emerald-400" />;
  if (type === "negative") return <ThumbsDown className="w-3 h-3 text-rose-400" />;
  return <Minus className="w-3 h-3 text-amber-400" />;
}

function AnalysisMockup() {
  return (
    <div className="relative w-full rounded-2xl border border-white/[0.08] bg-[#0f0d0a]/80 overflow-hidden shadow-2xl shadow-amber-500/10 backdrop-blur-xl">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/60" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <div className="w-3 h-3 rounded-full bg-green-500/60" />
          </div>
          <span className="text-[11px] text-zinc-500 ml-2">ReviewAnalyzer — Product Analysis</span>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-amber-500/10 border border-amber-500/15">
          <BarChart3 className="w-3 h-3 text-amber-400" />
          <span className="text-[10px] text-amber-400 font-medium">2,847 reviews</span>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-0">
        {/* Left panel — sentiment overview */}
        <div className="col-span-5 p-4 border-r border-white/[0.06]">
          {/* Overall score */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mb-4"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/20 mb-2">
              <span className="text-2xl font-bold text-amber-400">4.2</span>
            </div>
            <div className="flex items-center justify-center gap-0.5 mb-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-3 h-3 ${s <= 4 ? "text-amber-400 fill-amber-400" : "text-zinc-600"}`}
                />
              ))}
            </div>
            <p className="text-[10px] text-zinc-500">Overall Rating</p>
          </motion.div>

          {/* Sentiment bars */}
          <div className="space-y-2.5">
            {sentimentData.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + i * 0.1 }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-zinc-400">{s.label}</span>
                  <span className={`text-[10px] font-medium ${s.textColor}`}>{s.pct}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${s.pct}%` }}
                    transition={{ delay: 0.9 + i * 0.15, duration: 0.8, ease: "easeOut" }}
                    className={`h-full rounded-full ${s.color}`}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {/* AI Insight */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
            className="mt-4 p-2.5 rounded-xl bg-amber-500/5 border border-amber-500/10"
          >
            <div className="flex items-center gap-1 mb-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span className="text-[10px] font-medium text-amber-300">AI Insight</span>
            </div>
            <p className="text-[9px] text-zinc-400 leading-relaxed">
              &ldquo;Focus on pricing strategy — 34% of negative reviews mention price. Consider tiered pricing to capture mid-market.&rdquo;
            </p>
          </motion.div>
        </div>

        {/* Right panel — themes & reviews */}
        <div className="col-span-7 p-4">
          {/* Top themes */}
          <div className="mb-4">
            <div className="flex items-center gap-1.5 mb-2.5">
              <Tag className="w-3 h-3 text-zinc-500" />
              <span className="text-[11px] font-medium text-zinc-300">Extracted Themes</span>
            </div>
            <div className="space-y-1.5">
              {topThemes.map((t, i) => (
                <motion.div
                  key={t.theme}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + i * 0.1, type: "spring", stiffness: 200 }}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white/[0.02] border border-white/[0.04]"
                >
                  <SentimentIcon type={t.sentiment} />
                  <span className="text-[10px] text-zinc-300 flex-1">{t.theme}</span>
                  <span className="text-[9px] text-zinc-600">{t.count}</span>
                  <div className="w-12 h-1 rounded-full bg-white/[0.04] overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${t.pct}%` }}
                      transition={{ delay: 1 + i * 0.12, duration: 0.6 }}
                      className={`h-full rounded-full ${
                        t.sentiment === "positive"
                          ? "bg-emerald-500"
                          : t.sentiment === "negative"
                          ? "bg-rose-500"
                          : "bg-amber-500"
                      }`}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Sample reviews */}
          <div>
            <div className="flex items-center gap-1.5 mb-2.5">
              <MessageCircle className="w-3 h-3 text-zinc-500" />
              <span className="text-[11px] font-medium text-zinc-300">Sample Reviews</span>
            </div>
            <div className="space-y-2">
              {reviewSamples.map((r, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.3 + i * 0.15 }}
                  className="px-2.5 py-2 rounded-lg bg-white/[0.02] border border-white/[0.04]"
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-2 h-2 ${
                            s <= r.rating ? "text-amber-400 fill-amber-400" : "text-zinc-700"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[8px] text-zinc-600 uppercase">{r.source}</span>
                    <SentimentIcon type={r.sentiment} />
                  </div>
                  <p className="text-[9px] text-zinc-400 leading-relaxed">&ldquo;{r.text}&rdquo;</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Floating badges                                                    */
/* ------------------------------------------------------------------ */

function FloatingBadges() {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.6, type: "spring" }}
        className="absolute -right-3 top-16 z-20 hidden lg:flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-lg"
      >
        <TrendingUp className="w-4 h-4 text-emerald-400" />
        <div>
          <p className="text-[10px] font-medium text-emerald-300">+23% Sales</p>
          <p className="text-[9px] text-zinc-500">After implementing insights</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.9, type: "spring" }}
        className="absolute -left-3 bottom-20 z-20 hidden lg:flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 backdrop-blur-lg"
      >
        <Sparkles className="w-4 h-4 text-amber-400" />
        <div>
          <p className="text-[10px] font-medium text-amber-300">AI Report Ready</p>
          <p className="text-[9px] text-zinc-500">3 actionable recommendations</p>
        </div>
      </motion.div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero                                                               */
/* ------------------------------------------------------------------ */

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const mockupY = useTransform(scrollYProgress, [0, 1], [0, 80]);

  return (
    <section ref={sectionRef} className="relative pt-32 pb-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-amber-500/10 via-orange-500/5 to-transparent rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-rose-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-1.5 text-sm text-amber-400 mb-8"
          >
            <Sparkles className="h-3.5 w-3.5" />
            AI-Powered Review Intelligence
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-white"
          >
            Turn Customer Reviews Into{" "}
            <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent">
              Actionable Insights
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed"
          >
            Analyze thousands of product reviews in seconds. Understand sentiment,
            extract themes, and get AI-powered recommendations to improve your
            products and boost sales.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
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

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto"
          >
            {[
              { icon: BarChart3, label: "Reviews Analyzed", value: "2M+" },
              { icon: TrendingUp, label: "Avg. Sales Boost", value: "23%" },
              { icon: Sparkles, label: "AI Accuracy", value: "97%" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-amber-500/10 mb-3">
                  <stat.icon className="h-5 w-5 text-amber-400" />
                </div>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-zinc-500">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Interactive Analysis Mockup */}
        <motion.div
          style={{ y: mockupY }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, type: "spring", stiffness: 80 }}
          className="relative max-w-4xl mx-auto mt-16"
        >
          <FloatingBadges />
          <AnalysisMockup />
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-16 bg-amber-500/15 blur-[60px] rounded-full" />
        </motion.div>
      </div>
    </section>
  );
}
