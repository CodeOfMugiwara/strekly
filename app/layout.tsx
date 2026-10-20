import type { Metadata } from "next";
import { Inter, Caveat } from "next/font/google";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { MotionProvider } from "@/components/layout/MotionProvider";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const caveat = Caveat({ subsets: ["latin"], variable: "--font-script" });

export const metadata: Metadata = {
  title: "Habit Tracker",
  description: "A better you, everyday. Habit and mood tracking with Lavender Sky.",
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
