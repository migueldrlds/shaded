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



  // Detectar si estamos en páginas claras (Colección, Contacto, Soporte, Políticas) O en producto móvil (fondo blanco)
  const isProductPageMobile = pathname?.startsWith('/product/') && isMobile;
  const isLightPage = pathname === '/coleccion' || pathname === '/contact' || pathname === '/support' || pathname === '/terms' || pathname === '/shipping-policy' || pathname === '/return-policy' || isProductPageMobile;

  return (
    <div style={{ zIndex: 20 }}>
      <FooterNew isDarkMode={isLightPage} />
    </div>
  );
}


