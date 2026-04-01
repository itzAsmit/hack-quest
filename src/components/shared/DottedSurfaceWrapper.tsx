'use client';

import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';

const DottedSurface = dynamic(
  () => import('@/components/ui/dotted-surface').then((mod) => mod.DottedSurface),
  { ssr: false }
);

export function DottedSurfaceWrapper() {
  const pathname = usePathname();

  if (pathname === '/') {
    return null;
  }

  return <DottedSurface />;
}
