import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  life: number;
  maxLife: number;
};

export default function SplashCursor() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointerRef = useRef({ x: 0, y: 0, visible: false });
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || window.matchMedia("(pointer: coarse)").matches) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const spawnBurst = (x: number, y: number, count = 7) => {
      const particles = particlesRef.current;
      for (let i = 0; i < count; i += 1) {
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.8;
        const speed = 0.18 + Math.random() * 0.9;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          radius: 1.1 + Math.random() * 3.2,
          life: 0,
          maxLife: 42 + Math.random() * 36,
        });
      }
    };

    const updatePointer = (event: PointerEvent) => {
      pointerRef.current.x = event.clientX;
      pointerRef.current.y = event.clientY;
      pointerRef.current.visible = true;
      spawnBurst(event.clientX, event.clientY, 10);
    };

    const onPointerDown = (event: PointerEvent) => {
      spawnBurst(event.clientX, event.clientY, 26);
    };

    const hidePointer = () => {
      pointerRef.current.visible = false;
    };

    const animate = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i -= 1) {
        const particle = particles[i];
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vx *= 0.994;
        particle.vy *= 0.994;
        particle.vy += 0.01;
        particle.life += 1;

        const alpha = 1 - particle.life / particle.maxLife;
        const glow = 9 + particle.radius * 2.3;

        ctx.beginPath();
        ctx.fillStyle = `rgba(160, 255, 200, ${Math.max(alpha * 0.55, 0)})`;
        ctx.shadowBlur = glow;
        ctx.shadowColor = "rgba(90, 255, 160, 0.35)";
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fill();

        if (particle.life >= particle.maxLife) {
          particles.splice(i, 1);
        }
      }

      ctx.shadowBlur = 0;
      if (pointerRef.current.visible) {
        const { x, y } = pointerRef.current;
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, 24);
        gradient.addColorStop(0, "rgba(215, 255, 225, 0.42)");
        gradient.addColorStop(0.18, "rgba(150, 255, 196, 0.22)");
        gradient.addColorStop(0.5, "rgba(120, 255, 175, 0.06)");
        gradient.addColorStop(1, "rgba(120, 255, 175, 0)");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, 24, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = "rgba(240, 255, 244, 0.5)";
        ctx.shadowBlur = 9;
        ctx.shadowColor = "rgba(140, 255, 190, 0.7)";
        ctx.arc(x, y, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.shadowBlur = 0;
      rafRef.current = requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener("pointermove", updatePointer);
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerleave", hidePointer);
    window.addEventListener("blur", hidePointer);
    window.addEventListener("resize", resize);

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("pointermove", updatePointer);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerleave", hidePointer);
      window.removeEventListener("blur", hidePointer);
      window.removeEventListener("resize", resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9999] hidden md:block"
      style={{ opacity: 0.45, mixBlendMode: "screen" }}
    />
  );
}
