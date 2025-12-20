'use client';

import { ImageLoaderProps } from 'next/image';

export default function shopifyLoader({ src, width, quality }: ImageLoaderProps) {
    if (!src) return '';

    // Si no es una imagen de Shopify, devolver la original
    if (!src.includes('cdn.shopify.com')) {
        return src;
    }

    // Eliminar parámetros existentes de width/height si los hay para evitar duplicados limpios
    const url = new URL(src);
    url.searchParams.set('width', width.toString());

    if (quality) {
        url.searchParams.set('quality', quality.toString());
    } else {
        // Default sensible para web
        url.searchParams.set('quality', '75');
    }

    // Formato moderno
    url.searchParams.set('format', 'auto');

    return url.toString();
}
