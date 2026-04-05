"use client";

import { useEffect, useState } from "react";
import { Crown, Check, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { PLANS, type PlanId } from "@/lib/stripe";
import type { Settings } from "@/lib/types";

const planOrder: PlanId[] = ["free", "pro", "business"];

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    async function fetchSettings() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("ra_settings")
        .select("*")
        .eq("user_id", user.id)
        .single();

      setSettings(data as Settings | null);
      setLoading(false);
    }
    fetchSettings();
  }, [supabase]);

  async function handleUpgrade(planId: PlanId) {
    if (planId === "free" || planId === settings?.plan) return;

    setUpgrading(planId);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error("Checkout error:", err);
    } finally {
      setUpgrading(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 text-amber-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Manage your account and subscription.
        </p>
      </div>

      {/* Current Plan */}
      <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
        <div className="flex items-center gap-3 mb-4">
          <Crown className="h-5 w-5 text-amber-400" />
          <h2 className="text-lg font-semibold text-white">Current Plan</h2>
        </div>
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-3xl font-bold text-white capitalize">
            {settings?.plan ?? "Free"}
          </span>
          <span className="text-sm text-zinc-500">
            {settings?.plan === "free"
              ? "- $0/month"
              : settings?.plan === "pro"
              ? "- $19/month"
              : "- $49/month"}
          </span>
        </div>
        <div className="flex gap-6 text-sm text-zinc-400">
          <span>
            Reviews: {settings?.reviews_used ?? 0} /{" "}
            {settings?.reviews_limit === -1 ? "Unlimited" : settings?.reviews_limit}
          </span>
          <span>
            Shops limit:{" "}
            {settings?.shops_limit === -1 ? "Unlimited" : settings?.shops_limit}
          </span>
        </div>
      </div>

      {/* Plan Selection */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">
          Upgrade Your Plan
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {planOrder.map((planId) => {
            const plan = PLANS[planId];
            const isCurrent = settings?.plan === planId;

            return (
              <div
                key={planId}
                className={`rounded-2xl border p-6 transition-all duration-200 ${
                  isCurrent
                    ? "border-amber-500/40 bg-amber-500/[0.05]"
                    : "border-white/5 bg-white/[0.02] hover:border-white/10"
                }`}
              >
                <h3 className="text-base font-semibold text-white">{plan.name}</h3>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-white">
                    ${plan.price}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-xs text-zinc-500">/mo</span>
                  )}
                </div>

                <ul className="mt-4 space-y-2 mb-6">
                  {plan.features.slice(0, 4).map((feature, j) => (
                    <li key={j} className="flex items-start gap-2 text-xs">
                      <Check className="h-3.5 w-3.5 text-amber-400 mt-0.5 shrink-0" />
                      <span className="text-zinc-400">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  variant={isCurrent ? "secondary" : "primary"}
                  size="sm"
                  className="w-full"
                  disabled={isCurrent || planId === "free" || upgrading !== null}
                  onClick={() => handleUpgrade(planId)}
                >
                  {upgrading === planId ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : isCurrent ? (
                    "Current Plan"
                  ) : planId === "free" ? (
                    "Free"
                  ) : (
                    `Upgrade to ${plan.name}`
                  )}
                </Button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Notifications */}
      <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Notifications</h2>
        <div className="space-y-4">
          <label className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white">Email notifications</p>
              <p className="text-xs text-zinc-500">
                Receive alerts when analyses complete
              </p>
            </div>
            <div
              className={`w-10 h-6 rounded-full transition-colors cursor-pointer ${
                settings?.notifications_email
                  ? "bg-amber-500"
                  : "bg-zinc-700"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white mt-1 transition-transform ${
                  settings?.notifications_email
                    ? "translate-x-5"
                    : "translate-x-1"
                }`}
              />
            </div>
          </label>

          <label className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white">Weekly reports</p>
              <p className="text-xs text-zinc-500">
                Get a summary of your review insights every week
              </p>
            </div>
            <div
              className={`w-10 h-6 rounded-full transition-colors cursor-pointer ${
                settings?.notifications_weekly_report
                  ? "bg-amber-500"
                  : "bg-zinc-700"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white mt-1 transition-transform ${
                  settings?.notifications_weekly_report
                    ? "translate-x-5"
                    : "translate-x-1"
                }`}
              />
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}
