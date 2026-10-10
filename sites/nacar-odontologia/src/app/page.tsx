import { Manifesto } from "@/components/Manifesto";
import { MobileBookingBar } from "@/components/MobileBookingBar";
import { SiteHeader } from "@/components/SiteHeader";
import { Hero } from "@/components/hero/Hero";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="conteudo">
        <Hero />
        <Manifesto />
      </main>
      <MobileBookingBar />
    </>
  );
}
