import { Adrenaline } from "@/components/Adrenaline";
import { Categories } from "@/components/Categories";
import { Community } from "@/components/Community";
import { Ebike } from "@/components/Ebike";
import { HeroVideo } from "@/components/HeroVideo";
import { MobileBookingBar } from "@/components/MobileBookingBar";
import { Products } from "@/components/Products";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { Visit } from "@/components/Visit";
import { Workshop } from "@/components/Workshop";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="conteudo">
        <HeroVideo />
        <Categories />
        <Ebike />
        <Products />
        <Adrenaline />
        <Workshop />
        <Community />
        <Visit />
      </main>
      <SiteFooter />
      <MobileBookingBar />
    </>
  );
}
