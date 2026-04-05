import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

export type PlanId = "free" | "pro" | "business";

export interface PlanConfig {
  name: string;
  price: number;
  priceId?: string;
  reviewsLimit: number;
  shopsLimit: number;
  features: string[];
}

export const PLANS: Record<PlanId, PlanConfig> = {
  free: {
    name: "Free",
    price: 0,
    reviewsLimit: 100,
    shopsLimit: 1,
    features: [
      "100 reviews/month",
      "1 shop",
      "Basic dashboard",
      "Manual review import",
    ],
  },
  pro: {
    name: "Pro",
    price: 19,
    priceId: "price_pro_monthly",
    reviewsLimit: 5000,
    shopsLimit: 5,
    features: [
      "5,000 reviews/month",
      "5 shops",
      "Sentiment analysis",
      "CSV/JSON export",
      "Email reports",
      "Priority support",
    ],
  },
  business: {
    name: "Business",
    price: 49,
    priceId: "price_business_monthly",
    reviewsLimit: -1, // unlimited
    shopsLimit: -1, // unlimited
    features: [
      "Unlimited reviews",
      "Unlimited shops",
      "AI-powered insights",
      "REST API access",
      "Custom reports",
      "Dedicated support",
      "White-label options",
    ],
  },
};

export function getPlanByPriceId(priceId: string): PlanId | null {
  for (const [planId, config] of Object.entries(PLANS)) {
    if ("priceId" in config && config.priceId === priceId) {
      return planId as PlanId;
    }
  }
  return null;
}
