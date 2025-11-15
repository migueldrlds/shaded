'use client';

import { useLanguage } from 'components/providers/language-provider';
import FlowingMenu from './FlowingMenu';

interface ColeccionClientProps {
  menuItems: Array<{
    link: string;
    text: string;
    image: string;
  }>;
}

export default function ColeccionClient({ menuItems }: ColeccionClientProps) {
  const { t } = useLanguage();

  // Traducir el texto "COMING SOON" en los menuItems
  const translatedMenuItems = menuItems.map(item => ({
    ...item,
    text: item.text === 'COMING SOON' ? t('collections.comingSoon') : item.text
  }));

  return (
    <>
      {/* Fondo que cubre toda la pantalla */}
      <div className="fixed inset-0 w-full h-full -z-10" style={{ backgroundColor: '#d2d5d3' }}></div>
      
      {/* Contenido principal */}
      <div className="relative z-10 min-h-screen w-full">
        <div className="pt-40 px-4 pb-8">
          <div className="max-w-7xl mx-auto">
            {/* Título de la página */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold uppercase mb-4" style={{ color: '#2E2E2C' }}>
                {t('collections.title')}
              </h1>
              <p className="text-lg font-light" style={{ color: '#2E2E2C', opacity: 0.7 }}>
                {t('collections.description')}
              </p>
            </div>

            {/* FlowingMenu de colecciones */}
            <div className="max-w-7xl mx-auto">
              <FlowingMenu items={translatedMenuItems} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

