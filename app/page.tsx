"use client";
import Header from "./components/ui/Header";
import Hero from "./components/ui/Hero";
import Main from "./components/ui/Main";

export default function Home() {
  return (
    <div>
      <main>
          <Header />
          <Hero />
          <Main />
      </main>
    </div>
  );
}
