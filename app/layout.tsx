import type { Metadata } from "next";
import { Inter, Caveat } from "next/font/google";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { MotionProvider } from "@/components/layout/MotionProvider";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const caveat = Caveat({ subsets: ["latin"], variable: "--font-script" });

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "https://strekly.netlify.app",
  ),
  title: "Strekly — Habit & Mood Tracker",
  description:
    "Your streak, everyday. Strekly tracks your daily habits and mood in one calm place, so you can see what keeps you going.",
  openGraph: {
    title: "Strekly — Habit & Mood Tracker",
    description:
      "Your streak, everyday. Track daily habits and mood in one calm place.",
    type: "website",
    siteName: "Strekly",
  },
  twitter: {
    card: "summary_large_image",
    title: "Strekly — Habit & Mood Tracker",
    description:
      "Your streak, everyday. Track daily habits and mood in one calm place.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${caveat.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full font-sans">
        <ThemeProvider>
          <MotionProvider>
            {children}
          </MotionProvider>
          <Toaster
            position="bottom-right"
            toastOptions={{
              className: "glass-card text-text border border-border shadow-pop font-sans text-sm",
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
