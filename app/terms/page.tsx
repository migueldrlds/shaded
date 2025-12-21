'use client';

import { useLanguage } from 'components/providers/language-provider';

import { useEffect } from 'react';

export default function Terms() {
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
            {t('terms.title')}
          </h1>
          <p className="text-lg text-[#2E2E2C]/70">
            {t('terms.lastUpdated')} {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="prose prose-lg max-w-none text-[#2E2E2C]">
          <h2 className="text-3xl font-bold mb-6 tracking-tight">{t('terms.acceptanceOfTerms')}</h2>
          <p className="mb-10 text-lg leading-relaxed opacity-80">
            {t('terms.acceptanceOfTermsText')}
          </p>

          <h2 className="text-3xl font-bold mb-6 tracking-tight">{t('terms.useLicense')}</h2>
          <p className="mb-10 text-lg leading-relaxed opacity-80">
            {t('terms.useLicenseText')}
          </p>

          <h2 className="text-3xl font-bold mb-6 tracking-tight">{t('terms.disclaimer')}</h2>
          <p className="mb-10 text-lg leading-relaxed opacity-80">
            {t('terms.disclaimerText')}
          </p>

          <h2 className="text-3xl font-bold mb-6 tracking-tight">{t('terms.limitations')}</h2>
          <p className="mb-10 text-lg leading-relaxed opacity-80">
            {t('terms.limitationsText')}
          </p>

          <h2 className="text-3xl font-bold mb-6 tracking-tight">{t('terms.accuracyOfMaterials')}</h2>
          <p className="mb-10 text-lg leading-relaxed opacity-80">
            {t('terms.accuracyOfMaterialsText')}
          </p>

          <h2 className="text-3xl font-bold mb-6 tracking-tight">{t('terms.links')}</h2>
          <p className="mb-10 text-lg leading-relaxed opacity-80">
            {t('terms.linksText')}
          </p>

          <h2 className="text-3xl font-bold mb-6 tracking-tight">{t('terms.modifications')}</h2>
          <p className="mb-10 text-lg leading-relaxed opacity-80">
            {t('terms.modificationsText')}
          </p>

          <h2 className="text-3xl font-bold mb-6 tracking-tight">{t('terms.governingLaw')}</h2>
          <p className="mb-10 text-lg leading-relaxed opacity-80">
            {t('terms.governingLawText')}
          </p>
        </div>
      </div>
    </div>
  );
}

