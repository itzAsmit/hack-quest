'use client';

import dynamic from 'next/dynamic';

const DottedSurface = dynamic(
  () => import('@/components/ui/dotted-surface').then((mod) => mod.DottedSurface),
  { ssr: false }
);

export function DottedSurfaceWrapper() {
  return (
    <DottedSurface
      dotColor={[110, 168, 255]}
      dotOpacity={0.55}
      mouseInfluence={140}
      scrollFadeDistance={900}
    />
  );
}
