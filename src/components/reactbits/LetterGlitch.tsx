import { useEffect, useRef } from 'react';

type LetterTile = {
  char: string;
  color: string;
  targetColor: string;
  colorProgress: number;
};

const defaultCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$&*()-_+=/[]{};:<>.,0123456789';

function hexToRgb(hex: string) {
  const short = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const normalized = hex.replace(short, (_, r, g, b) => r + r + g + g + b + b);
  const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(normalized);

  if (!match) return null;
  return {
    r: Number.parseInt(match[1], 16),
    g: Number.parseInt(match[2], 16),
    b: Number.parseInt(match[3], 16),
  };
}

function interpolateColor(start: { r: number; g: number; b: number }, end: { r: number; g: number; b: number }, factor: number) {
  const result = {
    r: Math.round(start.r + (end.r - start.r) * factor),
    g: Math.round(start.g + (end.g - start.g) * factor),
    b: Math.round(start.b + (end.b - start.b) * factor),
  };
  return `rgb(${result.r}, ${result.g}, ${result.b})`;
}

export default function LetterGlitch({
  glitchColors = ['#173f2c', '#68f5a3', '#d8fff0'],
  className = '',
  glitchSpeed = 72,
  centerVignette = true,
  outerVignette = false,
  smooth = true,
  characters = defaultCharacters,
}: {
  glitchColors?: string[];
  className?: string;
  glitchSpeed?: number;
  centerVignette?: boolean;
  outerVignette?: boolean;
  smooth?: boolean;
  characters?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const lettersRef = useRef<LetterTile[]>([]);
  const gridRef = useRef({ columns: 0, rows: 0 });
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const lastGlitchTimeRef = useRef(Date.now());

  const lettersAndSymbols = Array.from(characters);
  const fontSize = 16;
  const charWidth = 10;
  const charHeight = 20;

  const getRandomChar = () => lettersAndSymbols[Math.floor(Math.random() * lettersAndSymbols.length)];

  const getRandomColor = () => glitchColors[Math.floor(Math.random() * glitchColors.length)];

  const calculateGrid = (width: number, height: number) => ({
    columns: Math.ceil(width / charWidth),
    rows: Math.ceil(height / charHeight),
  });

  const initializeLetters = (columns: number, rows: number) => {
    gridRef.current = { columns, rows };
    const totalLetters = columns * rows;
    lettersRef.current = Array.from({ length: totalLetters }, () => ({
      char: getRandomChar(),
      color: getRandomColor(),
      targetColor: getRandomColor(),
      colorProgress: 1,
    }));
  };

  const drawLetters = () => {
    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    if (!canvas || !ctx || lettersRef.current.length === 0) return;

    const width = canvas.clientWidth || 1;
    const height = canvas.clientHeight || 1;
    ctx.clearRect(0, 0, width, height);
    ctx.font = `${fontSize}px "JetBrains Mono", monospace`;
    ctx.textBaseline = 'top';

    lettersRef.current.forEach((letter, index) => {
      const x = (index % gridRef.current.columns) * charWidth;
      const y = Math.floor(index / gridRef.current.columns) * charHeight;
      ctx.fillStyle = letter.color;
      ctx.fillText(letter.char, x, y);
    });
  };

  const updateLetters = () => {
    if (!lettersRef.current.length) return;

    const updateCount = Math.max(1, Math.floor(lettersRef.current.length * 0.04));
    for (let i = 0; i < updateCount; i += 1) {
      const index = Math.floor(Math.random() * lettersRef.current.length);
      const letter = lettersRef.current[index];
      if (!letter) continue;

      letter.char = getRandomChar();
      letter.targetColor = getRandomColor();

      if (!smooth) {
        letter.color = letter.targetColor;
        letter.colorProgress = 1;
      } else {
        letter.colorProgress = 0;
      }
    }
  };

  const handleSmoothTransitions = () => {
    let needsRedraw = false;

    lettersRef.current.forEach((letter) => {
      if (letter.colorProgress >= 1) return;

      letter.colorProgress += 0.05;
      if (letter.colorProgress > 1) letter.colorProgress = 1;

      const startRgb = hexToRgb(letter.color);
      const endRgb = hexToRgb(letter.targetColor);
      if (startRgb && endRgb) {
        letter.color = interpolateColor(startRgb, endRgb, letter.colorProgress);
        needsRedraw = true;
      }
    });

    if (needsRedraw) drawLetters();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    contextRef.current = ctx;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (!parent) return;

      const dpr = window.devicePixelRatio || 1;
      const rect = parent.getBoundingClientRect();

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const { columns, rows } = calculateGrid(rect.width, rect.height);
      initializeLetters(columns, rows);
      drawLetters();
    };

    const animate = () => {
      const now = Date.now();
      if (now - lastGlitchTimeRef.current >= glitchSpeed) {
        updateLetters();
        drawLetters();
        lastGlitchTimeRef.current = now;
      }

      if (smooth) handleSmoothTransitions();
      animationRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    animate();

    let resizeTimeout: number | undefined;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(() => {
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
        resizeCanvas();
        animate();
      }, 90);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [glitchSpeed, smooth, glitchColors]);

  return (
    <div className={className} style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', background: '#030805' }}>
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%', opacity: 0.7 }} />
      {outerVignette && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background: 'radial-gradient(circle, rgba(0,0,0,0) 55%, rgba(0,0,0,0.9) 100%)',
          }}
        />
      )}
      {centerVignette && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background: 'radial-gradient(circle, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.05) 48%, rgba(0,0,0,0) 68%)',
          }}
        />
      )}
    </div>
  );
}
