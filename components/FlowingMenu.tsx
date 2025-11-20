'use client';

import LinkWithTransition from 'components/link-with-transition';
import { gsap } from 'gsap';
import Image from 'next/image';
import React, { useCallback, useRef, useState } from 'react';

interface MenuItemData {
  link: string;
  text: string;
  image: string;
}

interface MenuItemProps extends MenuItemData {
  index: number;
  isFirst: boolean;
  isLast: boolean;
  totalItems: number;
  onHover: (index: number | null) => void;
  isHovered: boolean;
  isOtherHovered: boolean;
  isMobile: boolean;
}

interface MobileMenuItemProps extends MenuItemData {
  index: number;
  isExpanded: boolean;
  onTap: (index: number) => void;
}

interface FlowingMenuProps {
  items?: MenuItemData[];
}

const FlowingMenu: React.FC<FlowingMenuProps> = ({ items = [] }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const handleHover = useCallback((index: number | null) => {
    setHoveredIndex(index);
  }, []);

  const handleMobileTap = useCallback((index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  }, [expandedIndex]);

  // Limpiar preloads no utilizados (Next.js Image maneja el preload automáticamente)
  React.useEffect(() => {
    if (typeof window === 'undefined' || items.length === 0) return;

    // Obtener todas las URLs de imágenes de las colecciones
    const collectionImageUrls = new Set(items.map(item => item.image).filter(Boolean));
    
    // Solo mantener el preload de la primera imagen visible
    // Next.js Image con priority puede manejar el preload de la imagen principal
    const firstImageUrl = items[0]?.image;

    // Limpiar preloads que corresponden a estas colecciones excepto la primera
    // Usar setTimeout para ejecutar después de que Next.js haya procesado los preloads
    setTimeout(() => {
      const allPreloads = document.querySelectorAll('link[rel="preload"][as="image"]');
      allPreloads.forEach((link) => {
        const href = link.getAttribute('href');
        // Si es una imagen de estas colecciones y no es la primera, eliminarla
        if (href && collectionImageUrls.has(href) && href !== firstImageUrl) {
          link.remove();
        }
      });
    }, 100);
  }, [items]);

  const totalItems = items.length;

  return (
    <>
      {/* Versión Desktop - con hover y expansión horizontal */}
      <div className="hidden md:block w-full h-full overflow-hidden">
        <div className="flex relative" style={{ gap: 0 }}>
          {items.map((item, idx) => (
            <MenuItem
              key={idx}
              {...item}
              index={idx}
              isFirst={idx === 0}
              isLast={idx === totalItems - 1}
              totalItems={totalItems}
              onHover={handleHover}
              isHovered={hoveredIndex === idx}
              isOtherHovered={hoveredIndex !== null && hoveredIndex !== idx}
              isMobile={false}
            />
          ))}
        </div>
      </div>

      {/* Versión Móvil - lista vertical con tap para expandir */}
      <div className="md:hidden w-full">
        <div className="flex flex-col gap-4">
        {items.map((item, idx) => (
            <MobileMenuItem
              key={idx}
              {...item}
              index={idx}
              isExpanded={expandedIndex === idx}
              onTap={handleMobileTap}
            />
          ))}
        </div>
    </div>
    </>
  );
};

const MenuItem: React.FC<MenuItemProps> = ({ link, text, image, index, isFirst, isLast, totalItems, onHover, isHovered, isOtherHovered }) => {
  const itemRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const initialTextRef = useRef<HTMLDivElement>(null);
  const widthRef = useRef<HTMLDivElement>(null);

  // Detectar si es "Coming Soon" - no clickeable
  const isComingSoon = link === '#' || text.toUpperCase().includes('COMING SOON') || text.toUpperCase().includes('PRÓXIMAMENTE');

  // Calcular anchos dinámicamente
  const baseWidth = `${100 / totalItems}%`;
  const expandedWidth = totalItems === 2 ? '70%' : `${(100 / totalItems) * 1.4}%`;
  const contractedWidth = totalItems === 2 ? '30%' : `${(100 / totalItems) * 0.6}%`;

  const handleMouseEnter = () => {
    if (!itemRef.current || !imageRef.current || !textRef.current || !overlayRef.current || !widthRef.current) return;

    // Notificar al padre que este item está en hover (inmediato)
    onHover(index);

    const tl = gsap.timeline({ defaults: { ease: 'power2.out', overwrite: true } });
    
    // Expandir el ancho del item (suave y fluido)
    tl.to(widthRef.current, {
      width: expandedWidth,
      duration: 0.4,
      ease: 'power2.out',
      overwrite: true,
      immediateRender: false
    })
    // Ocultar texto inicial (suave)
    .to(initialTextRef.current, {
      opacity: 0,
      duration: 0.25,
      ease: 'power2.out',
      overwrite: true
    }, 0)
    // Mostrar overlay con el texto (suave)
    .to(overlayRef.current, {
      opacity: 1,
      duration: 0.3,
      ease: 'power2.out',
      overwrite: true
    }, 0.1)
    // Animar el texto (suave y elegante)
    .fromTo(textRef.current, 
      {
        y: 15,
        opacity: 0
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.35,
        ease: 'power2.out',
        overwrite: true
      }, 
      0.15
    );
  };

  const handleMouseLeave = () => {
    if (!itemRef.current || !imageRef.current || !textRef.current || !overlayRef.current || !widthRef.current) return;

    // Notificar al padre que ningún item está en hover
    onHover(null);

    const tl = gsap.timeline({ defaults: { ease: 'power2.in', overwrite: true } });
    
    // Revertir todas las animaciones (suave)
    tl.to(overlayRef.current, {
      opacity: 0,
      duration: 0.2,
      ease: 'power2.in',
      overwrite: true
    })
    .to(textRef.current, {
      y: 15,
      opacity: 0,
      duration: 0.2,
      ease: 'power2.in',
      overwrite: true
    }, 0)
    .to(widthRef.current, {
      width: baseWidth,
      duration: 0.4,
      ease: 'power2.out',
      overwrite: true,
      immediateRender: false
    }, 0.05);
    
    // Mostrar texto inicial nuevamente (suave)
    if (initialTextRef.current) {
      tl.to(initialTextRef.current, {
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out',
        overwrite: true
      }, 0.15);
    }
  };

  // Efecto para animar cuando otro item hace hover (este se achica)
  React.useEffect(() => {
    if (!widthRef.current) return;

    if (isOtherHovered && !isHovered) {
      // Este item se achica cuando otro está en hover (suave)
      gsap.to(widthRef.current, {
        width: contractedWidth,
        duration: 0.4,
        ease: 'power2.out',
        overwrite: true,
        immediateRender: false
      });
    } else if (!isHovered && !isOtherHovered) {
      // Volver al tamaño normal si ningún item está en hover (suave)
      gsap.to(widthRef.current, {
        width: baseWidth,
        duration: 0.4,
        ease: 'power2.out',
        overwrite: true,
        immediateRender: false
      });
    }
  }, [isOtherHovered, isHovered, baseWidth, contractedWidth]);

  return (
    <div
      ref={widthRef}
      className={`relative overflow-hidden ${isComingSoon ? 'cursor-default' : 'cursor-pointer'} h-[400px] md:h-[550px] lg:h-[650px] ${
        isFirst ? 'rounded-l-[40px]' : isLast ? 'rounded-r-[40px]' : ''
      }`}
      style={{ 
        width: baseWidth,
        willChange: 'width'
      }}
        onMouseEnter={!isComingSoon ? handleMouseEnter : undefined}
        onMouseLeave={!isComingSoon ? handleMouseLeave : undefined}
      >
      {isComingSoon ? (
        <div className="block w-full h-full">
          <div
            ref={itemRef}
            className="relative w-full h-full"
          >
          {/* Imagen de fondo */}
          <div 
            ref={imageRef}
            className="absolute inset-0 w-full h-full"
          >
            <Image
              src={image}
              alt={text}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, 33vw"
              priority={isFirst}
              loading={isFirst ? 'eager' : 'lazy'}
              unoptimized={true}
            />
          </div>

          {/* Overlay con texto */}
          <div
            ref={overlayRef}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm opacity-0 flex items-center justify-center"
            style={{ willChange: 'opacity' }}
          >
            <div
              ref={textRef}
              className="text-white text-3xl md:text-4xl lg:text-5xl font-medium text-center px-4"
              style={{ willChange: 'transform, opacity', letterSpacing: '-0.02em' }}
            >
              {text}
            </div>
          </div>

          {/* Texto inicial (visible cuando no hay hover) */}
          <div className="absolute bottom-6 left-6 right-6 z-10" ref={initialTextRef}>
            <div className="text-white text-xl md:text-2xl font-medium"
                 style={{ letterSpacing: '-0.01em' }}>
              {text}
            </div>
          </div>
        </div>
        </div>
      ) : (
        <LinkWithTransition href={link} className="block w-full h-full">
          <div
            ref={itemRef}
            className="relative w-full h-full"
          >
          {/* Imagen de fondo */}
          <div 
            ref={imageRef}
            className="absolute inset-0 w-full h-full"
          >
            <Image
              src={image}
              alt={text}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, 33vw"
              priority={isFirst}
              loading={isFirst ? 'eager' : 'lazy'}
              unoptimized={true}
            />
          </div>

          {/* Overlay con texto */}
          <div
            ref={overlayRef}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm opacity-0 flex items-center justify-center"
            style={{ willChange: 'opacity' }}
          >
            <div
              ref={textRef}
              className="text-white text-3xl md:text-4xl lg:text-5xl font-medium text-center px-4"
              style={{ willChange: 'transform, opacity', letterSpacing: '-0.02em' }}
            >
              {text}
            </div>
          </div>

          {/* Texto inicial (visible cuando no hay hover) */}
          <div className="absolute bottom-6 left-6 right-6 z-10" ref={initialTextRef}>
            <div className="text-white text-xl md:text-2xl font-medium"
                 style={{ letterSpacing: '-0.01em' }}>
              {text}
            </div>
          </div>
        </div>
      </LinkWithTransition>
      )}
    </div>
  );
};

// Componente para móvil con animación de expansión vertical
const MobileMenuItem: React.FC<MobileMenuItemProps> = ({ link, text, image, index, isExpanded, onTap }) => {
  const itemRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const initialTextRef = useRef<HTMLDivElement>(null);

  // Animar expansión/contracción cuando cambia isExpanded
  React.useEffect(() => {
    if (!itemRef.current || !overlayRef.current || !textRef.current || !initialTextRef.current) return;

    if (isExpanded) {
      // Habilitar pointer events en el overlay cuando se expande
      overlayRef.current.style.pointerEvents = 'auto';
      
      // Expandir el item
      const tl = gsap.timeline({ defaults: { ease: 'power2.out', overwrite: true } });
      
      tl.to(itemRef.current, {
        height: '400px',
        duration: 0.4,
        ease: 'power2.out'
      })
      .to(initialTextRef.current, {
        opacity: 0,
        duration: 0.2,
        ease: 'power2.out'
      }, 0)
      .to(overlayRef.current, {
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out'
      }, 0.1)
      .fromTo(textRef.current,
        {
          y: 15,
          opacity: 0
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.35,
          ease: 'power2.out'
        },
        0.15
      );
    } else {
      // Deshabilitar pointer events cuando se contrae
      if (overlayRef.current) {
        overlayRef.current.style.pointerEvents = 'none';
      }
      
      // Contraer el item
      const tl = gsap.timeline({ defaults: { ease: 'power2.in', overwrite: true } });
      
      tl.to(overlayRef.current, {
        opacity: 0,
        duration: 0.2,
        ease: 'power2.in'
      })
      .to(textRef.current, {
        y: 15,
        opacity: 0,
        duration: 0.2,
        ease: 'power2.in'
      }, 0)
      .to(itemRef.current, {
        height: '250px',
        duration: 0.4,
        ease: 'power2.out'
      }, 0.05)
      .to(initialTextRef.current, {
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out'
      }, 0.15);
    }
  }, [isExpanded]);

  const handleContainerClick = (e: React.MouseEvent) => {
    // Si no está expandido, expandir
    if (!isExpanded) {
      e.preventDefault();
      onTap(index);
    }
  };

  return (
    <div
      ref={itemRef}
      className="relative w-full h-[350px] overflow-hidden rounded-[40px] cursor-pointer bg-gray-200"
      style={{ willChange: 'height' }}
      onClick={handleContainerClick}
    >
        <LinkWithTransition 
          href={link}
          className="block w-full h-full"
          onClick={(e) => {
            // Si no está expandido, prevenir la navegación para permitir la expansión
            if (!isExpanded) {
              e.preventDefault();
            }
          }}
        >
        <div
          ref={contentRef}
          className="relative w-full h-full"
        >
          {/* Imagen de fondo */}
          <div className="absolute inset-0 w-full h-full">
            <Image
              src={image}
              alt={text}
              fill
              className="object-cover"
              priority={index === 0}
              loading={index === 0 ? 'eager' : 'lazy'}
              unoptimized={true}
            />
          </div>

          {/* Overlay con texto (se muestra cuando está expandido) */}
          <div
            ref={overlayRef}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 flex items-center justify-center pointer-events-none"
            style={{ willChange: 'opacity' }}
            onClick={(e) => {
              if (isExpanded) {
                // Cuando está expandido y se toca el overlay, navegar
                e.stopPropagation();
                // La navegación se manejará a través del LinkWithTransition
              }
            }}
          >
            <div
              ref={textRef}
              className="text-white text-3xl font-medium text-center px-4"
              style={{ willChange: 'transform, opacity', letterSpacing: '-0.02em' }}
            >
              {text}
            </div>
          </div>

          {/* Texto inicial (visible cuando no está expandido) */}
          <div className="absolute bottom-6 left-6 right-6 z-10" ref={initialTextRef}>
            <div className="text-white text-xl font-medium"
                 style={{ letterSpacing: '-0.01em' }}>
              {text}
            </div>
          </div>

          {/* Indicador de tap (flecha o icono) - solo visible cuando no está expandido */}
          {!isExpanded && (
            <div className="absolute top-4 right-4 z-10">
              <div className="w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          )}

          {/* Botón de cerrar cuando está expandido */}
          {isExpanded && (
            <div 
              className="absolute top-4 right-4 z-20"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onTap(index);
              }}
            >
              <div className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
          )}
        </div>
        </LinkWithTransition>
    </div>
  );
};

export default FlowingMenu;
