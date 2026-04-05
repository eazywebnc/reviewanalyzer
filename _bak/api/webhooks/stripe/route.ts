import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe, getPlanByPriceId, PLANS } from "@/lib/stripe";
import { createServerClient } from "@supabase/ssr";
import Stripe from "stripe";

export async function POST(request: Request) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`Webhook signature verification failed: ${message}`);
    return NextResponse.json(
      { error: `Webhook Error: ${message}` },
      { status: 400 }
    );
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return [];
        },
        setAll() {},
      },
    }
  );

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;

        // Get subscription to find price ID
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const priceId = subscription.items.data[0]?.price.id;
        const planId = priceId ? getPlanByPriceId(priceId) : null;

        if (planId && planId !== "free") {
          const planConfig = PLANS[planId];
          await supabase
            .from("ra_settings")
            .update({
              plan: planId,
              stripe_customer_id: customerId,
              stripe_subscription_id: subscriptionId,
              reviews_limit: planConfig.reviewsLimit,
              shops_limit: planConfig.shopsLimit,
            })
            .eq("stripe_customer_id", customerId);
        }
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = (invoice as unknown as Record<string, unknown>).customer as string;
        const paymentIntent = (invoice as unknown as Record<string, unknown>).payment_intent;

        if (paymentIntent) {
          // Reset monthly usage on successful payment
          await supabase
            .from("ra_settings")
            .update({ reviews_used: 0 })
            .eq("stripe_customer_id", customerId);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        // Downgrade to free
        await supabase
          .from("ra_settings")
          .update({
            plan: "free",
            stripe_subscription_id: null,
            reviews_limit: PLANS.free.reviewsLimit,
            shops_limit: PLANS.free.shopsLimit,
          })
          .eq("stripe_customer_id", customerId);
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        const priceId = subscription.items.data[0]?.price.id;
        const planId = priceId ? getPlanByPriceId(priceId) : null;

        if (planId) {
          const planConfig = PLANS[planId];
          await supabase
            .from("ra_settings")
            .update({
              plan: planId,
              reviews_limit: planConfig.reviewsLimit,
              shops_limit: planConfig.shopsLimit,
            })
            .eq("stripe_customer_id", customerId);
        }
        break;
      }
    }
  } catch (err) {
    console.error("Webhook handler error:", err);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}
