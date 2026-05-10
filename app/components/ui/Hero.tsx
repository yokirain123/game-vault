"use client";

import React, { useEffect, useState } from "react";
import { FaChevronDown } from "react-icons/fa";

const slides = [
  {
    text: "Game Vault",
    shape: "skew-x-[-4deg] rotate-[-1deg]",
    wrapperColor: "bg-[#59B292]",
    textColor: "text-background",
    size: "text-8xl",
  },
  {
    text: "Рецензії",
    shape: "skew-x-[3deg] rotate-[1deg]",
    wrapperColor: "bg-[#FFC94D]",
    textColor: "text-background",
  },
  {
    text: "Бібліотека",
    shape: "skew-x-[-2deg] rotate-[0deg]",
    wrapperColor: "bg-[#9B8EC7]",
    textColor: "text-background",
  },
  {
    text: "Улюблені ігри",
    shape: "skew-x-[5deg] rotate-[-1deg]",
    wrapperColor: "bg-[#FA6781]",
    textColor: "text-background",
  },
  {
    text: "Рекомендації",
    shape: "skew-x-[-3deg] rotate-[1deg]",
    wrapperColor: "bg-[#AACDDC]",
    textColor: "text-background",
  },
];

function Hero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const currentSlide = slides[index];

  return (
    <div>
      <div className="font-pixel bg-center bg-no-repeat w-full h-210 px-16 py-16 flex items-center justify-center">
        <h1 className="text-7xl font-bold text-center leading-tight cursor-default select-none">
          <span
            key={currentSlide.text}
            className={`
              inline-block px-10 py-4 uppercase
              motion-preset-pop motion-duration-300
              ${currentSlide.shape}
              ${currentSlide.wrapperColor}
              ${currentSlide.textColor}
              ${currentSlide.size || "text-5xl"}
            `}
          >
            {currentSlide.text}
          </span>
        </h1>
      </div>

      <div className="flex flex-row justify-center items-center text-center gap-4 text-lg text-muted-foreground mb-20">
        <FaChevronDown
          size={15}
          className="motion-preset-oscillate motion-duration-700"
        />
        Скроль вниз, щоб побачити більше
        <FaChevronDown
          size={15}
          className="motion-preset-oscillate motion-duration-700"
        />
      </div>
    </div>
  );
}

export default Hero;