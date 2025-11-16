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
  // Limpiar preloads no utilizados (Next.js Image maneja el preload automáticamente)
  useEffect(() => {
    if (typeof window === 'undefined' || !products || products.length === 0) return;

    // Obtener todas las URLs de imágenes de productos
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
    
    // Solo mantener el preload de la primera imagen visible
    // Next.js Image con priority puede manejar el preload de la imagen principal
    const firstProductImageUrl = products[0]?.featuredImage?.url;

    // Limpiar preloads que corresponden a estos productos excepto la primera imagen
    // Usar setTimeout para ejecutar después de que Next.js haya procesado los preloads
    setTimeout(() => {
      const allPreloads = document.querySelectorAll('link[rel="preload"][as="image"]');
      allPreloads.forEach((link) => {
        const href = link.getAttribute('href');
        // Si es una imagen de estos productos y no es la primera, eliminarla
        if (href && productImageUrls.has(href) && href !== firstProductImageUrl) {
          link.remove();
        }
      });
    }, 100);
  }, [products]);

  return <>{children}</>;
}

