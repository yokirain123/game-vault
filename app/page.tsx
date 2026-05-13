"use client";

import Image from "next/image";
import CollectionsHome from "./components/ui/collectionsHome";
import Footer from "./components/ui/Footer";
import Header from "./components/ui/Header";
import Hero from "./components/ui/Hero";
import ReviewHome from "./components/ui/reviewHome";
import minecraftGif from "./components/images/minecraft.gif";

export default function Home() {
  return (
    <main>
      <Header />
      <div className="flex flex-col gap-48">
        <Hero />
        <ReviewHome />
        <CollectionsHome />
        <Image
          src={minecraftGif}
          alt="minecraft gif"
          width={300}
          height={300}
          className="mx-auto"
        />
      </div>
      <Footer />
    </main>
  );
}
