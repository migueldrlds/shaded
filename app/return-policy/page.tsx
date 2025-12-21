'use client';

import { useLanguage } from 'components/providers/language-provider';

import { useEffect } from 'react';

export default function ReturnPolicy() {
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
            {t('returnPolicy.title')}
          </h1>
          <p className="text-lg text-[#2E2E2C]/70">
            {t('returnPolicy.lastUpdated')} {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="prose prose-lg max-w-none text-[#2E2E2C]">
          <h2 className="text-3xl font-bold mb-6 tracking-tight">{t('returnPolicy.returnPolicy')}</h2>
          <p className="mb-10 text-lg leading-relaxed opacity-80">
            {t('returnPolicy.returnPolicyText')}
          </p>

          <h2 className="text-3xl font-bold mb-6 tracking-tight">{t('returnPolicy.eligibleItems')}</h2>
          <ul className="mb-10 space-y-3 ps-5 text-lg opacity-80 list-disc marker:text-[#2E2E2C]">
            <li>{t('returnPolicy.eligibleItem1')}</li>
            <li>{t('returnPolicy.eligibleItem2')}</li>
            <li>{t('returnPolicy.eligibleItem3')}</li>
          </ul>

          <h2 className="text-3xl font-bold mb-6 tracking-tight">{t('returnPolicy.nonReturnableItems')}</h2>
          <ul className="mb-10 space-y-3 ps-5 text-lg opacity-80 list-disc marker:text-[#2E2E2C]">
            <li>{t('returnPolicy.nonReturnableItem1')}</li>
            <li>{t('returnPolicy.nonReturnableItem2')}</li>
            <li>{t('returnPolicy.nonReturnableItem3')}</li>
            <li>{t('returnPolicy.nonReturnableItem4')}</li>
          </ul>

          <h2 className="text-3xl font-bold mb-6 tracking-tight">{t('returnPolicy.howToReturn')}</h2>
          <ol className="mb-10 space-y-3 ps-5 text-lg opacity-80 list-decimal marker:text-[#2E2E2C] marker:font-bold">
            <li className="pl-2">{t('returnPolicy.step1')}</li>
            <li className="pl-2">{t('returnPolicy.step2')}</li>
            <li className="pl-2">{t('returnPolicy.step3')}</li>
            <li className="pl-2">{t('returnPolicy.step4')}</li>
          </ol>

          <h2 className="text-3xl font-bold mb-6 tracking-tight">{t('returnPolicy.exchangePolicy')}</h2>
          <p className="mb-10 text-lg leading-relaxed opacity-80">
            {t('returnPolicy.exchangePolicyText')}
          </p>

          <h2 className="text-3xl font-bold mb-6 tracking-tight">{t('returnPolicy.refundProcess')}</h2>
          <p className="mb-10 text-lg leading-relaxed opacity-80">
            {t('returnPolicy.refundProcessText')}
          </p>

          <h2 className="text-3xl font-bold mb-6 tracking-tight">{t('returnPolicy.returnShipping')}</h2>
          <p className="mb-10 text-lg leading-relaxed opacity-80">
            {t('returnPolicy.returnShippingText')}
          </p>
        </div>
      </div>
    </div>
  );
}

