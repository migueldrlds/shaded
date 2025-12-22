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

    if (
      href.startsWith('http') ||
      href.startsWith('mailto:') ||
      href.startsWith('tel:') ||
      props.target === '_blank' ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.button !== 0
    ) {

      if (onClick) {
        onClick(e);
      }
      return;
    }


    e.preventDefault();


    if (onClick) {
      onClick(e);
    }


    if (isAnimating) return;

    setIsAnimating(true);


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

