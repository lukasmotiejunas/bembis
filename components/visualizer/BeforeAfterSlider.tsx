"use client";
import { useRef, useState, useCallback } from "react";

interface Props {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export default function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeLabel = "Jūsų namai",
  afterLabel = "Kalėdinė peržiūra",
}: Props) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const getPosition = useCallback((clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return 50;
    return Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
  }, []);

  const onMouseDown = (e: React.MouseEvent) => { isDragging.current = true; setPosition(getPosition(e.clientX)); };
  const onMouseMove = (e: React.MouseEvent) => { if (!isDragging.current) return; setPosition(getPosition(e.clientX)); };
  const onMouseUp = () => { isDragging.current = false; };
  const onTouchStart = (e: React.TouchEvent) => { isDragging.current = true; setPosition(getPosition(e.touches[0].clientX)); };
  const onTouchMove = (e: React.TouchEvent) => { if (!isDragging.current) return; setPosition(getPosition(e.touches[0].clientX)); };
  const onTouchEnd = () => { isDragging.current = false; };

  return (
    <div
      ref={containerRef}
      className="relative select-none overflow-hidden rounded-2xl"
      style={{ cursor: "ew-resize", aspectRatio: "16/9" }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <img src={afterImage} alt={afterLabel}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none" draggable={false} />

      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ width: `${position}%` }}>
        <img src={beforeImage} alt={beforeLabel}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ width: `${10000 / position}%`, maxWidth: "none" }}
          draggable={false} />
        <div className="absolute inset-0 bg-[rgba(8,9,26,0.25)]" />
      </div>

      <div className="absolute top-0 bottom-0 w-0.5 bg-white/80 shadow-[0_0_10px_rgba(255,255,255,0.5)] pointer-events-none"
        style={{ left: `${position}%`, transform: "translateX(-50%)" }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-xl"
          style={{ boxShadow: "0 0 20px rgba(201,162,39,0.5)" }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M7 5L3 10L7 15" stroke="#C9A227" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M13 5L17 10L13 15" stroke="#C9A227" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      <div className="absolute top-4 left-4 pointer-events-none">
        <span className="px-3 py-1.5 rounded-full text-xs font-semibold text-white bg-[rgba(0,0,0,0.65)] backdrop-blur-sm border border-white/10">
          {beforeLabel}
        </span>
      </div>
      <div className="absolute top-4 right-4 pointer-events-none">
        <span className="px-3 py-1.5 rounded-full text-xs font-semibold text-yellow-950 backdrop-blur-sm"
          style={{ background: "linear-gradient(135deg, #C9A227, #E8C84A)" }}>
          {afterLabel} ✨
        </span>
      </div>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none">
        <span className="px-3 py-1.5 rounded-full text-xs text-white/70 bg-[rgba(0,0,0,0.5)] backdrop-blur-sm whitespace-nowrap">
          ← Vilkite norėdami palyginti →
        </span>
      </div>
    </div>
  );
}
