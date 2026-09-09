"use client";

import { useEffect, useState } from "react";
import { FaChevronDown } from "react-icons/fa";

const slides = [
  {
    text: "Game Vault",
    shape: "skew-x-[-4deg] rotate-[-1deg]",
    wrapperColor: "bg-linear-to-t from-[#1F6F5F] to-[#6FCF97]",
    textColor: "text-background",
    size: "text-[clamp(2rem,10vw,6rem)]",
  },
  {
    text: "Рецензії",
    shape: "rotate-[1deg]",
    wrapperColor: "bg-linear-to-tr from-[#FA812F] to-[#F3C623]",
    textColor: "text-background",
    size: "text-[clamp(1.65rem,7vw,3.75rem)]",
  },
  {
    text: "Добірки",
    shape: "rotate-[-1deg]",
    wrapperColor: "bg-linear-to-r from-[#8A244B] to-[#F63049]",
    textColor: "text-background",
    size: "text-[clamp(1.65rem,7vw,3.75rem)]",
  },
  {
    text: "Беклог",
    shape: "rotate-[1deg]",
    wrapperColor: "bg-linear-to-b from-[#462C7D] to-[#FF70BF]",
    textColor: "text-background",
    size: "text-[clamp(1.65rem,7vw,3.75rem)]",
  },
  {
    text: "Рекомендації",
    shape: "rotate-[-1deg]",
    wrapperColor: "bg-linear-to-l from-[#162E93] to-[#2F2FE4]",
    textColor: "text-background",
    size: "text-[clamp(1.35rem,6vw,3.5rem)]",
  },
];

function Hero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const interval = window.setInterval(() => {
      setIndex((previousIndex) => (previousIndex + 1) % slides.length);
    }, 1600);

    return () => window.clearInterval(interval);
  }, []);

  const currentSlide = slides[index];

  return (
    <section
      aria-labelledby="hero-title"
      className="flex min-h-[clamp(32rem,82svh,52rem)] flex-col justify-center overflow-hidden px-4 pb-8 pt-24 sm:px-6 sm:pt-28 lg:pt-32"
    >
      <div className="flex flex-1 items-center justify-center font-pixel">
        <h1
          id="hero-title"
          className="max-w-full cursor-default select-none text-center font-bold leading-tight"
        >
          <span
            key={currentSlide.text}
            className={`inline-block max-w-[calc(100vw-2rem)] break-words px-4 py-4 uppercase motion-preset-pop motion-duration-300 sm:px-8 sm:py-5 lg:px-10 ${currentSlide.shape} ${currentSlide.wrapperColor} ${currentSlide.textColor} ${currentSlide.size}`}
          >
            {currentSlide.text}
          </span>
        </h1>
      </div>

      <div className="mt-8 flex items-center justify-center gap-3 text-center text-sm text-main/60 sm:text-lg">
        <FaChevronDown
          aria-hidden="true"
          size={14}
          className="shrink-0 motion-preset-oscillate motion-duration-700"
        />
        <span>Скроль вниз, щоб побачити більше</span>
        <FaChevronDown
          aria-hidden="true"
          size={14}
          className="shrink-0 motion-preset-oscillate motion-duration-700"
        />
      </div>
    </section>
  );
}

export default Hero;
