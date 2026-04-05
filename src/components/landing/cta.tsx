"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent p-12 sm:p-16 text-center overflow-hidden"
        >
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-orange-500/10 rounded-full blur-3xl" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to understand your customers better?
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto mb-8 text-lg">
            Join thousands of e-commerce brands using ReviewAnalyzer to turn
            feedback into growth. Start free today.
          </p>
          <Link href="/auth/login">
            <Button size="lg" className="gap-2">
              Start Analyzing Reviews
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
