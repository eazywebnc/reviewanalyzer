"use client";

import { motion } from "framer-motion";
import { Upload, Cpu, PieChart } from "lucide-react";

const steps = [
  {
    icon: Upload,
    step: "01",
    title: "Import Reviews",
    description:
      "Connect your store, upload a CSV, or paste reviews directly. We support all major e-commerce platforms.",
  },
  {
    icon: Cpu,
    step: "02",
    title: "AI Analyzes",
    description:
      "Our AI engine processes every review, detecting sentiment, extracting themes, and identifying key insights in seconds.",
  },
  {
    icon: PieChart,
    step: "03",
    title: "Get Insights",
    description:
      "View clear dashboards, sentiment trends, and actionable recommendations to improve products and customer satisfaction.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-sm font-medium text-amber-400 mb-3">How It Works</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            From reviews to insights in 3 steps
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="relative text-center"
            >
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-px bg-gradient-to-r from-amber-500/30 to-transparent" />
              )}
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/20 mb-6">
                <step.icon className="h-7 w-7 text-amber-400" />
              </div>
              <div className="text-xs font-bold text-amber-500/60 mb-2">{step.step}</div>
              <h3 className="text-xl font-semibold text-white mb-3">
                {step.title}
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed max-w-xs mx-auto">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
