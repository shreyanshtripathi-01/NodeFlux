"use client";

import { useEffect, useRef } from "react";

export function DotField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const dots: { x: number; y: number; ox: number; oy: number }[] = [];
    const spacing = 24;

    for (let x = spacing / 2; x < width; x += spacing) {
      for (let y = spacing / 2; y < height; y += spacing) {
        dots.push({ x, y, ox: x, oy: y });
      }
    }

    const mouse = { x: -1000, y: -1000 };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
      dots.length = 0;
      for (let x = spacing / 2; x < width; x += spacing) {
        for (let y = spacing / 2; y < height; y += spacing) {
          dots.push({ x, y, ox: x, oy: y });
        }
      }
    };

    window.addEventListener("resize", handleResize);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#e5e5e5";
      ctx.beginPath();

      dots.forEach((dot) => {
        const dx = mouse.x - dot.ox;
        const dy = mouse.y - dot.oy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 80;

        if (dist < maxDist) {
          const force = (maxDist - dist) / maxDist;
          dot.x = dot.ox - dx * force * 0.2;
          dot.y = dot.oy - dy * force * 0.2;
        } else {
          dot.x += (dot.ox - dot.x) * 0.1;
          dot.y += (dot.oy - dot.y) * 0.1;
        }

        ctx.moveTo(dot.x + 1, dot.y);
        ctx.arc(dot.x, dot.y, 1, 0, Math.PI * 2);
      });

      ctx.fill();
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block pointer-events-none" />;
}