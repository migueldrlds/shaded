'use client';

import { useLanguage } from 'components/providers/language-provider';

export default function ShippingPolicy() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: '#d2d5d3' }}>
      
      {/* Contenido principal */}
      <div className="relative z-10 pt-40 px-4 pb-8">
        <div className="max-w-4xl mx-auto">
          {/* Título de la página */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold uppercase mb-4" style={{ color: '#2E2E2C' }}>
              {t('shippingPolicy.title')}
            </h1>
            <p className="text-lg opacity-80" style={{ color: '#2E2E2C' }}>
              {t('shippingPolicy.lastUpdated')} {new Date().toLocaleDateString()}
            </p>
          </div>

          {/* Card con el contenido */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8">
            <div className="prose prose-lg max-w-none" style={{ color: '#2E2E2C' }}>
              <h2 className="text-2xl font-semibold mb-4">{t('shippingPolicy.shippingInfo')}</h2>
              <p className="mb-6">
                {t('shippingPolicy.shippingInfoText')}
              </p>

              <h2 className="text-2xl font-semibold mb-4">{t('shippingPolicy.shippingMethods')}</h2>
              <ul className="mb-6 space-y-2">
                <li>• {t('shippingPolicy.standardShipping')}</li>
                <li>• {t('shippingPolicy.expressShipping')}</li>
                <li>• {t('shippingPolicy.overnightShipping')}</li>
              </ul>

              <h2 className="text-2xl font-semibold mb-4">{t('shippingPolicy.shippingCosts')}</h2>
              <p className="mb-6">
                {t('shippingPolicy.shippingCostsText')}
              </p>

              <h2 className="text-2xl font-semibold mb-4">{t('shippingPolicy.internationalShipping')}</h2>
              <p className="mb-6">
                {t('shippingPolicy.internationalShippingText')}
              </p>

              <h2 className="text-2xl font-semibold mb-4">{t('shippingPolicy.orderTracking')}</h2>
              <p className="mb-6">
                {t('shippingPolicy.orderTrackingText')}
              </p>

              <h2 className="text-2xl font-semibold mb-4">{t('shippingPolicy.deliveryIssues')}</h2>
              <p className="mb-6">
                {t('shippingPolicy.deliveryIssuesText')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

