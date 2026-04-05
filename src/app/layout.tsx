import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
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
  },
  twitter: {
    card: "summary_large_image",
    title: "ReviewAnalyzer - AI-Powered Review Intelligence",
    description:
      "Turn customer reviews into actionable insights with AI.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
