"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const outerPosRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onPointer = (e: PointerEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      if (innerRef.current) {
        innerRef.current.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`;
      }
    };

    const onHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive =
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.closest("a") ||
        target.closest("button") ||
        target.dataset.cursor === "pointer";

      if (outerRef.current) {
        outerRef.current.style.transform = `translate(${outerPosRef.current.x}px, ${outerPosRef.current.y}px) scale(${isInteractive ? 1.5 : 1})`;
        outerRef.current.style.borderColor = isInteractive ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0.3)";
      }
    };

    document.addEventListener("pointermove", onPointer);
    document.addEventListener("mouseover", onHover);

    let raf = 0;
    const lerp = () => {
      outerPosRef.current.x += (mouseRef.current.x - outerPosRef.current.x) * 0.12;
      outerPosRef.current.y += (mouseRef.current.y - outerPosRef.current.y) * 0.12;
      if (outerRef.current) {
        outerRef.current.style.transform = `translate(${outerPosRef.current.x - 16}px, ${outerPosRef.current.y - 16}px)`;
      }
      raf = requestAnimationFrame(lerp);
    };
    raf = requestAnimationFrame(lerp);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("pointermove", onPointer);
      document.removeEventListener("mouseover", onHover);
    };
  }, []);

  return (
    <>
      <div
        ref={outerRef}
        className="fixed top-0 left-0 w-8 h-8 rounded-full border pointer-events-none z-[9999]"
        style={{ borderColor: "rgba(0,0,0,0.3)", transition: "border-color 0.15s" }}
      />
      <div
        ref={innerRef}
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-foreground pointer-events-none z-[9999]"
      />
    </>
  );
}