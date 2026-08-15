import React, { Suspense } from 'react';

const LazyMatrix = React.lazy(() => import('@/components/reactbits/MatrixBackground'));
const LazyLetterGlitch = React.lazy(() => import('@/components/reactbits/LetterGlitch'));

export default function CinematicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-[#B7F5A9]">
      <Suspense fallback={<div className="absolute inset-0 -z-10 bg-black" />}>
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 opacity-80">
            {/* @ts-ignore */}
            <LazyMatrix className="h-full w-full" />
          </div>
          <div className="absolute inset-0 opacity-35 mix-blend-screen">
            {/* @ts-ignore */}
            <LazyLetterGlitch
              glitchSpeed={110}
              centerVignette
              outerVignette={false}
              smooth
              className="h-full w-full"
            />
          </div>
        </div>
      </Suspense>

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-12">{children}</div>
    </div>
  );
}
