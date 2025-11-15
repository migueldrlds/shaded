'use client';

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
      className={`relative overflow-hidden cursor-pointer h-[300px] md:h-[400px] lg:h-[500px] ${
        isFirst ? 'rounded-l-2xl' : isLast ? 'rounded-r-2xl' : ''
      }`}
      style={{ 
        width: baseWidth,
        willChange: 'width'
      }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
      <a href={link} className="block w-full h-full">
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
              priority={false}
              unoptimized={true}
            />
          </div>

          {/* Overlay con texto */}
          <div
            ref={overlayRef}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 flex items-center justify-center"
            style={{ willChange: 'opacity' }}
          >
            <div
              ref={textRef}
              className="text-white uppercase text-2xl md:text-3xl lg:text-4xl font-bold text-center px-4"
              style={{ willChange: 'transform, opacity' }}
            >
              {text}
            </div>
          </div>

          {/* Texto inicial (visible cuando no hay hover) */}
          <div className="absolute bottom-4 left-4 right-4 z-10" ref={initialTextRef}>
            <div className="text-white uppercase text-lg md:text-xl font-semibold"
                 >
        {text}
            </div>
          </div>
        </div>
      </a>
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
      className="relative w-full h-[250px] overflow-hidden rounded-2xl cursor-pointer bg-gray-200"
      style={{ willChange: 'height' }}
      onClick={handleContainerClick}
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
              priority={false}
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
                window.location.href = link;
              }
            }}
          >
            <div
              ref={textRef}
              className="text-white uppercase text-3xl font-bold text-center px-4"
              style={{ willChange: 'transform, opacity' }}
            >
              {text}
            </div>
          </div>

          {/* Texto inicial (visible cuando no está expandido) */}
          <div className="absolute bottom-4 left-4 right-4 z-10" ref={initialTextRef}>
            <div className="text-white uppercase text-xl font-semibold"
                 >
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
    </div>
  );
};

export default FlowingMenu;
