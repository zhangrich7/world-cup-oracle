import type { Metadata } from "next";
import "./globals.css";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  title: "AI World Cup Oracle | Predict. Share. Flex.",
  description:
    "Generate AI-powered World Cup match predictions and share them as premium cyberpunk-style cards. DeepSeek-powered analysis, no login required.",
  openGraph: {
    title: "AI World Cup Oracle",
    description: "Generate AI-powered World Cup predictions and share them as premium cards.",
    images: [{ url: "/og-default.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI World Cup Oracle",
    description: "Generate AI-powered World Cup predictions and share them as premium cards.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-bg text-zinc-100 antialiased bg-grid flex flex-col">
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
