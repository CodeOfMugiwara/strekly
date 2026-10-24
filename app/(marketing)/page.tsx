import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingHero } from "@/components/landing/LandingHero";
import { LandingResults } from "@/components/landing/LandingResults";
import { LandingComparison } from "@/components/landing/LandingComparison";
import { LandingHowItWorks } from "@/components/landing/LandingHowItWorks";
import { LandingFaq } from "@/components/landing/LandingFaq";
import { LandingCta } from "@/components/landing/LandingCta";
import { LandingFooter } from "@/components/landing/LandingFooter";

/**
 * The public landing page.
 *
 * It owns `/` — the app's own Home lives at `/home` (see `middleware.ts`,
 * which sends signed-out visitors to `/login`).
 */
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-text">
      <LandingHeader />
      <main>
        <LandingHero />
        <LandingResults />
        <LandingComparison />
        <LandingHowItWorks />
        <LandingFaq />
        <LandingCta />
      </main>
      <LandingFooter />
    </div>
  );
}
