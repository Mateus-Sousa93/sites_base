import { Exams } from "@/components/Exams";
import { Hero } from "@/components/Hero";
import { MobileBookingBar } from "@/components/MobileBookingBar";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { Specialties } from "@/components/Specialties";
import { Steps } from "@/components/Steps";
import { Team } from "@/components/Team";
import { Testimonials } from "@/components/Testimonials";
import { Visit } from "@/components/Visit";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="conteudo">
        <Hero />
        <Specialties />
        <Exams />
        <Steps />
        <Team />
        <Testimonials />
        <Visit />
      </main>
      <SiteFooter />
      <MobileBookingBar />
    </>
  );
}
