"use client";

import { useState } from "react";

function TiltCard() {
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
    <div className="flex min-h-screen items-center justify-center">
      <div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `perspective(900px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
        }}
        className="
          h-160 w-150 rounded-3xl bg-[#59B292]
          transition-transform duration-200 ease-out
          will-change-transform
        "
      >
        <div className="flex h-full items-center justify-center text-3xl font-bold text-zinc-950">
          Tilt me
        </div>
      </div>
    </div>
  );
}

export default TiltCard;