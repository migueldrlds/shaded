'use client';

import { useLanguage } from 'components/providers/language-provider';
import { gsap } from 'gsap';
import { useEffect, useRef, useState } from 'react';

interface LanguageSelectorProps {
  isDarkMode?: boolean;
}

export default function LanguageSelector({ isDarkMode = false }: LanguageSelectorProps) {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const chevronRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);

  const languages: Array<{ value: 'en' | 'es'; label: string }> = [
    { value: 'en', label: t('common.english') },
    { value: 'es', label: t('common.spanish') }
  ];

  const currentLanguage = languages.find(lang => lang.value === language) ?? languages[0]!;

  // Inicializar el estado del dropdown cuando está cerrado
  useEffect(() => {
    if (!dropdownRef.current) return;
    
    if (!isOpen) {
      gsap.set(dropdownRef.current, {
        height: 0,
        opacity: 0,
        overflow: 'hidden'
      });
    }
  }, []);

  useEffect(() => {
    if (!dropdownRef.current || !optionsRef.current) return;

    const dropdown = dropdownRef.current;

    if (isOpen) {
      // Primero, establecer altura auto para calcular la altura real
      gsap.set(dropdown, { 
        height: 'auto',
        overflow: 'hidden'
      });
      
      // Obtener la altura calculada
      const height = dropdown.offsetHeight;
      
      // Ahora animar desde 0 (altura y opacidad)
      gsap.set(dropdown, { 
        height: 0,
        opacity: 0
      });
      
      gsap.to(dropdown, {
        height: height,
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out',
        onComplete: () => {
          // Mantener altura auto después de la animación
          gsap.set(dropdown, { height: 'auto', opacity: 1, overflow: 'visible' });
        }
      });
    } else {
      // Animación de cierre - obtener altura actual antes de animar
      const currentHeight = dropdown.offsetHeight || 0;
      
      if (currentHeight > 0) {
        gsap.set(dropdown, { height: currentHeight, opacity: 1, overflow: 'hidden' });
        
        gsap.to(dropdown, {
          height: 0,
          opacity: 0,
          duration: 0.2,
          ease: 'power2.in'
        });
      } else {
        // Si ya está cerrado, solo establecer el estado
        gsap.set(dropdown, {
          height: 0,
          opacity: 0,
          overflow: 'hidden'
        });
      }
    }
  }, [isOpen]);

  useEffect(() => {
    if (!chevronRef.current) return;

    // Animar chevron cuando se abre/cierra
    if (isOpen) {
      gsap.to(chevronRef.current, {
        rotation: 180,
        duration: 0.3,
        ease: 'power2.out'
      });
    } else {
      gsap.to(chevronRef.current, {
        rotation: 0,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (lang: 'en' | 'es') => {
    setLanguage(lang);
    
    // Animación de cierre
    if (dropdownRef.current) {
      const currentHeight = dropdownRef.current.offsetHeight || 0;
      gsap.set(dropdownRef.current, { height: currentHeight, opacity: 1, overflow: 'hidden' });
      
      gsap.to(dropdownRef.current, {
        height: 0,
        opacity: 0,
        duration: 0.2,
        ease: 'power2.in',
        onComplete: () => setIsOpen(false)
      });
    } else {
      setIsOpen(false);
    }
  };

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        if (isOpen && dropdownRef.current) {
          const currentHeight = dropdownRef.current.offsetHeight || 0;
          gsap.set(dropdownRef.current, { height: currentHeight, opacity: 1, overflow: 'hidden' });
          
          gsap.to(dropdownRef.current, {
            height: 0,
            opacity: 0,
            duration: 0.2,
            ease: 'power2.in',
            onComplete: () => setIsOpen(false)
          });
        }
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Colores según el modo
  const labelColor = isDarkMode ? 'text-black/60' : 'text-white/60';
  const buttonBg = isDarkMode ? 'bg-black/10' : 'bg-white/10';
  const buttonBorder = isDarkMode ? 'border-black/30' : 'border-white/30';
  const buttonText = isDarkMode ? 'text-black' : 'text-white';
  const buttonHoverBg = isDarkMode ? 'hover:bg-black/20' : 'hover:bg-white/20';
  const buttonHoverBorder = isDarkMode ? 'hover:border-black/40' : 'hover:border-white/40';
  const buttonFocusRing = isDarkMode ? 'focus:ring-black/50' : 'focus:ring-white/50';
  const buttonFocusBorder = isDarkMode ? 'focus:border-black/50' : 'focus:border-white/50';

  return (
    <div className="relative" ref={containerRef}>
      <div className="flex items-center gap-2">
        <label className={`${labelColor} text-sm`}>
          {t('footer.language')}:
        </label>
        <div className="relative">
          <button
            ref={buttonRef}
            onClick={handleToggle}
            className={`relative flex items-center justify-between gap-2 ${buttonBg} backdrop-blur-sm border ${buttonBorder} rounded-md px-3 py-1.5 ${buttonText} text-sm min-w-[120px] cursor-pointer transition-all duration-200 ${buttonHoverBg} ${buttonHoverBorder} focus:outline-none focus:ring-2 ${buttonFocusRing} ${buttonFocusBorder}`}
            onMouseEnter={(e) => {
              gsap.to(e.currentTarget, {
                backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.15)' : 'rgba(255, 255, 255, 0.15)',
                borderColor: isDarkMode ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.4)',
                duration: 0.2
              });
            }}
            onMouseLeave={(e) => {
              gsap.to(e.currentTarget, {
                backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)',
                borderColor: isDarkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.3)',
                duration: 0.2
              });
            }}
          >
            <span>{currentLanguage.label}</span>
            <div ref={chevronRef} className="flex items-center">
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 4.5L6 7.5L9 4.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </button>

          <div
            ref={dropdownRef}
            className={`absolute bottom-full left-0 mb-1 ${buttonBg} backdrop-blur-md border ${buttonBorder} rounded-md overflow-hidden shadow-lg z-50 min-w-[120px]`}
            style={{
              transformOrigin: 'bottom center',
              height: 0,
              opacity: 0,
              pointerEvents: isOpen ? 'auto' : 'none'
            }}
          >
            <div ref={optionsRef} className="py-1">
              {languages.map((lang) => (
                <button
                  key={lang.value}
                  onClick={() => handleSelect(lang.value)}
                  className={`w-full text-left px-3 py-2 ${buttonText} text-sm transition-colors duration-200 ${isDarkMode ? 'hover:bg-black/20 focus:bg-black/20' : 'hover:bg-white/20 focus:bg-white/20'}`}
                  onMouseEnter={(e) => {
                    gsap.to(e.currentTarget, {
                      backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.2)',
                      duration: 0.2
                    });
                  }}
                  onMouseLeave={(e) => {
                    const activeBg = isDarkMode ? 'rgba(0, 0, 0, 0.15)' : 'rgba(255, 255, 255, 0.15)';
                    gsap.to(e.currentTarget, {
                      backgroundColor: lang.value === language ? activeBg : 'transparent',
                      duration: 0.2
                    });
                  }}
                  style={{
                    backgroundColor: lang.value === language 
                      ? (isDarkMode ? 'rgba(0, 0, 0, 0.15)' : 'rgba(255, 255, 255, 0.15)') 
                      : 'transparent'
                  }}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

