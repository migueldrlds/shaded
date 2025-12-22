'use client';

import { useCart } from 'components/cart/cart-context';
import { useCartModal } from 'components/cart/cart-modal-context';
import LinkWithTransition from 'components/link-with-transition';
import { useLanguage } from 'components/providers/language-provider';
import UserMenu from 'components/user-menu';
import { gsap } from 'gsap';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { FiMenu, FiShoppingCart, FiX } from 'react-icons/fi';

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
  const menuRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();
  const { openCart } = useCartModal();
  const { cart } = useCart();
  const { t } = useLanguage();

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

  useEffect(() => {
    if (!isMenuOpen || !menuRef.current) return;
    const menuElement = menuRef.current;
    const items = menuElement.querySelectorAll('nav a, nav button');
    gsap.set(menuElement, { opacity: 0, y: -16, height: 0 });
    gsap.to(menuElement, { opacity: 1, y: 0, height: 'auto', duration: 0.35, ease: 'power3.out' });
    if (items.length) {
      gsap.from(items, { opacity: 0, y: -8, duration: 0.3, stagger: 0.05, ease: 'power2.out', delay: 0.05 });
    }
  }, [isMenuOpen]);

  const closeMenuWithAnimation = () => {
    if (menuRef.current) {
      gsap.to(menuRef.current, {
        opacity: 0,
        y: -12,
        height: 0,
        duration: 0.2,
        ease: 'power2.out',
        onComplete: () => setIsMenuOpen(false)
      });
    } else {
      setIsMenuOpen(false);
    }
  };

  // Detectar si estamos en móvil
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Determinar si debe usar estilo negro (fondo claro)
  // En móvil, siempre usar modo oscuro en páginas de producto
  const isDarkHeader = pathname === '/collections' || pathname === '/products' || pathname.startsWith('/productos-alt') || (isMobile && pathname.startsWith('/product/'));

  const navigationItems = [
    { label: latestCollection.title, href: `/products?collection=${latestCollection.handle}` },
    { label: t('header.collection'), href: '/collections' }
  ];

  const headerBase = transparent
    ? 'bg-transparent shadow-none fixed top-0 w-full z-50 px-4 py-4'
    : 'bg-transparent shadow-none fixed top-0 w-full z-50 px-4 py-4';

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
            backgroundColor: isDarkHeader ? 'rgba(210, 213, 211, 0.7)' : 'rgba(255, 255, 255, 0.2)',
            borderColor: isDarkHeader ? '#2E2E2C' : 'rgba(255, 255, 255, 0.3)',
            borderWidth: '1px',
            borderStyle: 'solid'
          }}></div>
          <div className="relative flex items-center justify-between px-6 py-4">

            {/* Logo izquierdo */}
            <div className="flex items-center ml-2">
              {pathname === '/' ? (
                <div className="inline-flex items-center cursor-default">
                  <Image
                    src={isDarkHeader ? '/logob.png' : '/logo.png'}
                    alt="Logo"
                    width={120}
                    height={30}
                    sizes="(max-width: 768px) 100px, 120px"
                    priority
                  />
                </div>
              ) : (
                <LinkWithTransition href="/" aria-label="Ir al inicio" className="inline-flex items-center">
                  <Image
                    src={isDarkHeader ? '/logob.png' : '/logo.png'}
                    alt="Logo"
                    width={120}
                    height={30}
                    sizes="(max-width: 768px) 100px, 120px"
                    priority
                  />
                </LinkWithTransition>
              )}
            </div>

            {/* Navegación central */}
            <nav className="hidden md:flex items-center space-x-8">
              <LinkWithTransition
                href="/products?collection=all"
                className="transition-colors duration-200 font-light"
                style={{ color: isDarkHeader ? '#2E2E2C' : 'white' }}
                onMouseEnter={(e) => (e.target as HTMLElement).style.opacity = '0.7'}
                onMouseLeave={(e) => (e.target as HTMLElement).style.opacity = '1'}
              >
                {t('header.shopNow')}
              </LinkWithTransition>
              {navigationItems.map((item) => {
                const isActive = pathname === item.href || (item.href === '/collections' && pathname.startsWith('/collections'));
                return isActive ? (
                  <span
                    key={item.label}
                    className="transition-colors duration-200 font-light cursor-default"
                    style={{ color: isDarkHeader ? '#2E2E2C' : 'white', opacity: 0.7 }}
                  >
                    {item.label}
                  </span>
                ) : (
                  <LinkWithTransition
                    key={item.label}
                    href={item.href}
                    className="transition-colors duration-200 font-light"
                    style={{ color: isDarkHeader ? '#2E2E2C' : 'white' }}
                    onMouseEnter={(e) => (e.target as HTMLElement).style.opacity = '0.7'}
                    onMouseLeave={(e) => (e.target as HTMLElement).style.opacity = '1'}
                  >
                    {item.label}
                  </LinkWithTransition>
                );
              })}
            </nav>

            {/* Sección derecha */}
            <div className="flex items-center space-x-3">
              <UserMenu iconColor={isDarkHeader ? '#2E2E2C' : 'white'} />
              <button
                onClick={openCart}
                className="relative p-2 rounded-full transition-all duration-200 cursor-pointer"
                style={{ color: isDarkHeader ? '#2E2E2C' : 'white' }}
                onMouseEnter={(e) => (e.target as HTMLElement).style.opacity = '0.7'}
                onMouseLeave={(e) => (e.target as HTMLElement).style.opacity = '1'}
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
                style={{ color: isDarkHeader ? '#2E2E2C' : 'white' }}
                onMouseEnter={(e) => (e.target as HTMLElement).style.opacity = '0.7'}
                onMouseLeave={(e) => (e.target as HTMLElement).style.opacity = '1'}
                onClick={() => {
                  if (isMenuOpen) {
                    closeMenuWithAnimation();
                  } else {
                    setIsMenuOpen(true);
                  }
                }}
              >
                {isMenuOpen ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Menú móvil */}
        {isMenuOpen && (
          <div ref={menuRef} className="mt-4 backdrop-blur-md rounded-2xl overflow-hidden" style={{
            backgroundColor: isDarkHeader ? 'rgba(210, 213, 211, 0.3)' : 'rgba(255, 255, 255, 0.2)',
            borderColor: isDarkHeader ? '#2E2E2C' : 'rgba(255, 255, 255, 0.3)',
            borderWidth: '1px',
            borderStyle: 'solid'
          }}>
            <div className="px-6 py-4">
              {/* Navegación móvil */}
              <nav className="space-y-2">
                <LinkWithTransition
                  href="/products?collection=all"
                  className="block px-4 py-2 rounded-lg transition-colors duration-200 font-light"
                  style={{ color: isDarkHeader ? '#2E2E2C' : 'white' }}
                  onMouseEnter={(e) => (e.target as HTMLElement).style.opacity = '0.7'}
                  onMouseLeave={(e) => (e.target as HTMLElement).style.opacity = '1'}
                  onClick={closeMenuWithAnimation}
                >
                  {t('header.shopNow')}
                </LinkWithTransition>
                <button
                  onClick={() => {
                    openCart();
                    closeMenuWithAnimation();
                  }}
                  className="relative block w-full text-left px-4 py-2 rounded-lg transition-colors duration-200 font-light cursor-pointer"
                  style={{ color: isDarkHeader ? '#2E2E2C' : 'white' }}
                  onMouseEnter={(e) => (e.target as HTMLElement).style.opacity = '0.7'}
                  onMouseLeave={(e) => (e.target as HTMLElement).style.opacity = '1'}
                >
                  {t('header.cart')}
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
                {navigationItems.map((item) => {
                  const isActive = pathname === item.href || (item.href === '/collections' && pathname.startsWith('/collections'));
                  return isActive ? (
                    <span
                      key={item.label}
                      className="block px-4 py-2 rounded-lg transition-colors duration-200 font-light cursor-default"
                      style={{ color: isDarkHeader ? '#2E2E2C' : 'white', opacity: 0.7 }}
                    >
                      {item.label}
                    </span>
                  ) : (
                    <LinkWithTransition
                      key={item.label}
                      href={item.href}
                      className="block px-4 py-2 rounded-lg transition-colors duration-200 font-light"
                      style={{ color: isDarkHeader ? '#2E2E2C' : 'white' }}
                      onMouseEnter={(e) => (e.target as HTMLElement).style.opacity = '0.7'}
                      onMouseLeave={(e) => (e.target as HTMLElement).style.opacity = '1'}
                      onClick={closeMenuWithAnimation}
                    >
                      {item.label}
                    </LinkWithTransition>
                  );
                })}
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
