import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | ReviewAnalyzer",
  description: "ReviewAnalyzer terms of service.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-emerald-400 hover:underline mb-8 inline-block" aria-label="Back to homepage">&larr; Back to home</Link>
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        <p className="text-gray-400 mb-4">Last updated: April 2026</p>
        <section className="space-y-6 text-gray-300">
          <div><h2 className="text-xl font-semibold text-white mb-2">1. Acceptance of Terms</h2><p>By accessing or using ReviewAnalyzer, you agree to be bound by these Terms of Service.</p></div>
          <div><h2 className="text-xl font-semibold text-white mb-2">2. Service Description</h2><p>ReviewAnalyzer provides AI-powered review analysis tools including sentiment analysis, theme extraction, and actionable recommendations.</p></div>
          <div><h2 className="text-xl font-semibold text-white mb-2">3. User Responsibilities</h2><p>You are responsible for maintaining the security of your account and for all activities under your account. You must not submit harmful or illegal content for analysis.</p></div>
          <div><h2 className="text-xl font-semibold text-white mb-2">4. Payment Terms</h2><p>Paid plans are billed monthly via Stripe. You can cancel at any time. Refunds are handled on a case-by-case basis within 30 days.</p></div>
          <div><h2 className="text-xl font-semibold text-white mb-2">5. Limitation of Liability</h2><p>ReviewAnalyzer is provided &ldquo;as is&rdquo; without warranties. We are not liable for any indirect, incidental, or consequential damages.</p></div>
          <div><h2 className="text-xl font-semibold text-white mb-2">6. Contact</h2><p>Questions: <a href="mailto:contact@eazyweb.nc" className="text-emerald-400 hover:underline">contact@eazyweb.nc</a></p></div>
        </section>
      </div>
    </main>
  );
}
