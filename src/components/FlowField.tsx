"use client";

import { useEffect, useRef } from "react";

export default function FlowField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const lines = [
      { phase: 0, speed: 0.5, amp: 50, alpha: 0.04 },
      { phase: 1.8, speed: 0.6, amp: 65, alpha: 0.07 },
      { phase: 3.2, speed: 0.45, amp: 45, alpha: 0.10 },
      { phase: 4.7, speed: 0.55, amp: 60, alpha: 0.13 },
    ];

    let frame = 0;
    let mouseY = 0.5;
    let targetY = 0.5;
    let w = 0, h = 0;

    function resize() {
      const parent = canvas!.parentElement!;
      const rect = parent.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas!.width = w;
      canvas!.height = h;
    }

    function onPointerMove(e: PointerEvent) {
      const parent = canvas!.parentElement!;
      const rect = parent.getBoundingClientRect();
      targetY = (e.clientY - rect.top) / rect.height;
    }

    function onPointerLeave() {
      targetY = 0.5;
    }

    function draw() {
      frame++;
      const isDark = document.documentElement.classList.contains("dark");
      const baseColor = isDark ? "255,255,255" : "0,0,0";

      ctx!.clearRect(0, 0, w, h);
      mouseY += (targetY - mouseY) * 0.15;

      const cursorInfluence = (mouseY - 0.5) * 2.5;

      for (const line of lines) {
        const t = frame * 0.008 * line.speed;
        ctx!.beginPath();

        const segments = 60;
        for (let i = 0; i <= segments; i++) {
          const x = (i / segments) * w;
          const baseY = h * 0.5 + Math.sin(i * 0.12 + t + line.phase) * line.amp;
          const warp = cursorInfluence * 160 * (1 - Math.abs(i / segments - 0.5) * 1.4);
          const y = Math.max(0, Math.min(h, baseY + warp));

          if (i === 0) ctx!.moveTo(x, y);
          else ctx!.lineTo(x, y);
        }

        ctx!.strokeStyle = `rgba(${baseColor},${line.alpha})`;
        ctx!.lineWidth = 4;
        ctx!.stroke();
      }

      const grad = ctx!.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) * 0.65);
      grad.addColorStop(0, "transparent");
      grad.addColorStop(1, `rgba(${baseColor},0.15)`);
      ctx!.fillStyle = grad;
      ctx!.fillRect(0, 0, w, h);

      requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener("resize", resize);
    canvas.addEventListener("pointermove", onPointerMove, { passive: true });
    canvas.addEventListener("pointerleave", onPointerLeave, { passive: true });
    const raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}