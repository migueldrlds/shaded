'use client';

import LanguageSelector from 'components/language-selector';
import LinkWithTransition from 'components/link-with-transition';
import { useLanguage } from 'components/providers/language-provider';
import Image from 'next/image';
import { FaFacebook, FaInstagram, FaTiktok } from 'react-icons/fa';

interface FooterNewProps {
  isDarkMode?: boolean;
}

export default function FooterNew({ isDarkMode = false }: FooterNewProps) {
  const { t } = useLanguage();

  // Colores según el modo
  const textColor = isDarkMode ? 'text-black' : 'text-white';
  const textColorMuted = isDarkMode ? 'text-black/70' : 'text-white/70';
  const textColorHover = isDarkMode ? 'hover:text-black' : 'hover:text-white';
  const textColorMoreMuted = isDarkMode ? 'text-black/60' : 'text-white/60';
  const borderColor = isDarkMode ? 'border-black' : 'border-white/20';
  const iconColor = isDarkMode ? 'text-black/70 hover:text-black' : 'text-white/70 hover:text-white';

  return (
    <footer className="mt-8 mb-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="relative">
          <div className="absolute inset-0 backdrop-blur-md rounded-2xl" style={{
            backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.2)',
            borderColor: isDarkMode ? '#000000' : 'rgba(255, 255, 255, 0.3)',
            borderWidth: '1px',
            borderStyle: 'solid'
          }}></div>
          <div className="relative py-12 px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

              {/* Logo y marca */}
              <div className="lg:col-span-1">
                <div className="flex items-center mb-6">
                  <Image
                    src={isDarkMode ? "/logob.png" : "/logo.png"}
                    alt="Logo"
                    width={120}
                    height={30}
                    sizes="(max-width: 768px) 100px, 120px"
                    priority
                  />
                </div>
                <p className={`${textColorMuted} text-sm leading-relaxed`}>
                  {t('footer.description')}
                </p>
              </div>

              {/* Políticas y soporte */}
              <div>
                <h3 className={`${textColor} font-semibold mb-4`}>{t('footer.customerService')}</h3>
                <ul className="space-y-3">
                  <li>
                    <LinkWithTransition href="/return-policy" className={`${textColorMuted} ${textColorHover} transition-colors text-sm`}>
                      {t('footer.returnPolicy')}
                    </LinkWithTransition>
                  </li>
                  <li>
                    <LinkWithTransition href="/shipping-policy" className={`${textColorMuted} ${textColorHover} transition-colors text-sm`}>
                      {t('footer.shippingPolicy')}
                    </LinkWithTransition>
                  </li>
                  <li>
                    <LinkWithTransition href="/terms" className={`${textColorMuted} ${textColorHover} transition-colors text-sm`}>
                      {t('footer.terms')}
                    </LinkWithTransition>
                  </li>
                  <li>
                    <LinkWithTransition href="/support" className={`${textColorMuted} ${textColorHover} transition-colors text-sm`}>
                      {t('footer.customerSupport')}
                    </LinkWithTransition>
                  </li>
                  <li>
                    <LinkWithTransition href="/contact" className={`${textColorMuted} ${textColorHover} transition-colors text-sm`}>
                      {t('footer.contactForm')}
                    </LinkWithTransition>
                  </li>
                </ul>
              </div>

              {/* Colecciones */}
              <div>
                <h3 className={`${textColor} font-semibold mb-4`}>{t('footer.collections')}</h3>
                <ul className="space-y-3">
                  <li>
                    <LinkWithTransition href="/products?collection=serene" className={`${textColorMuted} ${textColorHover} transition-colors text-sm`}>
                      INTRODUCING SERENE
                    </LinkWithTransition>
                  </li>
                  <li>
                    <LinkWithTransition href="/collection" className={`${textColorMuted} ${textColorHover} transition-colors text-sm`}>
                      {t('footer.allCollections')}
                    </LinkWithTransition>
                  </li>
                </ul>
              </div>

              {/* Redes sociales */}
              <div>
                <h3 className={`${textColor} font-semibold mb-4`}>{t('footer.connectWithUs')}</h3>
                <div className="flex space-x-4">
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${iconColor} transition-colors`}
                    aria-label="Facebook"
                  >
                    <FaFacebook className="w-6 h-6" />
                  </a>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${iconColor} transition-colors`}
                    aria-label="Instagram"
                  >
                    <FaInstagram className="w-6 h-6" />
                  </a>
                  <a
                    href="https://www.tiktok.com/@shadedthebrand?_t=ZT-8uPMMryWeGB&_r=1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${iconColor} transition-colors`}
                    aria-label="TikTok"
                  >
                    <FaTiktok className="w-6 h-6" />
                  </a>
                </div>
              </div>
            </div>

            {/* Línea divisoria y copyright */}
            <div className={`border-t ${borderColor} mt-8 pt-8`}>
              <div className="flex flex-col md:flex-row justify-between items-center">
                <p className={`${textColorMoreMuted} text-sm`}>
                  {t('footer.copyright', { year: new Date().getFullYear() })}
                </p>
                <div className="flex flex-col md:flex-row items-center gap-6 mt-4 md:mt-0">
                  <LanguageSelector isDarkMode={isDarkMode} />
                  <div className="flex space-x-6">
                    <LinkWithTransition href="/privacy" className={`${textColorMoreMuted} ${textColorHover} transition-colors text-sm`}>
                      {t('footer.privacyPolicy')}
                    </LinkWithTransition>
                    <LinkWithTransition href="/cookies" className={`${textColorMoreMuted} ${textColorHover} transition-colors text-sm`}>
                      {t('footer.cookiePolicy')}
                    </LinkWithTransition>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
