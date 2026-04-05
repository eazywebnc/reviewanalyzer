"use client";

import { motion } from "framer-motion";
import {
  Brain,
  LineChart,
  Zap,
  Globe,
  FileDown,
  Shield,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Sentiment Analysis",
    description:
      "Advanced NLP models detect positive, negative, neutral, and mixed sentiments with 97% accuracy across 50+ languages.",
  },
  {
    icon: LineChart,
    title: "Trend Detection",
    description:
      "Identify emerging patterns in customer feedback before they become problems. Track sentiment over time with visual dashboards.",
  },
  {
    icon: Zap,
    title: "Instant Processing",
    description:
      "Analyze thousands of reviews in seconds, not hours. Batch import from CSV, API, or connect directly to your e-commerce platform.",
  },
  {
    icon: Globe,
    title: "Multi-Platform Support",
    description:
      "Connect Shopify, WooCommerce, Amazon, and more. Aggregate reviews from all your channels in one unified dashboard.",
  },
  {
    icon: FileDown,
    title: "Export & Reports",
    description:
      "Generate beautiful PDF reports, export to CSV/JSON, and schedule automated weekly insights delivered to your inbox.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description:
      "SOC 2 compliant, encrypted at rest and in transit. Your review data is protected with industry-leading security standards.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 relative">
      <div className="absolute inset-0 -z-10">
        <div className="absolute bottom-0 left-0 w-[600px] h-[400px] bg-gradient-to-tr from-orange-500/5 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
            Powerful tools to analyze, visualize, and act on customer feedback at scale.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="group relative rounded-2xl border border-white/5 bg-white/[0.02] p-6 hover:border-amber-500/20 hover:bg-amber-500/[0.02] transition-all duration-300"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 mb-4 group-hover:from-amber-500/30 group-hover:to-orange-500/30 transition-all duration-300">
                <feature.icon className="h-5 w-5 text-amber-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
