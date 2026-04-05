"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PLANS, type PlanId } from "@/lib/stripe";

const planOrder: PlanId[] = ["free", "pro", "business"];

export function Pricing() {
  return (
    <section id="pricing" className="py-24 relative">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-amber-500/5 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-sm font-medium text-amber-400 mb-3">Pricing</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-zinc-400 max-w-xl mx-auto">
            Start free, upgrade when you need more power. No hidden fees.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {planOrder.map((planId, i) => {
            const plan = PLANS[planId];
            const isPopular = planId === "pro";

            return (
              <motion.div
                key={planId}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className={`relative rounded-2xl border p-8 ${
                  isPopular
                    ? "border-amber-500/40 bg-gradient-to-b from-amber-500/[0.08] to-transparent scale-[1.02]"
                    : "border-white/5 bg-white/[0.02]"
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-1 text-xs font-bold text-white">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-white">
                      ${plan.price}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-sm text-zinc-500">/month</span>
                    )}
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-3 text-sm">
                      <Check className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
                      <span className="text-zinc-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/auth/login" className="block">
                  <Button
                    variant={isPopular ? "primary" : "outline"}
                    className="w-full"
                  >
                    {plan.price === 0 ? "Get Started Free" : `Start with ${plan.name}`}
                  </Button>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
