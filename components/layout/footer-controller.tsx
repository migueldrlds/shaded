'use client';

import FooterNew from 'components/layout/footer-new';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function FooterController() {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);

  // Detectar si es móvil
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // No mostrar footer en estas páginas
  if (
    pathname &&
    (pathname.startsWith('/register') ||
     pathname.startsWith('/welcome') ||
     pathname.startsWith('/login'))
  ) {
    return null;
  }

  // No mostrar footer en páginas de productos en móvil
  if (
    pathname &&
    pathname.startsWith('/product/') &&
    isMobile
  ) {
    return null;
  }

  return (
    <div style={{ zIndex: 20 }}>
      <FooterNew />
    </div>
  );
}


