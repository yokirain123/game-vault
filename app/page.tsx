"use client";

import CollectionsHome from "./components/ui/collectionsHome";
import Header from "./components/ui/Header";
import Hero from "./components/ui/Hero";
import ReviewHome from "./components/ui/reviewHome";
import SmoothScroll from "./components/ui/SmoothScroll";

export default function Home() {
  return (
    <SmoothScroll>
      <main className="">
        <Header />
        <Hero />
        <ReviewHome />
        <CollectionsHome />
      </main>
    </SmoothScroll>
  );
}
