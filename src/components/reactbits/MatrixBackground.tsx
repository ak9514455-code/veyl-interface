import { useEffect, useRef } from 'react';

export default function MatrixBackground({
  opacity = 0.55,
  className,
}: {
  opacity?: number;
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const canvasEl = canvas as HTMLCanvasElement;
    const ctx = canvasEl.getContext('2d');
    if (!ctx) return;

    const setCanvasSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = canvasEl.clientWidth || 1;
      const height = canvasEl.clientHeight || 1;
      canvasEl.width = width * dpr;
      canvasEl.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    setCanvasSize();

    const fontSize = 16;
    const cols = Math.max(12, Math.floor((canvasEl.clientWidth || 1) / fontSize));
    const drops = new Array(cols).fill(0).map(() => Math.random() * -30);
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('');

    let raf = 0;
    let last = performance.now();
    const targetFps = 24;
    const frameMs = 1000 / targetFps;

    function draw(now = performance.now()) {
      if (!ctx) return;
      const delta = now - last;
      if (delta < frameMs) {
        raf = requestAnimationFrame(draw);
        return;
      }
      last = now;

      const width = canvasEl.clientWidth || 1;
      const height = canvasEl.clientHeight || 1;

      ctx.fillStyle = `rgba(3, 9, 4, ${0.14 + Math.min(opacity, 0.9) * 0.2})`;
      ctx.fillRect(0, 0, width, height);

      for (let i = 0; i < cols; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        const glow = i % 4 === 0 ? 0.9 : 0.55;
        ctx.fillStyle = `rgba(109, 255, 143, ${glow})`;
        ctx.font = `${fontSize}px "JetBrains Mono", monospace`;
        ctx.fillText(char, x, y);

        if (y > height && Math.random() > 0.97) {
          drops[i] = Math.random() * -20;
        }
        drops[i] += 0.5 + Math.random() * 0.9;
      }

      raf = requestAnimationFrame(draw);
    }

    raf = requestAnimationFrame(draw);

    function onResize() {
      setCanvasSize();
    }

    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(raf);
    };
  }, [opacity]);

  return (
    <canvas
      ref={ref}
      className={className ?? 'pointer-events-none absolute inset-0 h-full w-full'}
      style={{ opacity: 1 }}
    />
  );
}
