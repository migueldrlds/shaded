'use client';

import LinkWithTransition from "components/link-with-transition";
import { useLanguage } from "components/providers/language-provider";
import SplitText from "components/SplitText";
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from "next/image";
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
  
  // Registrar ScrollTrigger
  useEffect(() => {
    if (typeof window !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }
  }, []);

  const backgroundVideoRef = useRef<HTMLVideoElement>(null);
  const collectionVideoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mainCardRef = useRef<HTMLDivElement>(null);
  const secondCardRef = useRef<HTMLDivElement>(null);
  const discountCardRef = useRef<HTMLDivElement>(null);
  const movementCardRef = useRef<HTMLDivElement>(null);
  const viewCollectionButtonRef = useRef<HTMLAnchorElement>(null);
  const secondCardWrapperRef = useRef<HTMLDivElement>(null);
  const exploreButtonRef = useRef<HTMLDivElement>(null);
  const signInButtonRef = useRef<HTMLDivElement>(null);
  const seeAllCollectionsTitleRef = useRef<HTMLDivElement>(null);
  const getDiscountTitleRef = useRef<HTMLDivElement>(null);
  const signInTextRef = useRef<HTMLDivElement>(null);
  const exploreTextRef = useRef<HTMLDivElement>(null);
  const movementTitleRef1 = useRef<HTMLDivElement>(null);
  const movementTitleRef2 = useRef<HTMLDivElement>(null);

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

  // Animaciones con ScrollTrigger
  useEffect(() => {
    if (typeof window === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    // Animación del título "See all of our collections"
    if (seeAllCollectionsTitleRef.current) {
      gsap.fromTo(seeAllCollectionsTitleRef.current,
        {
          opacity: 0,
          y: 30
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: seeAllCollectionsTitleRef.current,
            start: 'top 100%',
            toggleActions: 'play none none none',
            once: true
          }
        }
      );
    }

    // Animación del texto "Explore"
    if (exploreTextRef.current) {
      gsap.fromTo(exploreTextRef.current,
        {
          opacity: 0,
          y: 15
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: exploreTextRef.current,
            start: 'top 100%',
            toggleActions: 'play none none none',
            once: true
          }
        }
      );
    }

    // Animación del botón Explore completo
    if (exploreButtonRef.current) {
      gsap.fromTo(exploreButtonRef.current,
        {
          opacity: 0,
          scale: 0.9
        },
        {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: exploreButtonRef.current,
            start: 'top 100%',
            toggleActions: 'play none none none',
            once: true
          }
        }
      );
    }

    // Animación del título "Get a Discount"
    if (getDiscountTitleRef.current) {
      gsap.fromTo(getDiscountTitleRef.current,
        {
          opacity: 0,
          y: 30
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: getDiscountTitleRef.current,
            start: 'top 40%',
            toggleActions: 'play none none none',
            once: true
          }
        }
      );
    }

    // Animación del texto "Sign In"
    if (signInTextRef.current) {
      gsap.fromTo(signInTextRef.current,
        {
          opacity: 0,
          y: 15
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: signInTextRef.current,
            start: 'top 60%',
            toggleActions: 'play none none none',
            once: true
          }
        }
      );
    }

    // Animación del botón Sign In completo
    if (signInButtonRef.current) {
      gsap.fromTo(signInButtonRef.current,
        {
          opacity: 0,
          scale: 0.9
        },
        {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: signInButtonRef.current,
            start: 'top 40%',
            toggleActions: 'play none none none',
            once: true
          }
        }
      );
    }

    // Animación del título "SHADED is more than..."
    if (movementTitleRef1.current) {
      gsap.fromTo(movementTitleRef1.current,
        {
          opacity: 0,
          y: 30
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: movementTitleRef1.current,
            start: 'top 40%',
            toggleActions: 'play none none none',
            once: true
          }
        }
      );
    }

    // Animación del título "IT'S A MOVEMENT"
    if (movementTitleRef2.current) {
      gsap.fromTo(movementTitleRef2.current,
        {
          opacity: 0,
          y: 30
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: movementTitleRef2.current,
            start: 'top 60%',
            toggleActions: 'play none none none',
            once: true
          }
        }
      );
    }

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
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
      <div className="relative z-10 flex items-start justify-center min-h-screen pt-25 px-4 pb-0 md:pb-auto">
        <div 
          ref={containerRef}
          className="bg-black/30 backdrop-blur-md rounded-[60px] border border-white/10 p-2 lg:p-6 w-full max-w-5xl"
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
                  }}
                />
              </div>
              <LinkWithTransition 
                ref={viewCollectionButtonRef}
                href={`/productos?coleccion=${latestCollection.handle}`} 
                className="bg-white/20 backdrop-blur-sm border border-white/70 text-white px-6 py-3 rounded-full text-sm font-light hover:bg-white/30 transition-all duration-200 w-fit"
              >
                {t('home.viewCollection')}
              </LinkWithTransition>
            </div>
          </div>

          {/* Nueva fila: Card de texto que ocupa toda la fila */}
          <div ref={secondCardWrapperRef} className="mt-4">
            <LinkWithTransition href="/coleccion" className="block group" aria-label="Explore collections">
              <div 
                ref={secondCardRef}
                className="bg-black/90 backdrop-blur-md rounded-[60px] lg:rounded-[40px] w-full flex flex-col h-[256px] p-12 md:p-16 relative items-center justify-center cursor-pointer border border-white/5 group-hover:border-white/10 transition-all duration-0"
              >
                <div ref={seeAllCollectionsTitleRef} className="text-3xl md:text-4xl lg:text-5xl font-light text-white text-center mb-8 md:mb-10 max-w-3xl leading-tight" style={{ letterSpacing: '-0.03em' }}>
                  {t('home.seeAllCollections')}
                </div>
                <div ref={exploreButtonRef} className="inline-flex items-center gap-3 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                  <span ref={exploreTextRef} className="text-sm md:text-base font-extralight text-white uppercase tracking-widest" style={{ letterSpacing: '0.15em' }}>
                    {t('home.explore')}
                  </span>
                  <div className="w-px h-4 bg-white/50"></div>
                  <div className="rounded-full w-10 h-10 flex items-center justify-center border border-white/30 group-hover:border-white/60 group-hover:bg-white/10 transition-all duration-300">
                    <FiArrowUpRight className="w-4 h-4 md:w-5 md:h-5 text-white" />
                  </div>
                </div>
              </div>
            </LinkWithTransition>
          </div>
        </div>
      </div>

      {/* Card de DESCUENTO para nuevos miembros */}
      <div className="relative z-10 px-4 mb-8 md:mb-10 mt-8 md:mt-10">
        <div 
          ref={discountCardRef}
          className="bg-black/30 backdrop-blur-md rounded-[60px] border border-white/10 p-2 lg:p-6 w-full max-w-5xl mx-auto"
        >
          <div className="relative overflow-hidden rounded-[60px] lg:rounded-[40px] h-[20rem] md:h-[28rem]">
            <Image src="https://shadedthebrand.com/cdn/shop/files/IMG_6110.jpg?v=1736476598&width=3000" alt={t('home.getDiscount')} fill className="object-cover" sizes="(min-width: 1280px) 80rem, 100vw" />
            <div className="absolute inset-0 bg-black/50"></div>
            <div className="absolute inset-0 flex flex-col items-start justify-center text-left px-8 md:px-12 lg:px-16">
                <h3 ref={getDiscountTitleRef} className="text-3xl md:text-4xl lg:text-5xl font-light text-white mb-4 md:mb-6 max-w-2xl leading-tight" style={{ letterSpacing: '-0.02em' }}>
                  {t('home.getDiscount')}
                </h3>
              <p className="text-sm md:text-base lg:text-lg font-extralight text-white/70 mb-8 md:mb-10 max-w-xl" style={{ letterSpacing: '-0.01em' }}>
                {t('home.forAllNewMembers')}
              </p>
              <div ref={signInButtonRef} className="inline-flex items-center gap-3 group/btn transition-all duration-300 hover:opacity-90">
                <LinkWithTransition href="/coleccion" className="inline-flex items-center gap-3" aria-label={t('home.signIn')}>
                  <span ref={signInTextRef} className="text-sm md:text-base font-extralight text-white uppercase tracking-widest" style={{ letterSpacing: '0.15em' }}>
                    {t('home.signIn')}
                  </span>
                  <div className="w-px h-4 bg-white/50"></div>
                  <div className="rounded-full w-10 h-10 flex items-center justify-center border border-white/30 group-hover/btn:border-white/60 group-hover/btn:bg-white/10 transition-all duration-300">
                    <FiArrowUpRight className="w-4 h-4 md:w-5 md:h-5 text-white" />
                  </div>
                </LinkWithTransition>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card de SHADED MOVEMENT */}
      <div className="relative z-10 px-4 pb-8 md:pb-12 mt-8 md:mt-10">
        <div 
          ref={movementCardRef}
          className="bg-black/30 backdrop-blur-md rounded-[60px] border border-white/10 p-2 lg:p-6 w-full max-w-5xl mx-auto"
        >
          <div className="bg-black/90 backdrop-blur-md rounded-[60px] lg:rounded-[40px] p-12 md:p-16 lg:p-20">
            <div className="flex flex-col items-center space-y-8 md:space-y-10">
              {/* Título con diseño mejorado */}
              <div className="text-center max-w-4xl">
                <div ref={movementTitleRef1} className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-light text-white leading-[1.1] mb-4 md:mb-6" style={{ letterSpacing: '-0.03em' }}>
                  SHADED is more than just an Athleisure Brand
                </div>
                <div className="w-16 h-px bg-white/30 mx-auto mb-4 md:mb-6"></div>
                <div ref={movementTitleRef2} className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-light text-white leading-[1.1]" style={{ letterSpacing: '-0.03em' }}>
                  IT'S A MOVEMENT
                </div>
              </div>
              
              {/* Descripción con mejor formato */}
              <div className="text-center max-w-2xl pt-4 md:pt-6 border-t border-white/10">
                <p className="text-sm md:text-base lg:text-lg font-extralight text-white/60 leading-relaxed" style={{ letterSpacing: '-0.01em' }}>
                  {t('home.movementDescription')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

