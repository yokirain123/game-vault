import Image from "next/image";
import CollectionsHome from "./components/ui/collectionsHome";
import Footer from "./components/ui/Footer";
import Header from "./components/ui/Header";
import Hero from "./components/ui/Hero";
import ReviewHome from "./components/ui/reviewHome";
import minecraftGif from "./components/images/minecraft.gif";

export default function Home() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <main className="flex flex-1 flex-col gap-24 pb-20 sm:gap-32 sm:pb-24 lg:gap-40 lg:pb-32">
        <Hero />
        <ReviewHome />
        <CollectionsHome />
        <Image
          src={minecraftGif}
          alt="Піксельна анімація Minecraft"
          width={300}
          height={300}
          className="mx-auto h-auto w-40 sm:w-56 lg:w-[300px]"
        />
      </main>
      <Footer />
    </div>
  );
}
