import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "ReviewAnalyzer - AI-Powered Review Intelligence",
    template: "%s | ReviewAnalyzer",
  },
  description:
    "Turn customer reviews into actionable insights with AI. Analyze sentiment, extract themes, and get recommendations to improve your products and boost sales.",
  keywords: [
    "review analysis",
    "sentiment analysis",
    "e-commerce",
    "AI",
    "product reviews",
    "customer feedback",
    "NLP",
  ],
  authors: [{ name: "EazyWebNC", url: "https://eazyweb.nc" }],
  creator: "EazyWebNC",
  metadataBase: new URL("https://reviewanalyzer.eazyweb.nc"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://reviewanalyzer.eazyweb.nc",
    title: "ReviewAnalyzer - AI-Powered Review Intelligence",
    description:
      "Turn customer reviews into actionable insights with AI. Analyze sentiment, detect trends, and boost your sales.",
    siteName: "ReviewAnalyzer",
    images: [{ url: '/images/og-image.webp', width: 1200, height: 630, type: 'image/webp', alt: 'ReviewAnalyzer — AI-Powered Review Intelligence' }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ReviewAnalyzer - AI-Powered Review Intelligence",
    description:
      "Turn customer reviews into actionable insights with AI.",
    images: ['/images/og-image.webp'],
  },
  robots: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  alternates: {
    canonical: 'https://reviewanalyzer.eazyweb.nc',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: "ReviewAnalyzer",
        url: "https://reviewanalyzer.eazyweb.nc",
        publisher: {
          "@type": "Organization",
          name: "EazyWebNC",
          url: "https://eazyweb.nc",
          logo: { "@type": "ImageObject", url: "https://eazyweb.nc/logo.png" },
        },
      },
      {
        "@type": "SoftwareApplication",
        name: "ReviewAnalyzer",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        description: "AI-powered review intelligence. Analyze sentiment, extract themes, and get actionable insights from customer reviews.",
        url: "https://reviewanalyzer.eazyweb.nc",
        offers: [
          { "@type": "Offer", price: "0", priceCurrency: "USD", name: "Free" },
          { "@type": "Offer", price: "29", priceCurrency: "USD", name: "Pro" },
          { "@type": "Offer", price: "79", priceCurrency: "USD", name: "Business" },
        ],
        creator: { "@type": "Organization", name: "EazyWebNC", url: "https://eazyweb.nc" },
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "What is ReviewAnalyzer?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "ReviewAnalyzer is an AI-powered tool that turns customer reviews into actionable insights. It analyzes sentiment, extracts themes, and provides recommendations to improve your products.",
            },
          },
          {
            "@type": "Question",
            name: "Which review platforms does ReviewAnalyzer support?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "ReviewAnalyzer works with reviews from Amazon, Google, Trustpilot, App Store, and more. Simply paste your reviews or connect your accounts to start analyzing.",
            },
          },
          {
            "@type": "Question",
            name: "How does AI sentiment analysis work?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Our AI reads each review, identifies positive, negative, and neutral sentiments, extracts key themes, and surfaces actionable insights to help you improve customer satisfaction.",
            },
          },
        ],
      },
    ],
  };

  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${outfit.variable} ${inter.variable} font-sans antialiased`}>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-emerald-600 focus:text-white focus:rounded">Skip to content</a>
        <div id="main-content">
          {children}
        </div>
      </body>
    </html>
  );
}
