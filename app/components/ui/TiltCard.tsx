"use client";

import Image, { type StaticImageData } from "next/image";
import { useState } from "react";

type TiltCardProps = {
  image: StaticImageData;
  title?: string;
};

function TiltCard({ image, title }: TiltCardProps) {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    setRotate({
      x: ((mouseY - centerY) / centerY) * -8,
      y: ((mouseX - centerX) / centerX) * 8,
    });
  }

  function handleMouseLeave() {
    setRotate({ x: 0, y: 0 });
  }

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(900px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
      }}
      className="relative aspect-[6/5] w-full overflow-hidden rounded-3xl bg-bg-alt/25 transition-transform duration-200 ease-out lg:max-w-xl lg:will-change-transform"
    >
      <Image
        src={image}
        alt={title || "Ілюстрація Game Vault"}
        fill
        sizes="(max-width: 1023px) calc(100vw - 2rem), 38vw"
        className="object-cover p-2 sm:p-3"
      />
    </div>
  );
}

export default TiltCard;
