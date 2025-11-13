'use client';

import { useLanguage } from 'components/providers/language-provider';

export default function ReturnPolicy() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: '#d2d5d3' }}>
      
      {/* Contenido principal */}
      <div className="relative z-10 pt-40 px-4 pb-8">
        <div className="max-w-4xl mx-auto">
          {/* Título de la página */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold uppercase mb-4" style={{ color: '#2E2E2C', fontFamily: 'Agressive' }}>
              {t('returnPolicy.title')}
            </h1>
            <p className="text-lg opacity-80" style={{ color: '#2E2E2C' }}>
              {t('returnPolicy.lastUpdated')} {new Date().toLocaleDateString()}
            </p>
          </div>

          {/* Card con el contenido */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8">
            <div className="prose prose-lg max-w-none" style={{ color: '#2E2E2C' }}>
              <h2 className="text-2xl font-semibold mb-4">{t('returnPolicy.returnPolicy')}</h2>
              <p className="mb-6">
                {t('returnPolicy.returnPolicyText')}
              </p>

              <h2 className="text-2xl font-semibold mb-4">{t('returnPolicy.eligibleItems')}</h2>
              <ul className="mb-6 space-y-2">
                <li>• {t('returnPolicy.eligibleItem1')}</li>
                <li>• {t('returnPolicy.eligibleItem2')}</li>
                <li>• {t('returnPolicy.eligibleItem3')}</li>
              </ul>

              <h2 className="text-2xl font-semibold mb-4">{t('returnPolicy.nonReturnableItems')}</h2>
              <ul className="mb-6 space-y-2">
                <li>• {t('returnPolicy.nonReturnableItem1')}</li>
                <li>• {t('returnPolicy.nonReturnableItem2')}</li>
                <li>• {t('returnPolicy.nonReturnableItem3')}</li>
                <li>• {t('returnPolicy.nonReturnableItem4')}</li>
              </ul>

              <h2 className="text-2xl font-semibold mb-4">{t('returnPolicy.howToReturn')}</h2>
              <ol className="mb-6 space-y-2">
                <li>1. {t('returnPolicy.step1')}</li>
                <li>2. {t('returnPolicy.step2')}</li>
                <li>3. {t('returnPolicy.step3')}</li>
                <li>4. {t('returnPolicy.step4')}</li>
              </ol>

              <h2 className="text-2xl font-semibold mb-4">{t('returnPolicy.exchangePolicy')}</h2>
              <p className="mb-6">
                {t('returnPolicy.exchangePolicyText')}
              </p>

              <h2 className="text-2xl font-semibold mb-4">{t('returnPolicy.refundProcess')}</h2>
              <p className="mb-6">
                {t('returnPolicy.refundProcessText')}
              </p>

              <h2 className="text-2xl font-semibold mb-4">{t('returnPolicy.returnShipping')}</h2>
              <p className="mb-6">
                {t('returnPolicy.returnShippingText')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

