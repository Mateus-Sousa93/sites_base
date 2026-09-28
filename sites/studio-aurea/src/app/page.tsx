import { Gallery } from "@/components/Gallery";
import { Hero } from "@/components/Hero";
import { MobileBookingBar } from "@/components/MobileBookingBar";
import { Quiz } from "@/components/Quiz";
import { Results } from "@/components/Results";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { Studio } from "@/components/Studio";
import { TreatmentsShowcase } from "@/components/TreatmentsShowcase";
import { VisitCta } from "@/components/VisitCta";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="conteudo">
        <Hero />
        <TreatmentsShowcase />
        <Quiz />
        <Studio />
        <Results />
        <Gallery />
        <VisitCta />
      </main>
      <SiteFooter />
      <MobileBookingBar />
    </>
  );
}
