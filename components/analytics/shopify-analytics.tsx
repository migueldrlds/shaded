'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function ShopifyAnalytics() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        // Track page views on route change
        // If window.Shopify tracking is implemented (e.g. via liquid or script tag), 
        // we would trigger it here.
        // For now, this component preserves the architecture for analytics injection.


    }, [pathname, searchParams]);

    return null;
}
