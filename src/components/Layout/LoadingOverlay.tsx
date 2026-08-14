import { useEffect, useState } from 'react';

export default function LoadingOverlay() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const a = target.closest('a');
      if (!a) return;
      const href = a.getAttribute('href') || '';
      const targetAttr = a.getAttribute('target') || '';
      if (href.startsWith('#') || targetAttr === '_blank' || href.startsWith('mailto:')) return;
      // show overlay
      setVisible(true);
      setTimeout(() => setVisible(false), 700);
    }
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  if (!visible) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#063A16] to-[#2E8F4D] flex items-center justify-center shadow-xl">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M3 12h18" stroke="#B7F5A9" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 3v18" stroke="#B7F5A9" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="text-sm font-mono text-[#A9DFA7]">Securing connection…</div>
      </div>
    </div>
  );
}
