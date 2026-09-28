import { FinalCta } from "@/components/FinalCta";
import { Hero } from "@/components/Hero";
import { InstagramStrip } from "@/components/InstagramStrip";
import { MobileBookingBar } from "@/components/MobileBookingBar";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { Studio } from "@/components/Studio";
import { Testimonials } from "@/components/Testimonials";
import { Treatments } from "@/components/Treatments";
import { Visit } from "@/components/Visit";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="conteudo">
        <Hero />
        <Treatments />
        <Studio />
        <Testimonials />
        <InstagramStrip />
        <Visit />
        <FinalCta />
      </main>
      <SiteFooter />
      <MobileBookingBar />
    </>
  );
}
