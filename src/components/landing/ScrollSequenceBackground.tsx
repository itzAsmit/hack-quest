'use client';

import { useEffect, useMemo, useState } from 'react';

const TOTAL_FRAMES = 210;

const getFramePath = (frame: number) => {
  const clamped = Math.min(Math.max(frame, 1), TOTAL_FRAMES);
  return `/sequence/ezgif-frame-${String(clamped).padStart(3, '0')}.jpg`;
};

export function ScrollSequenceBackground() {
  const [frame, setFrame] = useState(1);

  const frameSrc = useMemo(() => getFramePath(frame), [frame]);

  useEffect(() => {
    const updateFrameFromScroll = () => {
      const scrollMax = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1,
      );
      const progress = Math.min(Math.max(window.scrollY / scrollMax, 0), 1);
      const nextFrame = 1 + Math.floor(progress * (TOTAL_FRAMES - 1));
      setFrame(nextFrame);
    };

    window.addEventListener('scroll', updateFrameFromScroll, { passive: true });
    window.addEventListener('resize', updateFrameFromScroll);
    updateFrameFromScroll();

    return () => {
      window.removeEventListener('scroll', updateFrameFromScroll);
      window.removeEventListener('resize', updateFrameFromScroll);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-[3] overflow-hidden">
      <img
        src={frameSrc}
        alt=""
        aria-hidden="true"
        className="h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-[#02040a]/58" />
    </div>
  );
}
