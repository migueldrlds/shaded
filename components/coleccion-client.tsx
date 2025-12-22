'use client';

import { useLanguage } from 'components/providers/language-provider';
import shopifyLoader from 'lib/image-loader';
import Image from 'next/image';
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


  const translatedMenuItems = menuItems.map(item => ({
    ...item,
    text: item.text === 'COMING SOON' ? t('collections.comingSoon') : item.text
  }));

  return (
    <>

      <div className="fixed inset-0 w-full h-full -z-10" style={{ backgroundColor: '#d2d5d3' }}></div>


      <div className="relative z-10 min-h-screen w-full">
        <div className="pt-32 px-4 pb-8">
          <div className="max-w-7xl mx-auto">

            <div className="mb-12 relative overflow-hidden rounded-[40px]" style={{ height: '400px' }}>
              <div className="absolute inset-0">
                <Image
                  src="https://cdn.shopify.com/s/files/1/0703/4562/1751/files/ext.png?v=1763597648"
                  alt="Collections"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1280px) 100vw, 1280px"
                  priority
                  loader={shopifyLoader}
                />

                <div className="absolute inset-0 bg-black/30"></div>
              </div>


              <div className="relative h-full flex flex-col justify-center items-start px-8 md:px-12 lg:px-16">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-medium mb-4 text-white" style={{ letterSpacing: '-0.02em' }}>
                  {t('collections.title')}
                </h1>
                <p className="text-lg md:text-xl lg:text-2xl font-light text-white" style={{ opacity: 0.9, letterSpacing: '-0.01em' }}>
                  {t('collections.description')}
                </p>
              </div>
            </div>


            <div className="max-w-7xl mx-auto">
              <FlowingMenu items={translatedMenuItems} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

