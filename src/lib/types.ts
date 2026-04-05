export interface Shop {
  id: string;
  user_id: string;
  name: string;
  url: string | null;
  platform: string;
  api_key: string | null;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  shop_id: string;
  user_id: string;
  name: string;
  sku: string | null;
  url: string | null;
  image_url: string | null;
  category: string | null;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  author: string | null;
  rating: number | null;
  title: string | null;
  body: string;
  source: string;
  review_date: string | null;
  sentiment: "positive" | "negative" | "neutral" | "mixed" | null;
  sentiment_score: number | null;
  language: string;
  verified_purchase: boolean;
  created_at: string;
}

export interface Analysis {
  id: string;
  user_id: string;
  shop_id: string | null;
  product_id: string | null;
  type: "sentiment" | "themes" | "competitors" | "summary";
  status: "pending" | "processing" | "completed" | "failed";
  review_count: number;
  results: Record<string, unknown> | null;
  summary: string | null;
  created_at: string;
  completed_at: string | null;
}

export interface Settings {
  id: string;
  user_id: string;
  plan: "free" | "pro" | "business";
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  reviews_used: number;
  reviews_limit: number;
  shops_limit: number;
  notifications_email: boolean;
  notifications_weekly_report: boolean;
  created_at: string;
  updated_at: string;
}
