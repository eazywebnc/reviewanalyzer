-- ReviewAnalyzer - Database Migration
-- Tables with ra_ prefix, RLS enabled, indexes

-- ============================================
-- SHOPS
-- ============================================
CREATE TABLE IF NOT EXISTS ra_shops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  url TEXT,
  platform TEXT DEFAULT 'custom', -- shopify, woocommerce, amazon, custom
  api_key TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE ra_shops ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own shops" ON ra_shops
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own shops" ON ra_shops
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own shops" ON ra_shops
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own shops" ON ra_shops
  FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX idx_ra_shops_user_id ON ra_shops(user_id);

-- ============================================
-- PRODUCTS
-- ============================================
CREATE TABLE IF NOT EXISTS ra_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id UUID NOT NULL REFERENCES ra_shops(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sku TEXT,
  url TEXT,
  image_url TEXT,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE ra_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own products" ON ra_products
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own products" ON ra_products
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own products" ON ra_products
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own products" ON ra_products
  FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX idx_ra_products_shop_id ON ra_products(shop_id);
CREATE INDEX idx_ra_products_user_id ON ra_products(user_id);

-- ============================================
-- REVIEWS
-- ============================================
CREATE TABLE IF NOT EXISTS ra_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES ra_products(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  author TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  body TEXT NOT NULL,
  source TEXT DEFAULT 'manual', -- manual, api, import
  review_date TIMESTAMPTZ,
  sentiment TEXT, -- positive, negative, neutral, mixed
  sentiment_score REAL,
  language TEXT DEFAULT 'en',
  verified_purchase BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE ra_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own reviews" ON ra_reviews
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own reviews" ON ra_reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reviews" ON ra_reviews
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own reviews" ON ra_reviews
  FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX idx_ra_reviews_product_id ON ra_reviews(product_id);
CREATE INDEX idx_ra_reviews_user_id ON ra_reviews(user_id);
CREATE INDEX idx_ra_reviews_sentiment ON ra_reviews(sentiment);
CREATE INDEX idx_ra_reviews_rating ON ra_reviews(rating);

-- ============================================
-- ANALYSES
-- ============================================
CREATE TABLE IF NOT EXISTS ra_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  shop_id UUID REFERENCES ra_shops(id) ON DELETE SET NULL,
  product_id UUID REFERENCES ra_products(id) ON DELETE SET NULL,
  type TEXT NOT NULL DEFAULT 'sentiment', -- sentiment, themes, competitors, summary
  status TEXT NOT NULL DEFAULT 'pending', -- pending, processing, completed, failed
  review_count INTEGER DEFAULT 0,
  results JSONB,
  summary TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);

ALTER TABLE ra_analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own analyses" ON ra_analyses
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own analyses" ON ra_analyses
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own analyses" ON ra_analyses
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own analyses" ON ra_analyses
  FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX idx_ra_analyses_user_id ON ra_analyses(user_id);
CREATE INDEX idx_ra_analyses_shop_id ON ra_analyses(shop_id);
CREATE INDEX idx_ra_analyses_status ON ra_analyses(status);

-- ============================================
-- SETTINGS
-- ============================================
CREATE TABLE IF NOT EXISTS ra_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan TEXT NOT NULL DEFAULT 'free', -- free, pro, business
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  reviews_used INTEGER DEFAULT 0,
  reviews_limit INTEGER DEFAULT 100,
  shops_limit INTEGER DEFAULT 1,
  notifications_email BOOLEAN DEFAULT true,
  notifications_weekly_report BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE ra_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own settings" ON ra_settings
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own settings" ON ra_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own settings" ON ra_settings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE INDEX idx_ra_settings_user_id ON ra_settings(user_id);
CREATE INDEX idx_ra_settings_stripe_customer_id ON ra_settings(stripe_customer_id);

-- ============================================
-- FUNCTION: Auto-create settings on signup
-- ============================================
CREATE OR REPLACE FUNCTION handle_new_user_ra_settings()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO ra_settings (user_id, plan, reviews_limit, shops_limit)
  VALUES (NEW.id, 'free', 100, 1);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created_ra ON auth.users;
CREATE TRIGGER on_auth_user_created_ra
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user_ra_settings();

-- ============================================
-- FUNCTION: Updated_at trigger
-- ============================================
CREATE OR REPLACE FUNCTION update_ra_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ra_shops_updated_at
  BEFORE UPDATE ON ra_shops
  FOR EACH ROW EXECUTE FUNCTION update_ra_updated_at();

CREATE TRIGGER ra_products_updated_at
  BEFORE UPDATE ON ra_products
  FOR EACH ROW EXECUTE FUNCTION update_ra_updated_at();

CREATE TRIGGER ra_settings_updated_at
  BEFORE UPDATE ON ra_settings
  FOR EACH ROW EXECUTE FUNCTION update_ra_updated_at();
