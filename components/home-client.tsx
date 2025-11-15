'use client';

import { useLanguage } from "components/providers/language-provider";
import SplitText from "components/SplitText";
import { gsap } from 'gsap';
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { FiArrowUpRight } from "react-icons/fi";

interface HomeClientProps {
  latestCollection: {
    title: string;
    handle: string;
  };
}

export default function HomeClient({ latestCollection }: HomeClientProps) {
  const { t } = useLanguage();
  const backgroundVideoRef = useRef<HTMLVideoElement>(null);
  const collectionVideoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mainCardRef = useRef<HTMLDivElement>(null);
  const secondCardRef = useRef<HTMLDivElement>(null);
  const discountCardRef = useRef<HTMLDivElement>(null);
  const movementCardRef = useRef<HTMLDivElement>(null);
  const viewCollectionButtonRef = useRef<HTMLAnchorElement>(null);
  const secondCardWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let syncInterval: NodeJS.Timeout;
    let isSyncing = false;

    const syncVideos = () => {
      if (backgroundVideoRef.current && collectionVideoRef.current && !isSyncing) {
        isSyncing = true;
        
        const bgTime = backgroundVideoRef.current.currentTime;
        const collectionTime = collectionVideoRef.current.currentTime;
        const timeDiff = Math.abs(bgTime - collectionTime);
        
        // Si hay diferencia de más de 0.05 segundos, sincronizar
        if (timeDiff > 0.05) {
          // Usar el video de fondo como referencia principal
          collectionVideoRef.current.currentTime = bgTime;
        }
        
        isSyncing = false;
      }
    };

    const initializeSync = () => {
      if (backgroundVideoRef.current && collectionVideoRef.current) {
        // Esperar un poco más para que los videos estén completamente cargados
        setTimeout(() => {
          // Sincronizar inmediatamente
          if (backgroundVideoRef.current && collectionVideoRef.current) {
            const bgTime = backgroundVideoRef.current.currentTime;
            collectionVideoRef.current.currentTime = bgTime;
            
            // Iniciar sincronización continua cada 50ms para mayor precisión
            syncInterval = setInterval(syncVideos, 50);
          }
        }, 500);
      }
    };

    // Inicializar cuando el componente se monte
    const timer = setTimeout(initializeSync, 100);

    return () => {
      clearTimeout(timer);
      if (syncInterval) {
        clearInterval(syncInterval);
      }
    };
  }, []);

  // Animación de cards
  useEffect(() => {
    // Esperar a que todos los refs estén listos
    if (!containerRef.current || !mainCardRef.current || !secondCardRef.current) {
      return;
    }

    let tl: gsap.core.Timeline | null = null;
    let containerNaturalHeight = 0;
    let mainCardNaturalHeight = 0;
    let secondCardNaturalHeight = 0;
    let secondCardPaddingTop = 0;
    let secondCardPaddingBottom = 0;
    let secondCardWrapperMarginTop = 0;
    
    // Calcular alturas naturales ANTES de establecerlas a 0
    const container = containerRef.current;
    const mainCard = mainCardRef.current;
    const secondCard = secondCardRef.current;
    
    // Obtener alturas naturales mientras los elementos están en su estado natural
    containerNaturalHeight = container.offsetHeight || container.scrollHeight;
    mainCardNaturalHeight = mainCard.offsetHeight || 448;
    secondCardNaturalHeight = secondCard.offsetHeight || 256;
    
    const secondCardStyle = window.getComputedStyle(secondCard);
    secondCardPaddingTop = parseFloat(secondCardStyle.paddingTop) || 0;
    secondCardPaddingBottom = parseFloat(secondCardStyle.paddingBottom) || 0;
    
    const secondCardWrapper = secondCardWrapperRef.current;
    if (secondCardWrapper) {
      const secondCardWrapperStyle = window.getComputedStyle(secondCardWrapper);
      secondCardWrapperMarginTop = parseFloat(secondCardWrapperStyle.marginTop) || 0;
      gsap.set(secondCardWrapper, { marginTop: 0 });
    }
    
    // Establecer alturas iniciales a 0
    gsap.set(container, {
      height: 0,
      overflow: 'hidden',
      transformOrigin: 'top center'
    });
    
    gsap.set(mainCard, {
      height: 0,
      overflow: 'hidden'
    });
    
    gsap.set(secondCard, {
      height: 0,
      paddingTop: 0,
      paddingBottom: 0,
      overflow: 'hidden'
    });
    
    // Esperar un momento para que el DOM se renderice completamente
    const timeoutId = setTimeout(() => {
      tl = gsap.timeline({ delay: 0.25 });

      // PASO 1: Contenedor principal se expande a la altura completa de ambos cards
      if (containerRef.current && tl && containerNaturalHeight > 0) {
        const container = containerRef.current;

        tl.to(container, {
          height: containerNaturalHeight,
          duration: 0.9,
          ease: 'power3.out'
        });
      }

      // PASO 2: Card "Introducing" se expande a su 100% de altura
      if (mainCardRef.current && mainCardNaturalHeight > 0) {
        const mainCard = mainCardRef.current;

        tl.to(mainCard, {
          height: mainCardNaturalHeight,
          duration: 0.9,
          ease: 'power3.out',
          onComplete: () => {
            gsap.set(mainCard, { 
              overflow: 'hidden'
            });
          }
        }, '-=.9'); // Empieza antes de que termine la expansión del contenedor
      }

      // PASO 3: Card "See all of our collections" se expande desde altura 0
      if (secondCardRef.current && secondCardNaturalHeight > 0) {
        const secondCard = secondCardRef.current;
        const secondCardWrapper = secondCardWrapperRef.current;

        if (secondCardWrapper) {
          tl.to(secondCardWrapper, {
            marginTop: secondCardWrapperMarginTop,
            duration: 0.9,
            ease: 'power3.out'
          }, '-=0.9');
        }

        tl.to(secondCard, {
          height: secondCardNaturalHeight,
          paddingTop: secondCardPaddingTop,
          paddingBottom: secondCardPaddingBottom,
          duration: 0.9,
          ease: 'power3.out',
          onComplete: () => {
            gsap.set(secondCard, { 
              overflow: 'hidden'
            });
            // Cuando el segundo card termina, el contenedor puede cambiar a altura auto
            if (containerRef.current) {
              gsap.set(containerRef.current, { 
                height: 'auto',
                overflow: 'visible'
              });
            }
          }
        }, secondCardWrapper ? '<' : '-=0');
      }


      // Animación del botón "View collection" (fade simple)
      if (viewCollectionButtonRef.current) {
        gsap.set(viewCollectionButtonRef.current, {
          opacity: 0
        });
        
        tl.to(viewCollectionButtonRef.current, {
          opacity: 1,
          duration: 0.6,
          ease: 'sine.out'
        }, '-=0.35'); // Empieza después de que el card principal se haya expandido un poco
      }


      // Animación del card de descuento (revelación)
      if (discountCardRef.current) {
        gsap.set(discountCardRef.current, {
          opacity: 0,
          y: 30
        });
        
        tl.to(discountCardRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out'
        }, '-=0.35');
      }

      // Animación del card de movimiento (revelación)
      if (movementCardRef.current) {
        gsap.set(movementCardRef.current, {
          opacity: 0,
          y: 30
        });
        
        tl.to(movementCardRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out'
        }, '-=0.35');
      }
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      if (tl) {
        tl.kill();
      }
    };
  }, []);

  return (
    <div className="relative min-h-screen">
      {/* Video de fondo */}
      <video
        ref={backgroundVideoRef}
        className="fixed inset-0 w-full h-full object-cover z-0"
        src="/videoloop2.mp4"
        autoPlay
        muted
        loop
        playsInline
      />
      
      {/* Cards principales */}
      <div className="relative z-10 flex items-start justify-center min-h-screen pt-25 px-4">
        <div 
          ref={containerRef}
          className="bg-black/30 backdrop-blur-md rounded-[60px] border border-white/10 p-2 lg:p-6 w-full max-w-5xl mb-4"
        >
          {/* Card de Colección - Ocupa toda la fila */}
          <div 
            ref={mainCardRef}
            className="bg-black/90 backdrop-blur-md rounded-[60px] lg:rounded-[40px] w-full flex flex-col h-[28rem] relative overflow-hidden"
          >
            {/* Video de fondo */}
            <video
              ref={collectionVideoRef}
              className="absolute inset-0 w-full h-full object-cover"
              src="/videoloop2.mp4"
              autoPlay
              muted
              loop
              playsInline
            />
            
            {/* Overlay negro sutil */}
            <div className="absolute inset-0 bg-black/30"></div>
            
            {/* Texto centrado verticalmente y alineado a la izquierda */}
            <div className="relative z-10 flex flex-col justify-center h-full px-8 space-y-4" style={{ overflow: 'visible', paddingTop: '0.5rem', paddingBottom: '0.5rem' }}>
              <div className="slide-title" style={{ overflow: 'visible', lineHeight: '1.2', paddingTop: '0.2rem', paddingBottom: '0.2rem' }}>
                <SplitText
                  text={latestCollection.title}
                  className="text-4xl font-light text-white"
                  delay={500}
                  duration={1}
                  ease="power4.out"
                  splitType="words"
                  threshold={0.1}
                  rootMargin="-100px"
                  textAlign="left"
                  onLetterAnimationComplete={() => {
                    console.log('All letters have animated!');
                  }}
                />
              </div>
              <Link 
                ref={viewCollectionButtonRef}
                href={`/productos?coleccion=${latestCollection.handle}`} 
                className="bg-white/20 backdrop-blur-sm border border-white/70 text-white px-6 py-3 rounded-full text-sm font-light hover:bg-white/30 transition-all duration-200 w-fit"
              >
                {t('home.viewCollection')}
              </Link>
            </div>
          </div>

          {/* Nueva fila: Card de texto que ocupa toda la fila */}
          <div ref={secondCardWrapperRef} className="mt-4">
            <div 
              ref={secondCardRef}
              className="bg-black/90 backdrop-blur-md rounded-[60px] lg:rounded-[40px] w-full flex flex-col h-[16rem] p-8 relative items-center justify-center"
            >
              <h1 className="text-3xl font-medium text-white text-center mb-2 max-w-xs">{t('home.seeAllCollections')}</h1>
              <Link href="/coleccion" className="mt-4 inline-flex items-center transition-all duration-200 hover:opacity-90" aria-label="Explore collections">
                <span className="rounded-full text-sm font-light px-8 py-2" style={{ backgroundColor: '#d2d5d3', color: '#2E2E2C' }}>{t('home.explore')}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Card de DESCUENTO para nuevos miembros */}
      <div className="relative z-10 px-4 pb-12">
        <div 
          ref={discountCardRef}
          className="bg-black/30 backdrop-blur-md rounded-[60px] border border-white/10 p-2 lg:p-6 w-full max-w-5xl mx-auto"
        >
          <div className="relative overflow-hidden rounded-[60px] lg:rounded-[40px] h-[20rem] md:h-[28rem]">
            <Image src="/img1.jpg" alt={t('home.getDiscount')} fill className="object-cover" />
            <div className="absolute inset-0 bg-black/40"></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
              <h3 className="text-3xl lg:text-5xl font-medium text-white mb-2">{t('home.getDiscount')}</h3>
              <p className="text-sm lg:text-base text-white/80 mb-4">{t('home.forAllNewMembers')}</p>
              <Link href="/coleccion" className="inline-flex items-center transition-all duration-200 hover:opacity-90" aria-label={t('home.signIn')}>
                <span className="rounded-full text-sm font-light px-8 py-2" style={{ backgroundColor: '#d2d5d3', color: '#2E2E2C' }}>{t('home.signIn')}</span>
                <span className="rounded-full w-10 h-10 flex items-center justify-center" style={{ backgroundColor: '#d2d5d3', color: '#2E2E2C' }}>
                  <FiArrowUpRight className="h-5 w-5" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Card de SHADED MOVEMENT */}
      <div className="relative z-10 px-4 pb-12">
        <div 
          ref={movementCardRef}
          className="bg-black/30 backdrop-blur-md rounded-[60px] border border-white/10 p-2 lg:p-6 w-full max-w-5xl mx-auto"
        >
          <div className="bg-black/90 backdrop-blur-md rounded-[60px] lg:rounded-[40px] p-8 lg:p-12">
            <div className="text-center">
              <h2 className="text-2xl lg:text-4xl font-medium text-white mb-6">
                {t('home.movementTitle')}
              </h2>
              <p className="text-sm lg:text-lg text-white/80 leading-relaxed max-w-4xl mx-auto">
                {t('home.movementDescription')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

