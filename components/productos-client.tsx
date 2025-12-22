'use client';

import { useLenis } from 'lenis/react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useLayoutEffect } from 'react';

interface ProductosClientProps {
  children: React.ReactNode;
  products: Array<{
    featuredImage?: {
      url: string;
    };
    images?: Array<{
      url: string;
    }>;
  }>;
}

export default function ProductosClient({ children, products }: ProductosClientProps) {
  const searchParams = useSearchParams();
  const lenis = useLenis();


  useEffect(() => {
    if (typeof window === 'undefined' || !products || products.length === 0) return;

    const productImageUrls = new Set<string>();
    products.forEach(product => {
      if (product.featuredImage?.url) {
        productImageUrls.add(product.featuredImage.url);
      }
      if (product.images) {
        product.images.forEach(img => {
          if (img.url) {
            productImageUrls.add(img.url);
          }
        });
      }
    });

    const firstProductImageUrl = products[0]?.featuredImage?.url;

    setTimeout(() => {
      const allPreloads = document.querySelectorAll('link[rel="preload"][as="image"]');
      allPreloads.forEach((link) => {
        const href = link.getAttribute('href');
        if (href && productImageUrls.has(href) && href !== firstProductImageUrl) {
          link.remove();
        }
      });
    }, 100);
  }, [products]);


  const handleScrollReset = () => {
    if (typeof window !== 'undefined') {
      const originalRestoration = window.history.scrollRestoration;
      window.history.scrollRestoration = 'manual';

      const reset = () => {

        window.scrollTo(0, 0);
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;


        if (lenis) {
          lenis.scrollTo(0, { immediate: true, force: true });
        }
      };


      reset();
      setTimeout(reset, 10);
      setTimeout(reset, 50);
      setTimeout(reset, 150);

      const timer = setTimeout(() => {
        reset();
        window.history.scrollRestoration = originalRestoration;
      }, 300);

      return () => clearTimeout(timer);
    }
  };

  useLayoutEffect(() => {
    handleScrollReset();
  }, [searchParams, products, lenis]);

  return <>{children}</>;
}
