'use client';

import { slideInOut } from 'lib/view-transitions';
import { useTransitionRouter } from 'next-view-transitions';
import { ComponentProps, forwardRef, MouseEvent, ReactNode, useState } from 'react';
import { useCartModal } from './cart/cart-modal-context';

type LinkProps = ComponentProps<'a'> & {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
};

/**
 * Componente Link personalizado que usa next-view-transitions
 * Reemplaza a next/link para habilitar transiciones automáticas
 */
const LinkWithTransition = forwardRef<HTMLAnchorElement, LinkProps>(function LinkWithTransition({
  href,
  children,
  onClick,
  className,
  ...props
}, ref) {
  const router = useTransitionRouter();
  const [isAnimating, setIsAnimating] = useState(false);
  const { isOpen: isCartOpen } = useCartModal();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // Si el link es externo o tiene target="_blank", usar comportamiento normal
    if (
      href.startsWith('http') ||
      href.startsWith('mailto:') ||
      href.startsWith('tel:') ||
      props.target === '_blank' ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.button !== 0 // No es click izquierdo
    ) {
      // Si hay un onClick personalizado, ejecutarlo
      if (onClick) {
        onClick(e);
      }
      return; // Dejar que el navegador maneje el link normalmente
    }

    // Prevenir el comportamiento por defecto
    e.preventDefault();

    // Si hay un onClick personalizado, ejecutarlo después de prevenir default
    if (onClick) {
      onClick(e);
    }

    // Si ya está animando, no hacer nada
    if (isAnimating) return;

    setIsAnimating(true);

    // Si el carrito está abierto, esperar un poco antes de navegar
    const delay = isCartOpen ? 500 : 0;

    if (delay > 0) {
      setTimeout(() => {
        router.push(href, {
          onTransitionReady: slideInOut,
        });
        setTimeout(() => setIsAnimating(false), 1500);
      }, delay);
    } else {
      router.push(href, {
        onTransitionReady: slideInOut,
      });
      setTimeout(() => setIsAnimating(false), 1500);
    }
  };

  return (
    <a
      ref={ref}
      href={href}
      onClick={handleClick}
      className={className}
      {...props}
    >
      {children}
    </a>
  );
});

export default LinkWithTransition;

