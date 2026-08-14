import { useEffect, useRef } from 'react';

export default function MatrixBackground({ opacity = 0.6 }: { opacity?: number }) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = (canvas.width = canvas.clientWidth * devicePixelRatio);
    let h = (canvas.height = canvas.clientHeight * devicePixelRatio);
    ctx.scale(devicePixelRatio, devicePixelRatio);

    const cols = Math.floor(canvas.clientWidth / 14);
    const ypos = new Array(cols).fill(0);
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789@$%&*+-<>!?#'.split('');

    let raf = 0;
    function draw() {
      if (!ctx) return;
      // translucent black background for trail effect
      ctx.fillStyle = `rgba(0,0,0,0.06)`;
      ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);

      ctx.fillStyle = `rgba(60,255,100,${opacity})`;
      ctx.font = '12px "JetBrains Mono", monospace';

      for (let i = 0; i < cols; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        const x = i * 14;
        const y = ypos[i] * 14;
        ctx.fillText(text, x, y);

        if (y > canvas.clientHeight && Math.random() > 0.975) ypos[i] = 0;
        ypos[i]++;
      }

      raf = requestAnimationFrame(draw);
    }

    draw();

    function onResize() {
      w = (canvas.width = canvas.clientWidth * devicePixelRatio);
      h = (canvas.height = canvas.clientHeight * devicePixelRatio);
      ctx.scale(devicePixelRatio, devicePixelRatio);
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
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{ opacity: 1 }}
    />
  );
}
