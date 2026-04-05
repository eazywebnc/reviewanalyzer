import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | ReviewAnalyzer",
  description: "Sign in to analyze your customer reviews",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
