import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingHero } from "@/components/landing/LandingHero";
import { LandingResults } from "@/components/landing/LandingResults";
import { LandingHowItWorks } from "@/components/landing/LandingHowItWorks";
import { LandingCta } from "@/components/landing/LandingCta";
import { LandingFooter } from "@/components/landing/LandingFooter";

/**
 * The public landing page.
 *
 * It owns `/` — the app's own Home lives at `/home` (see `proxy.ts`, which
 * sends signed-out visitors to `/login`).
 */
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-text">
      <LandingHeader />
      <main>
        <LandingHero />
        <LandingResults />
        <LandingHowItWorks />
        <LandingCta />
      </main>
      <LandingFooter />
    </div>
  );
}
