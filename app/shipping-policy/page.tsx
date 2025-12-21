'use client';

import { useLanguage } from 'components/providers/language-provider';

import { useEffect } from 'react';

export default function ShippingPolicy() {
  const { t } = useLanguage();

  // Apply global gray background
  useEffect(() => {
    const originalBg = document.body.style.backgroundColor;
    document.body.style.backgroundColor = '#d2d5d3';
    return () => { document.body.style.backgroundColor = originalBg; };
  }, []);

  return (
    <div className="min-h-screen relative flex justify-center pt-32 pb-20">

      <div className="w-full max-w-4xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold uppercase tracking-tighter mb-4 text-[#2E2E2C]">
            {t('shippingPolicy.title')}
          </h1>
          <p className="text-lg text-[#2E2E2C]/70">
            {t('shippingPolicy.lastUpdated')} {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="prose prose-lg max-w-none text-[#2E2E2C]">
          <h2 className="text-3xl font-bold mb-6 tracking-tight">{t('shippingPolicy.shippingInfo')}</h2>
          <p className="mb-10 text-lg leading-relaxed opacity-80">
            {t('shippingPolicy.shippingInfoText')}
          </p>

          <h2 className="text-3xl font-bold mb-6 tracking-tight">{t('shippingPolicy.shippingMethods')}</h2>
          <ul className="mb-10 space-y-3 ps-5 text-lg opacity-80 list-disc marker:text-[#2E2E2C]">
            <li>{t('shippingPolicy.standardShipping')}</li>
            <li>{t('shippingPolicy.expressShipping')}</li>
            <li>{t('shippingPolicy.overnightShipping')}</li>
          </ul>

          <h2 className="text-3xl font-bold mb-6 tracking-tight">{t('shippingPolicy.shippingCosts')}</h2>
          <p className="mb-10 text-lg leading-relaxed opacity-80">
            {t('shippingPolicy.shippingCostsText')}
          </p>

          <h2 className="text-3xl font-bold mb-6 tracking-tight">{t('shippingPolicy.internationalShipping')}</h2>
          <p className="mb-10 text-lg leading-relaxed opacity-80">
            {t('shippingPolicy.internationalShippingText')}
          </p>

          <h2 className="text-3xl font-bold mb-6 tracking-tight">{t('shippingPolicy.orderTracking')}</h2>
          <p className="mb-10 text-lg leading-relaxed opacity-80">
            {t('shippingPolicy.orderTrackingText')}
          </p>

          <h2 className="text-3xl font-bold mb-6 tracking-tight">{t('shippingPolicy.deliveryIssues')}</h2>
          <p className="mb-10 text-lg leading-relaxed opacity-80">
            {t('shippingPolicy.deliveryIssuesText')}
          </p>
        </div>
      </div>
    </div>
  );
}

