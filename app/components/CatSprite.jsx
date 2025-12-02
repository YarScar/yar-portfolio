"use client";
import { useEffect, useRef, useState } from "react";

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
  animation = "crawlStretch",
  hoverAnimation = "walk",
  frameSize = 32,
  fps = 2,
  loop = true,
  scale = 1,
  className = "",
  style = {},
  onSecretTrigger = null,
  isAdminMode = false, // Add prop to know if already in admin mode
}) {
  const spriteRef = useRef(null);
  const [currentAnimation, setCurrentAnimation] = useState(animation);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isOverTarget, setIsOverTarget] = useState(false);

  const anim = typeof currentAnimation === "string" ? CAT_ANIMATIONS[currentAnimation] : currentAnimation;
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
  }, [row, frames, fps, frameSize, loop, currentAnimation]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    const rect = spriteRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const newPosition = {
      x: e.clientX - dragOffset.x,
      y: e.clientY - dragOffset.y
    };
    
    setPosition(newPosition);
    
    // Check if currently over target while dragging
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    const elements = document.elementsFromPoint(mouseX, mouseY);
    
    const yaraElement = elements.find(el => {
      // First check if it's the specific target element
      if (el.id === 'yara-kemeh-target') return true;
      
      // Fallback to exact text matching
      const text = (el.textContent || el.innerText || '').trim().toLowerCase();
      return text === 'yara kemeh';
    });
    
    setIsOverTarget(!!yaraElement);
  };

  const handleMouseUp = (e) => {
    if (isDragging && onSecretTrigger && !isAdminMode) {
      // Only check for secret trigger if not already in admin mode
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      
      // Check if mouse is released on "Yara Kemeh" text
      const elements = document.elementsFromPoint(mouseX, mouseY);
      
      // Look for exact "Yara Kemeh" text match - be very specific
      const yaraElement = elements.find(el => {
        // First check if it's the specific target element
        if (el.id === 'yara-kemeh-target') return true;
        
        // Fallback to text matching for exact content
        const text = (el.textContent || el.innerText || '').trim().toLowerCase();
        return text === 'yara kemeh';
      });
      
      console.log('Mouse released at:', mouseX, mouseY);
      console.log('Elements found:', elements.map(el => ({
        tagName: el.tagName,
        text: (el.textContent || '').trim().substring(0, 30),
        matches: (el.textContent || '').trim().toLowerCase() === 'yara kemeh'
      })));
      
      if (yaraElement) {
        console.log('✅ Secret trigger activated! Cat dropped on Yara Kemeh');
        onSecretTrigger();
      } else {
        console.log('❌ Cat not dropped on Yara Kemeh text');
      }
    }
    
    setIsDragging(false);
    setIsOverTarget(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset, onSecretTrigger]);

  return (
    <div
      ref={spriteRef}
      aria-label={`cat-sprite-${currentAnimation}`}
      className={className}
      onMouseDown={handleMouseDown}
      onMouseEnter={() => !isDragging && setCurrentAnimation(hoverAnimation)}
      onMouseLeave={() => !isDragging && setCurrentAnimation("idleSit")}
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
        position: 'fixed',
        left: position.x,
        top: position.y,
        cursor: isDragging ? 'grabbing' : 'grab',
        zIndex: isDragging ? 1000 : 'auto',
        userSelect: 'none',
        filter: isOverTarget && isDragging ? 'drop-shadow(0 0 20px #A855F7) brightness(1.2)' : 'none',
        transition: 'filter 0.2s ease',
        ...style,
      }}
    />
  );
}
