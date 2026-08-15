import { useEffect, useState } from 'react';

export default function LoadingOverlay() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const initialTimer = window.setTimeout(() => setVisible(false), 1200);
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const a = target.closest('a');
      if (!a) return;
      const href = a.getAttribute('href') || '';
      const targetAttr = a.getAttribute('target') || '';
      if (href.startsWith('#') || targetAttr === '_blank' || href.startsWith('mailto:')) return;
      setVisible(true);
      window.setTimeout(() => setVisible(false), 900);
    };

    document.addEventListener('click', handleClick);
    return () => {
      clearTimeout(initialTimer);
      document.removeEventListener('click', handleClick);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#020805]/85 backdrop-blur-[2px]">
      <div className="matrix-loader-shell relative flex h-52 w-80 items-center justify-center overflow-hidden rounded-2xl border border-[#38d77a]/30 bg-black/60 shadow-[0_0_18px_rgba(35,255,110,0.2)]">
        <div className="matrix-loader-scan" />
        <div className="absolute inset-0 opacity-50 [background-image:linear-gradient(rgba(81,255,138,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(81,255,138,0.12)_1px,transparent_1px)] [background-size:18px_18px]" />

        <div className="relative z-10 flex flex-col items-center gap-4 text-center">
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-[#63f59a]/60 bg-[#07150d] shadow-[0_0_24px_rgba(67,255,129,0.25)]">
            <div className="matrix-loader-ring" />
            <div className="absolute h-7 w-7 rounded-full border border-[#8cf7b0]/80" />
            <div className="h-2.5 w-2.5 rounded-full bg-[#9ef7b8] shadow-[0_0_12px_rgba(158,247,184,1)]" />
          </div>

          <div className="space-y-2">
            <p className="font-mono text-[10px] uppercase tracking-[0.42em] text-[#8ff7b2]/70">
              Secure link
            </p>
            <div className="font-mono text-sm text-[#b7f5a9]">
              <span className="text-[#6af29a]">&gt; </span>
              Initializing privacy tunnel
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
