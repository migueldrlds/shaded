'use client';

import { ImageLoaderProps } from 'next/image';

export default function shopifyLoader({ src, width, quality }: ImageLoaderProps) {
    if (!src) return '';


    if (!src.includes('cdn.shopify.com')) {
        return src;
    }


    const url = new URL(src);
    url.searchParams.set('width', width.toString());

    if (quality) {
        url.searchParams.set('quality', quality.toString());
    } else {

        url.searchParams.set('quality', '75');
    }


    url.searchParams.set('format', 'auto');

    return url.toString();
}
