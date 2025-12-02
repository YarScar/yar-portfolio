"use client";
import { useEffect, useRef } from "react";

export const CAT_ANIMATIONS = {
  idleSit: { row: 0, frames: 4 },
  idleTailFlick: { row: 1, frames: 4 },
  blinkHeadTurn: { row: 2, frames: 4 },
  scratchGroom: { row: 3, frames: 4 },
  walk: { row: 4, frames: 8 },
  layBellyWiggle: { row: 5, frames: 8 },
  crawlStretch: { row: 6, frames: 4 },
  run: { row: 7, frames: 8 },
  jumpPrepPounce: { row: 8, frames: 4 },
  standCockTail: { row: 9, frames: 8 },
};

export default function CatSprite({
  animation = "walk",
  frameSize = 32,
  fps = 8,
  loop = true,
  scale = 1,
  className = "",
  style = {},
}) {
  const spriteRef = useRef(null);

  const anim = typeof animation === "string" ? CAT_ANIMATIONS[animation] : animation;
  const frames = anim?.frames ?? 4;
  const row = anim?.row ?? 0;

  useEffect(() => {
    if (!spriteRef.current) return;
    let currentFrame = 0;
    spriteRef.current.style.backgroundPosition = `0px -${row * frameSize}px`;

    const tick = () => {
      currentFrame = (currentFrame + 1) % frames;
      spriteRef.current.style.backgroundPosition = `-${currentFrame * frameSize}px -${row * frameSize}px`;
      if (!loop && currentFrame === frames - 1) clearInterval(interval);
    };

    const interval = setInterval(tick, 1000 / fps);
    return () => clearInterval(interval);
  }, [row, frames, fps, frameSize, loop]);

  return (
    <div
      ref={spriteRef}
      aria-label={`cat-sprite-${animation}`}
      className={className}
      style={{
        width: frameSize,
        height: frameSize,
        transform: `scale(${scale})`,
        transformOrigin: 'left center',
        display: 'inline-block',
        backgroundImage: "url('/assets/CatSprite.png')",
        backgroundRepeat: "no-repeat",
        imageRendering: "pixelated",
        backgroundSize: "auto",
        ...style,
      }}
    />
  );
}
