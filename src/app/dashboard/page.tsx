import { createClient } from "@/lib/supabase/server";
import {
  Store,
  BarChart3,
  MessageSquare,
  TrendingUp,
  Plus,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import type { Shop, Analysis, Settings } from "@/lib/types";

export const metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch data
  const [shopsRes, analysesRes, settingsRes, reviewCountRes] = await Promise.all([
    supabase
      .from("ra_shops")
      .select("*")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("ra_analyses")
      .select("*")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("ra_settings")
      .select("*")
      .eq("user_id", user!.id)
      .single(),
    supabase
      .from("ra_reviews")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user!.id),
  ]);

  const shops = (shopsRes.data as Shop[]) || [];
  const analyses = (analysesRes.data as Analysis[]) || [];
  const settings = settingsRes.data as Settings | null;
  const reviewCount = reviewCountRes.count || 0;

  const stats = [
    {
      label: "Shops",
      value: shops.length,
      limit: settings?.shops_limit === -1 ? "Unlimited" : `/ ${settings?.shops_limit ?? 1}`,
      icon: Store,
      color: "from-amber-500 to-orange-500",
    },
    {
      label: "Reviews",
      value: reviewCount,
      limit: settings?.reviews_limit === -1 ? "Unlimited" : `/ ${settings?.reviews_limit ?? 100}`,
      icon: MessageSquare,
      color: "from-orange-500 to-red-500",
    },
    {
      label: "Analyses",
      value: analyses.length,
      limit: "total",
      icon: BarChart3,
      color: "from-amber-400 to-amber-600",
    },
    {
      label: "Plan",
      value: (settings?.plan ?? "free").charAt(0).toUpperCase() + (settings?.plan ?? "free").slice(1),
      limit: "",
      icon: TrendingUp,
      color: "from-yellow-500 to-amber-500",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Welcome back! Here&apos;s your review intelligence overview.
          </p>
        </div>
        <Link
          href="/dashboard/shops"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2.5 text-sm font-semibold text-white hover:from-amber-400 hover:to-orange-400 shadow-lg shadow-amber-500/25 transition-all duration-200"
        >
          <Plus className="h-4 w-4" />
          Add Shop
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="rounded-2xl border border-white/5 bg-white/[0.02] p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-zinc-500">{stat.label}</span>
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color} bg-opacity-20`}
                style={{ background: `linear-gradient(135deg, rgba(245,158,11,0.15), rgba(249,115,22,0.15))` }}
              >
                <stat.icon className="h-4 w-4 text-amber-400" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-white">{stat.value}</span>
              {stat.limit && (
                <span className="text-sm text-zinc-600">{stat.limit}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Shops */}
      <div className="rounded-2xl border border-white/5 bg-white/[0.02]">
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <h2 className="text-lg font-semibold text-white">Your Shops</h2>
          <Link
            href="/dashboard/shops"
            className="text-sm text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
          >
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="p-6">
          {shops.length === 0 ? (
            <div className="text-center py-12">
              <Store className="h-10 w-10 text-zinc-700 mx-auto mb-3" />
              <p className="text-sm text-zinc-500 mb-4">No shops yet. Add your first shop to start analyzing reviews.</p>
              <Link
                href="/dashboard/shops"
                className="inline-flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-sm text-amber-400 hover:bg-amber-500/20 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add your first shop
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {shops.map((shop) => (
                <div
                  key={shop.id}
                  className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.01] p-4 hover:border-amber-500/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
                      <Store className="h-5 w-5 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{shop.name}</p>
                      <p className="text-xs text-zinc-600">{shop.platform} &middot; {shop.url || "No URL"}</p>
                    </div>
                  </div>
                  <span className="text-xs text-zinc-600">
                    {new Date(shop.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Analyses */}
      <div className="rounded-2xl border border-white/5 bg-white/[0.02]">
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <h2 className="text-lg font-semibold text-white">Recent Analyses</h2>
          <Link
            href="/dashboard/analyses"
            className="text-sm text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
          >
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="p-6">
          {analyses.length === 0 ? (
            <div className="text-center py-12">
              <BarChart3 className="h-10 w-10 text-zinc-700 mx-auto mb-3" />
              <p className="text-sm text-zinc-500">
                No analyses yet. Add reviews and run your first analysis.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {analyses.map((analysis) => (
                <div
                  key={analysis.id}
                  className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.01] p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
                      <BarChart3 className="h-5 w-5 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white capitalize">
                        {analysis.type} Analysis
                      </p>
                      <p className="text-xs text-zinc-600">
                        {analysis.review_count} reviews &middot; {analysis.status}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      analysis.status === "completed"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : analysis.status === "failed"
                        ? "bg-red-500/10 text-red-400"
                        : "bg-amber-500/10 text-amber-400"
                    }`}
                  >
                    {analysis.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
