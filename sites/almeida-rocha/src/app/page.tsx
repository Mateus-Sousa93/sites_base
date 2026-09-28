import { Contact } from "@/components/Contact";
import { Hero } from "@/components/Hero";
import { Migration } from "@/components/Migration";
import { MobileBookingBar } from "@/components/MobileBookingBar";
import { Segments } from "@/components/Segments";
import { Services } from "@/components/Services";
import { Simulator } from "@/components/Simulator";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { Testimonials } from "@/components/Testimonials";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="conteudo">
        <Hero />
        <Services />
        <Simulator />
        <Segments />
        <Migration />
        <Testimonials />
        <Contact />
      </main>
      <SiteFooter />
      <MobileBookingBar />
    </>
  );
}
