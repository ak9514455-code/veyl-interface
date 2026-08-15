import { useEffect, useRef } from "react";

export default function ParticleBackground({ color = "#7C5CFF" }: { color?: string }) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const canvasEl = canvas as HTMLCanvasElement;
    const ctx = canvasEl.getContext("2d");
    if (!ctx) return;

    let w = (canvasEl.width = canvasEl.clientWidth * devicePixelRatio);
    let h = (canvasEl.height = canvasEl.clientHeight * devicePixelRatio);
    ctx.scale(devicePixelRatio, devicePixelRatio);

    let particles: { x: number; y: number; r: number; vx: number; vy: number; alpha: number }[] = [];
    const count = Math.max(8, Math.floor((canvasEl.clientWidth * canvasEl.clientHeight) / (800 * 400)) );
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvasEl.clientWidth,
        y: Math.random() * canvasEl.clientHeight,
        r: 0.8 + Math.random() * 1.6,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        alpha: 0.12 + Math.random() * 0.36,
      });
    }

    let raf = 0;
    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvasEl.clientWidth, canvasEl.clientHeight);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -10) p.x = canvasEl.clientWidth + 10;
                if (p.x > canvasEl.clientWidth + 10) p.x = -10;
                if (p.y < -10) p.y = canvasEl.clientHeight + 10;
                if (p.y > canvasEl.clientHeight + 10) p.y = -10;

        ctx.beginPath();
        ctx.fillStyle = `rgba(124,92,255,${p.alpha})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    }

    draw();

    function onResize() {
          w = (canvasEl.width = canvasEl.clientWidth * devicePixelRatio);
          h = (canvasEl.height = canvasEl.clientHeight * devicePixelRatio);
      ctx.scale(devicePixelRatio, devicePixelRatio);
    }

    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
    };
  }, [color]);

  return (
    <canvas
      ref={ref}
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{ opacity: 0.55 }}
    />
  );
}
