"use client";

import { useState } from "react";

type TiltCardProps = {
  image: string;
  title?: string;
};

function TiltCard({ image, title }: TiltCardProps) {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();

    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((mouseY - centerY) / centerY) * -12;
    const rotateY = ((mouseX - centerX) / centerX) * 12;

    setRotate({ x: rotateX, y: rotateY });
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
      className="
        relative h-full w-full overflow-hidden rounded-5xl
        transition-transform duration-200 ease-out
        will-change-transform bg-bg-alt/25 rounded-3xl
      "
    >
      <img
        src={image}
        alt={title || "Tilt card image"}
        className="p-3 h-128 w-150 rounded-4xl object-cover"
      />
    </div>
  );
}

export default TiltCard;
