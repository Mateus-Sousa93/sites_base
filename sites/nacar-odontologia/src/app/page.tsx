import { Booking } from "@/components/Booking";
import { Manifesto } from "@/components/Manifesto";
import { Marquee } from "@/components/Marquee";
import { MobileBookingBar } from "@/components/MobileBookingBar";
import { Process } from "@/components/Process";
import { Results } from "@/components/Results";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { Space } from "@/components/Space";
import { Team } from "@/components/Team";
import { Testimonials } from "@/components/Testimonials";
import { Treatments } from "@/components/Treatments";
import { Hero } from "@/components/hero/Hero";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="conteudo">
        <Hero />
        <Marquee />
        <Manifesto />
        <Treatments />
        <Results />
        <Process />
        <Space />
        <Team />
        <Testimonials />
        <Booking />
      </main>
      <SiteFooter />
      <MobileBookingBar />
    </>
  );
}
