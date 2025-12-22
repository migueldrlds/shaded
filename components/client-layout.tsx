'use client';

import 'lenis/dist/lenis.css';
import { ReactLenis } from 'lenis/react';
import { useEffect, useState } from 'react';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 900);
    };

    checkMobile();

    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);


  if (isMobile) {
    return <>{children}</>;
  }


  const scrollSettings = {
    duration: 1.2,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical' as const,
    gestureDirection: 'vertical' as const,
    smooth: true,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
    lerp: 0.1,
    wheelMultiplier: 1,
    orientation: 'vertical' as const,
    smoothWheel: true,
    syncTouch: true,
  };

  return (
    <ReactLenis root options={scrollSettings}>
      {children}
    </ReactLenis>
  );
}

