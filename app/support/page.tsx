'use client';

import LinkWithTransition from 'components/link-with-transition';
import { useLanguage } from 'components/providers/language-provider';

export default function Support() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: '#d2d5d3' }}>

      {/* Contenido principal */}
      <div className="relative z-10 pt-40 px-4 pb-8">
        <div className="max-w-4xl mx-auto">
          {/* Título de la página */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold uppercase mb-4" style={{ color: '#2E2E2C' }}>
              {t('support.title')}
            </h1>
            <p className="text-lg opacity-80" style={{ color: '#2E2E2C' }}>
              {t('support.subtitle')}
            </p>
          </div>

          {/* Card con el contenido */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Información de contacto */}
              <div>
                <h2 className="text-2xl font-semibold mb-4" style={{ color: '#2E2E2C' }}>{t('support.contactInfo')}</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2" style={{ color: '#2E2E2C' }}>{t('support.emailSupport')}</h3>
                    <a href="mailto:support@shaded.com" className="text-sm opacity-80 hover:opacity-100 underline decoration-1 underline-offset-4" style={{ color: '#2E2E2C' }}>
                      support@shaded.com
                    </a>
                    <p className="text-xs opacity-60" style={{ color: '#2E2E2C' }}>{t('support.emailResponse')}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2" style={{ color: '#2E2E2C' }}>{t('support.phoneSupport')}</h3>
                    <p className="text-sm opacity-80" style={{ color: '#2E2E2C' }}>+1 (555) 123-4567</p>
                    <p className="text-xs opacity-60" style={{ color: '#2E2E2C' }}>{t('support.phoneHours')}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2" style={{ color: '#2E2E2C' }}>{t('support.liveChat')}</h3>
                    <p className="text-sm opacity-80" style={{ color: '#2E2E2C' }}>{t('support.liveChatText')}</p>
                    <p className="text-xs opacity-60" style={{ color: '#2E2E2C' }}>{t('support.phoneHours')}</p>
                  </div>
                </div>
              </div>

              {/* Preguntas frecuentes */}
              <div>
                <h2 className="text-2xl font-semibold mb-4" style={{ color: '#2E2E2C' }}>{t('support.faq')}</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2" style={{ color: '#2E2E2C' }}>{t('support.faqTrackOrder')}</h3>
                    <p className="text-sm opacity-80" style={{ color: '#2E2E2C' }}>{t('support.faqTrackOrderAnswer')}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2" style={{ color: '#2E2E2C' }}>{t('support.faqReturnPolicy')}</h3>
                    <p className="text-sm opacity-80" style={{ color: '#2E2E2C' }}>{t('support.faqReturnPolicyAnswer')}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2" style={{ color: '#2E2E2C' }}>{t('support.faqInternationalShipping')}</h3>
                    <p className="text-sm opacity-80" style={{ color: '#2E2E2C' }}>{t('support.faqInternationalShippingAnswer')}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2" style={{ color: '#2E2E2C' }}>{t('support.faqChangeOrder')}</h3>
                    <p className="text-sm opacity-80" style={{ color: '#2E2E2C' }}>{t('support.faqChangeOrderAnswer')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Botón de contacto */}
            <div className="mt-8 text-center">
              <LinkWithTransition
                href="/contact"
                className="inline-block bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors duration-200"
              >
                {t('support.contactUs')}
              </LinkWithTransition>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

