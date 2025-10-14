'use client';

import { useCart } from 'components/cart/cart-context';
import { useCartModal } from 'components/cart/cart-modal-context';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FiMenu, FiShoppingCart, FiUser, FiX } from 'react-icons/fi';

interface HeaderProps {
  transparent?: boolean;
  latestCollection: {
    title: string;
    handle: string;
  };
}

export default function Header({ transparent = false, latestCollection }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();
  const { openCart } = useCartModal();
  const { cart } = useCart();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Solo aplicar el comportamiento de scroll en la página principal o cuando no es transparente
      if (pathname === '/' || !transparent) {
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          // Scrolling down - hide header
          setIsHeaderVisible(false);
        } else {
          // Scrolling up or at top - show header
          setIsHeaderVisible(true);
        }
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, pathname, transparent, isMounted]);

  // Debug: ver qué colección está llegando
  console.log('🔍 Header - latestCollection recibida:', latestCollection);
  
  const navigationItems = [
    { label: latestCollection.title, href: `/productos?coleccion=${latestCollection.handle}` },
    { label: 'Colección', href: '/coleccion' }
  ];

  const headerBase = transparent
    ? 'bg-transparent shadow-none fixed top-0 w-full z-50 px-4 py-4'
    : (pathname === '/' ? 'absolute top-0 left-0 right-0 z-50 px-4 py-4' : 'bg-transparent shadow-none fixed top-0 w-full z-50 px-4 py-4');

  return (
    <header 
      className={headerBase}
      style={{
        transform: isMounted && (pathname === '/' || !transparent)
          ? (isHeaderVisible ? 'translateY(0)' : 'translateY(-100%)')
          : undefined,
        transition: isMounted && (pathname === '/' || !transparent)
          ? 'transform 300ms ease-in-out'
          : undefined
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header principal con estilo frosted glass */}
        <div className="relative">
          <div className="absolute inset-0 backdrop-blur-md rounded-full" style={{ 
            backgroundColor: (pathname === '/coleccion' || pathname === '/productos') ? 'rgba(210, 213, 211, 0.7)' : 'rgba(255, 255, 255, 0.2)',
            borderColor: (pathname === '/coleccion' || pathname === '/productos') ? '#2E2E2C' : 'rgba(255, 255, 255, 0.3)', 
            borderWidth: '1px', 
            borderStyle: 'solid' 
          }}></div>
          <div className="relative flex items-center justify-between px-6 py-4">
            
             {/* Logo izquierdo */}
             <div className="flex items-center ml-2">
               <Link href="/" aria-label="Ir al inicio" className="inline-flex items-center">
                 <Image
                   src={(pathname === '/coleccion' || pathname === '/productos') ? '/logob.png' : '/logo.png'}
                   alt="Logo"
                   width={120}
                   height={30}
                   sizes="(max-width: 768px) 100px, 120px"
                   priority
                 />
               </Link>
             </div>

            {/* Navegación central */}
            <nav className="hidden md:flex items-center space-x-8">
              <a
                href="/productos?coleccion=all"
                className="transition-colors duration-200 font-light"
                style={{ color: (pathname === '/coleccion' || pathname === '/productos') ? '#2E2E2C' : 'white' }}
                onMouseEnter={(e) => e.target.style.opacity = '0.7'}
                onMouseLeave={(e) => e.target.style.opacity = '1'}
              >
                Shop Now
              </a>
              {navigationItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="transition-colors duration-200 font-light"
                  style={{ color: (pathname === '/coleccion' || pathname === '/productos') ? '#2E2E2C' : 'white' }}
                  onMouseEnter={(e) => e.target.style.opacity = '0.7'}
                  onMouseLeave={(e) => e.target.style.opacity = '1'}
                >
                  {item.label}
                </a>
              ))}
            </nav>

             {/* Sección derecha */}
             <div className="flex items-center space-x-3">
        <Link href="/welcome" className="p-2 rounded-full transition-all duration-200" style={{ color: (pathname === '/coleccion' || pathname === '/productos') ? '#2E2E2C' : 'white' }} onMouseEnter={(e) => e.target.style.opacity = '0.7'} onMouseLeave={(e) => e.target.style.opacity = '1'}>
          <FiUser className="h-5 w-5" />
        </Link>
               <button
                 onClick={openCart}
                 className="relative p-2 rounded-full transition-all duration-200 cursor-pointer" 
                 style={{ color: (pathname === '/coleccion' || pathname === '/productos') ? '#2E2E2C' : 'white' }} 
                 onMouseEnter={(e) => e.target.style.opacity = '0.7'} 
                 onMouseLeave={(e) => e.target.style.opacity = '1'}
               >
                 <FiShoppingCart className="h-5 w-5" />
                 {cart?.totalQuantity && cart.totalQuantity > 0 ? (
                   <span 
                     className="absolute -top-1 -right-1 bg-black text-white rounded-full h-5 w-5 flex items-center justify-center font-bold"
                     style={{ 
                       fontSize: '10px',
                       lineHeight: '1',
                       minWidth: '20px',
                       minHeight: '20px'
                     }}
                   >
                     {cart.totalQuantity}
                   </span>
                 ) : null}
               </button>

              {/* Botón de menú móvil */}
              <button
                className="md:hidden p-2 rounded-full transition-all duration-200"
                style={{ color: (pathname === '/coleccion' || pathname === '/productos') ? '#2E2E2C' : 'white' }}
                onMouseEnter={(e) => e.target.style.opacity = '0.7'}
                onMouseLeave={(e) => e.target.style.opacity = '1'}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Menú móvil */}
        {isMenuOpen && (
          <div className="mt-4 backdrop-blur-md rounded-2xl overflow-hidden" style={{ 
            backgroundColor: (pathname === '/coleccion' || pathname === '/productos') ? 'rgba(210, 213, 211, 0.3)' : 'rgba(255, 255, 255, 0.2)',
            borderColor: (pathname === '/coleccion' || pathname === '/productos') ? '#2E2E2C' : 'rgba(255, 255, 255, 0.3)', 
            borderWidth: '1px', 
            borderStyle: 'solid' 
          }}>
            <div className="px-6 py-4">
              {/* Navegación móvil */}
              <nav className="space-y-2">
            <a
              href="/productos?coleccion=all"
              className="block px-4 py-2 rounded-lg transition-colors duration-200 font-light"
              style={{ color: (pathname === '/coleccion' || pathname === '/productos') ? '#2E2E2C' : 'white' }}
              onMouseEnter={(e) => e.target.style.opacity = '0.7'}
              onMouseLeave={(e) => e.target.style.opacity = '1'}
              onClick={() => setIsMenuOpen(false)}
            >
              Shop Now
            </a>
            <button
              onClick={() => {
                openCart();
                setIsMenuOpen(false);
              }}
              className="relative block w-full text-left px-4 py-2 rounded-lg transition-colors duration-200 font-light cursor-pointer"
              style={{ color: (pathname === '/coleccion' || pathname === '/productos') ? '#2E2E2C' : 'white' }}
              onMouseEnter={(e) => e.target.style.opacity = '0.7'}
              onMouseLeave={(e) => e.target.style.opacity = '1'}
            >
              Carrito
              {cart?.totalQuantity && cart.totalQuantity > 0 ? (
                <span 
                  className="absolute top-1 right-2 bg-black text-white rounded-full h-4 w-4 flex items-center justify-center font-bold"
                  style={{ 
                    fontSize: '9px',
                    lineHeight: '1',
                    minWidth: '16px',
                    minHeight: '16px'
                  }}
                >
                  {cart.totalQuantity}
                </span>
              ) : null}
            </button>
                {navigationItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="block px-4 py-2 rounded-lg transition-colors duration-200 font-light"
                    style={{ color: (pathname === '/coleccion' || pathname === '/productos') ? '#2E2E2C' : 'white' }}
                    onMouseEnter={(e) => e.target.style.opacity = '0.7'}
                    onMouseLeave={(e) => e.target.style.opacity = '1'}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
