'use client';

import { useLanguage } from 'components/providers/language-provider';

export default function Terms() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: '#d2d5d3' }}>
      
      {/* Contenido principal */}
      <div className="relative z-10 pt-40 px-4 pb-8">
        <div className="max-w-4xl mx-auto">
          {/* Título de la página */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold uppercase mb-4" style={{ color: '#2E2E2C', fontFamily: 'Agressive' }}>
              {t('terms.title')}
            </h1>
            <p className="text-lg opacity-80" style={{ color: '#2E2E2C' }}>
              {t('terms.lastUpdated')} {new Date().toLocaleDateString()}
            </p>
          </div>

          {/* Card con el contenido */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8">
            <div className="prose prose-lg max-w-none" style={{ color: '#2E2E2C' }}>
              <h2 className="text-2xl font-semibold mb-4">{t('terms.acceptanceOfTerms')}</h2>
              <p className="mb-6">
                {t('terms.acceptanceOfTermsText')}
              </p>

              <h2 className="text-2xl font-semibold mb-4">{t('terms.useLicense')}</h2>
              <p className="mb-6">
                {t('terms.useLicenseText')}
              </p>

              <h2 className="text-2xl font-semibold mb-4">{t('terms.disclaimer')}</h2>
              <p className="mb-6">
                {t('terms.disclaimerText')}
              </p>

              <h2 className="text-2xl font-semibold mb-4">{t('terms.limitations')}</h2>
              <p className="mb-6">
                {t('terms.limitationsText')}
              </p>

              <h2 className="text-2xl font-semibold mb-4">{t('terms.accuracyOfMaterials')}</h2>
              <p className="mb-6">
                {t('terms.accuracyOfMaterialsText')}
              </p>

              <h2 className="text-2xl font-semibold mb-4">{t('terms.links')}</h2>
              <p className="mb-6">
                {t('terms.linksText')}
              </p>

              <h2 className="text-2xl font-semibold mb-4">{t('terms.modifications')}</h2>
              <p className="mb-6">
                {t('terms.modificationsText')}
              </p>

              <h2 className="text-2xl font-semibold mb-4">{t('terms.governingLaw')}</h2>
              <p className="mb-6">
                {t('terms.governingLawText')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

