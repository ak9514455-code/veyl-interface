import React, { Suspense } from 'react';

const LazyMatrix = React.lazy(() => import('@/components/reactbits/MatrixBackground'));

export default function CinematicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-[#B7F5A9]">
      {/* Decorative backdrop loaded lazily for perf */}
      <Suspense fallback={<div className="absolute inset-0 -z-10 bg-black" />}>
        <div className="absolute inset-0 -z-10 pointer-events-none">
          {/* @ts-ignore */}
          <LazyMatrix className="h-full w-full" />
        </div>
      </Suspense>

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-12">{children}</div>
    </div>
  );
}
