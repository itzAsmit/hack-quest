'use client';

import dynamic from 'next/dynamic';

const DottedSurface = dynamic(
  () => import('@/components/ui/dotted-surface').then((mod) => mod.DottedSurface),
  { ssr: false }
);

export function DottedSurfaceWrapper() {
  return <DottedSurface />;
}
