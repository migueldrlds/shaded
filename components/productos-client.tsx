'use client';

import { useEffect } from 'react';

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
  // Preload selectivo de imágenes de productos (solo las visibles inicialmente)
  useEffect(() => {
    if (typeof window === 'undefined' || !products || products.length === 0) return;

    // Determinar cuántos productos son visibles inicialmente
    const isDesktop = window.innerWidth >= 768;
    // En desktop generalmente se muestran todos, en móvil solo los primeros
    const visibleCount = isDesktop ? Math.min(products.length, 10) : Math.min(products.length, 3);

    // Determinar qué imágenes preloadear
    const imagesToPreload = new Set<string>();

    // Preloadear imágenes de productos visibles
    for (let i = 0; i < visibleCount; i++) {
      const product = products[i];
      if (!product) continue;

      // Preloadear featured image
      if (product.featuredImage?.url) {
        imagesToPreload.add(product.featuredImage.url);
      }

      // Preloadear segunda imagen si existe (para hover effect en desktop)
      if (isDesktop && product.images && product.images.length > 1) {
        const featuredImageUrl = product.featuredImage?.url;
        const secondImage = product.images.find(img => img.url !== featuredImageUrl);
        if (secondImage?.url) {
          imagesToPreload.add(secondImage.url);
        }
      }
    }

    // Limpiar preloads anteriores que no se necesitan
    const allPreloads = document.querySelectorAll('link[rel="preload"][as="image"]');
    allPreloads.forEach((link) => {
      const href = link.getAttribute('href');
      if (href && !imagesToPreload.has(href) && (href.includes('cdn.shopify.com') || href.includes('/img'))) {
        link.remove();
      }
    });

    // Crear preloads para las imágenes necesarias
    imagesToPreload.forEach((imageUrl) => {
      const existingLink = document.querySelector(`link[rel="preload"][as="image"][href="${imageUrl}"]`);
      if (!existingLink) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = imageUrl;
        document.head.appendChild(link);
      }
    });
  }, [products]);

  return <>{children}</>;
}

