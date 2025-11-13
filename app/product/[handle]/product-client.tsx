'use client';

import { useCart } from 'components/cart/cart-context';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { Product } from 'lib/shopify/types';
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { FiArrowLeft, FiChevronDown, FiChevronUp, FiShoppingCart, FiX } from 'react-icons/fi';

interface ProductClientProps {
  producto: Product;
}

export default function ProductClient({ producto }: ProductClientProps) {
  const router = useRouter();
  const { addCartItem } = useCart();
  // Estados para la galería de imágenes
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPanelVisible, setIsPanelVisible] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [zoomLevel, setZoomLevel] = useState(1);
  const [lastPinchDistance, setLastPinchDistance] = useState(0);
  
  // Estados para el producto
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [showFullDetails, setShowFullDetails] = useState(false);
  
  // Estados para dropdowns personalizados
  const [isSizeDropdownOpen, setIsSizeDropdownOpen] = useState(false);
  const [isColorDropdownOpen, setIsColorDropdownOpen] = useState(false);
  
  // Refs para gestos táctiles
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Refs para dropdowns animados
  const sizeDropdownRef = useRef<HTMLDivElement>(null);
  const colorDropdownRef = useRef<HTMLDivElement>(null);
  
  // Ref para la sección de descripción que se revela con scroll
  const descriptionSectionRef = useRef<HTMLDivElement>(null);
  // Ref para el panel principal (trigger estable)
  const mainPanelRef = useRef<HTMLDivElement>(null);
  
  // Estado para la altura del header
  const [headerHeight, setHeaderHeight] = useState(80); // Valor por defecto

  // Extraer colores únicos de las variantes
  const getAvailableColors = () => {
    if (!producto?.variants) return [];
    
    const colorMap = new Map();
    producto.variants.forEach(variant => {
      const colorOption = variant.selectedOptions?.find(option => 
        option.name.toLowerCase().includes('color') || 
        option.name.toLowerCase().includes('colour')
      );
      
      if (colorOption) {
        const colorName = colorOption.value;
        const isAvailable = variant.availableForSale;
        
        if (!colorMap.has(colorName)) {
          colorMap.set(colorName, {
            nombre: colorName,
            codigo: getColorCode(colorName),
            disponible: isAvailable
          });
        } else {
          // Si ya existe, actualizar disponibilidad (si alguna variante está disponible)
          const existing = colorMap.get(colorName);
          if (isAvailable) {
            existing.disponible = true;
          }
        }
      }
    });
    
    return Array.from(colorMap.values());
  };

  // Extraer tallas únicas de las variantes
  const getAvailableSizes = () => {
    if (!producto?.variants) return [];
    
    const sizeMap = new Map();
    producto.variants.forEach(variant => {
      const sizeOption = variant.selectedOptions?.find(option => 
        option.name.toLowerCase().includes('size') || 
        option.name.toLowerCase().includes('talla')
      );
      
      if (sizeOption) {
        const sizeName = sizeOption.value;
        const isAvailable = variant.availableForSale;
        
        if (!sizeMap.has(sizeName)) {
          sizeMap.set(sizeName, {
            talla: sizeName,
            disponible: isAvailable
          });
        } else {
          // Si ya existe, actualizar disponibilidad
          const existing = sizeMap.get(sizeName);
          if (isAvailable) {
            existing.disponible = true;
          }
        }
      }
    });
    
    return Array.from(sizeMap.values());
  };

  // Función para obtener código de color basado en el nombre
  const getColorCode = (colorName: string) => {
    const colorMap: Record<string, string> = {
      'black': '#000000',
      'negro': '#000000',
      'white': '#FFFFFF',
      'blanco': '#FFFFFF',
      'gray': '#808080',
      'gris': '#808080',
      'grey': '#808080',
      'red': '#FF0000',
      'rojo': '#FF0000',
      'blue': '#0000FF',
      'azul': '#0000FF',
      'green': '#008000',
      'verde': '#008000',
      'yellow': '#FFFF00',
      'amarillo': '#FFFF00',
      'purple': '#800080',
      'morado': '#800080',
      'pink': '#FFC0CB',
      'rosa': '#FFC0CB',
      'brown': '#A52A2A',
      'marrón': '#A52A2A',
      'marron': '#A52A2A',
      'orange': '#FFA500',
      'naranja': '#FFA500'
    };
    
    return colorMap[colorName.toLowerCase()] || '#808080';
  };

  // Inicializar variante seleccionada y valores por defecto
  useEffect(() => {
    if (producto?.variants && producto.variants.length > 0) {
      setSelectedVariant(producto.variants[0]);
      
      // Establecer valores por defecto para color y talla
      const colors = getAvailableColors();
      const sizes = getAvailableSizes();
      
      if (colors.length > 0 && !selectedColor) {
        setSelectedColor(colors[0].nombre);
      }
      if (sizes.length > 0 && !selectedSize) {
        setSelectedSize(sizes[0].talla);
      }
    }
  }, [producto]);

  // Navegación con teclado
  useEffect(() => {
    if (!producto?.images) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setCurrentImageIndex((prevIndex) => 
          prevIndex === 0 ? (producto?.images?.length || 1) - 1 : prevIndex - 1
        );
      } else if (e.key === 'ArrowRight') {
        setCurrentImageIndex((prevIndex) => 
          prevIndex === (producto?.images?.length || 1) - 1 ? 0 : prevIndex + 1
        );
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [producto?.images]);

  // Detectar altura del header dinámicamente
  useEffect(() => {
    const detectHeaderHeight = () => {
      const header = document.querySelector('header') || document.querySelector('[role="banner"]');
      if (header) {
        const rect = header.getBoundingClientRect();
        setHeaderHeight(rect.height + 12); // +16px para un poco de separación
      } else {
        // Fallback: buscar elementos comunes de header
        const navElements = document.querySelectorAll('nav, .navbar, .header, .top-bar');
        if (navElements.length > 0) {
          const firstElement = navElements[0];
          if (firstElement) {
            const rect = firstElement.getBoundingClientRect();
            setHeaderHeight(rect.height + 16);
          }
        }
      }
    };

    // Detectar al cargar
    detectHeaderHeight();

    // Detectar en resize (por si el header cambia de tamaño)
    const handleResize = () => {
      detectHeaderHeight();
    };

    window.addEventListener('resize', handleResize);
    
    // También detectar después de un pequeño delay para asegurar que el DOM esté listo
    const timeoutId = setTimeout(detectHeaderHeight, 100);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  // Animaciones GSAP para dropdown de tallas
  useEffect(() => {
    if (!isSizeDropdownOpen || !sizeDropdownRef.current) return;
    const dropdown = sizeDropdownRef.current;
    const items = dropdown.querySelectorAll('button');
    
    gsap.set(dropdown, { opacity: 0, y: 12, height: 0 });
    gsap.to(dropdown, { 
      opacity: 1, 
      y: 0, 
      height: 'auto', 
      duration: 0.3, 
      ease: 'power3.out' 
    });
    
    if (items.length) {
      gsap.from(items, { 
        opacity: 0, 
        y: 8, 
        duration: 0.25, 
        stagger: 0.03, 
        ease: 'power2.out', 
        delay: 0.05 
      });
    }
  }, [isSizeDropdownOpen]);

  // Animaciones GSAP para dropdown de colores
  useEffect(() => {
    if (!isColorDropdownOpen || !colorDropdownRef.current) return;
    const dropdown = colorDropdownRef.current;
    const items = dropdown.querySelectorAll('button');
    
    gsap.set(dropdown, { opacity: 0, y: 12, height: 0 });
    gsap.to(dropdown, { 
      opacity: 1, 
      y: 0, 
      height: 'auto', 
      duration: 0.3, 
      ease: 'power3.out' 
    });
    
    if (items.length) {
      gsap.from(items, { 
        opacity: 0, 
        y: 8, 
        duration: 0.25, 
        stagger: 0.03, 
        ease: 'power2.out', 
        delay: 0.05 
      });
    }
  }, [isColorDropdownOpen]);

  // Ocultar completamente el scrollbar nativo
  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'hide-native-scrollbar';
    style.textContent = `
      .hide-scrollbar {
        -ms-overflow-style: none !important;
        scrollbar-width: none !important;
      }
      
      .hide-scrollbar::-webkit-scrollbar {
        display: none !important;
        width: 0 !important;
        height: 0 !important;
      }
      
      .hide-scrollbar::-webkit-scrollbar-track {
        display: none !important;
      }
      
      .hide-scrollbar::-webkit-scrollbar-thumb {
        display: none !important;
      }
      
      .hide-scrollbar::-webkit-scrollbar-corner {
        display: none !important;
      }
    `;
    
    document.head.appendChild(style);
    
    return () => {
      const styleToRemove = document.getElementById('hide-native-scrollbar');
      if (styleToRemove) {
        document.head.removeChild(styleToRemove);
      }
    };
  }, []);

  // Cerrar dropdowns al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.dropdown-container')) {
        closeSizeDropdown();
        closeColorDropdown();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Animación de ScrollTrigger para revelar la descripción en móvil
  useEffect(() => {
    // Solo ejecutar en pantallas móviles (menos de 768px)
    const isMobile = window.innerWidth < 768;
    if (!isMobile) return;

    // Registrar ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Usamos el ref del panel principal como el scope del contexto
    let ctx = gsap.context(() => {
      // Asegurarnos que ambos refs existan
      if (descriptionSectionRef.current && mainPanelRef.current) {
        
        gsap.set(descriptionSectionRef.current, { 
          height: 0, 
          opacity: 0, 
          overflow: 'hidden' 
        });

        gsap.to(descriptionSectionRef.current, {
          height: "auto",
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            // --- CAMBIO CLAVE AQUÍ ---
            trigger: mainPanelRef.current, // Usamos el panel como trigger estable
            start: "bottom 95%", // Inicia cuando el fondo del panel esté al 95% de la altura de la pantalla
            toggleActions: "play reverse play reverse",
          }
        });
      }
    }, mainPanelRef); // El scope es el panel principal

    // Función de limpieza para cuando el componente se desmonte
    return () => ctx.revert();
  }, []);

  // Funciones para cerrar dropdowns con animación
  const closeSizeDropdown = () => {
    if (sizeDropdownRef.current) {
      gsap.to(sizeDropdownRef.current, {
        opacity: 0,
        y: 12,
        height: 0,
        duration: 0.2,
        ease: 'power2.out',
        onComplete: () => setIsSizeDropdownOpen(false)
      });
    } else {
      setIsSizeDropdownOpen(false);
    }
  };

  const closeColorDropdown = () => {
    if (colorDropdownRef.current) {
      gsap.to(colorDropdownRef.current, {
        opacity: 0,
        y: 12,
        height: 0,
        duration: 0.2,
        ease: 'power2.out',
        onComplete: () => setIsColorDropdownOpen(false)
      });
    } else {
      setIsColorDropdownOpen(false);
    }
  };

  // Prevenir scroll en el body
  useEffect(() => {
    // Solo bloquear el scroll cuando esté en fullscreen
    if (isFullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isFullscreen]);

  const handleAddToCart = async () => {
    if (!producto?.variants || producto.variants.length === 0) {
      console.log('❌ No hay variantes disponibles');
      return;
    }

    // Buscar la variante que coincida con la talla y color seleccionados
    const selectedVariant = producto.variants.find(variant => {
      const sizeOption = variant.selectedOptions?.find(option => 
        option.name.toLowerCase().includes('size') || 
        option.name.toLowerCase().includes('talla')
      );
      const colorOption = variant.selectedOptions?.find(option => 
        option.name.toLowerCase().includes('color') || 
        option.name.toLowerCase().includes('colour')
      );
      
      return sizeOption?.value === selectedSize && colorOption?.value === selectedColor;
    });

    if (!selectedVariant) {
      console.log('❌ No se encontró la variante seleccionada');
      // Opcional: manejar este caso, por ejemplo, mostrando un error al usuario.
      return;
    }

    if (!selectedVariant.availableForSale) {
      console.log('❌ La variante seleccionada no está disponible');
      return;
    }

    // Agregar al carrito
    try {
      await addCartItem(selectedVariant, producto);
    } catch (error) {
      console.error('❌ Error agregando producto al carrito:', error);
    }
  };

  // --- NUEVA LÓGICA DE GESTOS TÁCTILES ---
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isFullscreen || !e.touches || e.touches.length === 0) return;
    
    const touch = e.touches[0];
    if (!touch) return;
    
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isFullscreen || !touchStartRef.current || !e.touches || e.touches.length === 0) return;
    
    const touch = e.touches[0];
    if (!touch) return;
    
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    
    // Solo prevenir scroll si el movimiento es predominantemente horizontal
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
      e.preventDefault();
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (isFullscreen || !touchStartRef.current || !e.changedTouches || e.changedTouches.length === 0) return;
    
    const touch = e.changedTouches[0];
    if (!touch) return;
    
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    const deltaTime = Date.now() - touchStartRef.current.time;
    
    const swipeThreshold = 50; // Mínimo píxeles para considerar swipe
    const tapThreshold = 10;   // Máximo píxeles para considerar tap
    const timeThreshold = 300; // Máximo tiempo para considerar tap
    
    // Determinar si es swipe o tap
    const isHorizontalSwipe = Math.abs(deltaX) > swipeThreshold && Math.abs(deltaX) > Math.abs(deltaY);
    const isTap = Math.abs(deltaX) < tapThreshold && Math.abs(deltaY) < tapThreshold && deltaTime < timeThreshold;
    
    if (isHorizontalSwipe) {
      // Swipe horizontal - cambiar imagen
      if (deltaX < 0) {
        // Swipe izquierda - siguiente imagen
        setCurrentImageIndex(prev => 
          prev === (producto?.images?.length || 1) - 1 ? 0 : prev + 1
        );
      } else {
        // Swipe derecha - imagen anterior
        setCurrentImageIndex(prev => 
          prev === 0 ? (producto?.images?.length || 1) - 1 : prev - 1
        );
      }
    } else if (isTap) {
      // Tap - entrar a fullscreen
      setIsFullscreen(true);
    }
    
    touchStartRef.current = null;
  };

  // Funciones para gestos nativos (Pinch & Zoom en fullscreen)
  const handleFullscreenTouchStart = (e: React.TouchEvent) => {
    if (!isFullscreen) return;

    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: (e.touches[0]?.clientX || 0) - imagePosition.x,
        y: (e.touches[0]?.clientY || 0) - imagePosition.y
      });
    } else if (e.touches.length === 2) {
      const distance = Math.hypot(
        (e.touches[0]?.clientX || 0) - (e.touches[1]?.clientX || 0),
        (e.touches[0]?.clientY || 0) - (e.touches[1]?.clientY || 0)
      );
      setLastPinchDistance(distance);
    }
  };

  const handleFullscreenTouchMove = (e: React.TouchEvent) => {
    if (!isFullscreen) return;
    e.preventDefault();
    
    if (e.touches.length === 1 && isDragging) {
      const newX = (e.touches[0]?.clientX || 0) - dragStart.x;
      const newY = (e.touches[0]?.clientY || 0) - dragStart.y;
      
      const maxX = (window.innerWidth * (zoomLevel - 1)) / 2;
      const maxY = (window.innerHeight * (zoomLevel - 1)) / 2;
      
      setImagePosition({
        x: Math.max(-maxX, Math.min(maxX, newX)),
        y: Math.max(-maxY, Math.min(maxY, newY))
      });
    } else if (e.touches.length === 2) {
      const distance = Math.hypot(
        (e.touches[0]?.clientX || 0) - (e.touches[1]?.clientX || 0),
        (e.touches[0]?.clientY || 0) - (e.touches[1]?.clientY || 0)
      );
      
      if (lastPinchDistance > 0) {
        const scale = distance / lastPinchDistance;
        setZoomLevel(prev => Math.max(1, Math.min(3, prev * scale)));
      }
      setLastPinchDistance(distance);
    }
  };

  const handleFullscreenTouchEnd = () => {
    if (isFullscreen) {
      setIsDragging(false);
      setLastPinchDistance(0);
    }
  };

  const formatPrice = (price: any) => {
    if (!price) return '$0.00';
    return `$${parseFloat(price.amount).toFixed(2)} ${price.currencyCode}`;
  };

  return (
    <div 
      className="min-h-screen relative"
    >
      {/* Video de fondo para escritorio */}
      <div className="hidden md:block fixed inset-0" style={{ zIndex: -1 }}>
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/shadedbg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      {/* Galería de imágenes móvil */}
      <div 
        ref={containerRef}
        className="md:hidden fixed inset-0 select-none overflow-hidden"
        style={{ 
          zIndex: 0,
          touchAction: isFullscreen ? 'none' : 'pan-y' 
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Imagen principal con animación */}
        <div className="relative w-full h-full overflow-hidden">
          <div 
            className="flex h-full transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${currentImageIndex * 100}%)`
            }}
          >
            {producto?.images?.map((imagen, index) => (
              <div key={index} className="w-full h-full flex-shrink-0 relative">
                <Image
                  src={imagen.url}
                  alt={imagen.altText || producto?.title || 'Product image'}
                  fill
                  className="object-cover"
                  priority={index === 0}
                  sizes="100vw"
                />
              </div>
            ))}
          </div>
          
          {/* Overlay con gradiente */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        </div>
        
        {/* Indicadores de navegación - Solo cuando el panel esté oculto */}
        {producto?.images && producto.images.length > 1 && !isPanelVisible && (
          <div className="absolute top-1/2 left-0 right-0 flex justify-between px-4 pointer-events-none">
            <button
              onClick={() => setCurrentImageIndex(prev => 
                prev === 0 ? producto.images.length - 1 : prev - 1
              )}
              className="pointer-events-auto bg-black/30 backdrop-blur-sm text-white p-3 rounded-full hover:bg-black/50 transition-all duration-200"
              aria-label="Imagen anterior"
            >
              <FiArrowLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => setCurrentImageIndex(prev => 
                prev === producto.images.length - 1 ? 0 : prev + 1
              )}
              className="pointer-events-auto bg-black/30 backdrop-blur-sm text-white p-3 rounded-full hover:bg-black/50 transition-all duration-200"
              aria-label="Siguiente imagen"
            >
              <FiArrowLeft className="h-5 w-5 rotate-180" />
            </button>
          </div>
        )}
        
        {/* Indicadores de puntos */}
        {producto?.images && producto.images.length > 1 && (
          <div 
            className="absolute left-1/2 transform -translate-x-1/2 flex space-x-2 bg-black/30 backdrop-blur-sm rounded-full px-4 py-2"
            style={{ top: `${headerHeight}px` }}
          >
            {producto.images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`transition-all duration-500 ease-in-out transform ${
                  index === currentImageIndex 
                    ? 'w-8 h-2 bg-white scale-100' 
                    : 'w-2 h-2 bg-white/60 hover:bg-white/80 scale-100 hover:scale-110'
                } rounded-full`}
                aria-label={`Ver imagen ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Card de escritorio */}
      <div className="hidden md:flex relative z-10 items-center justify-center p-8 pt-40 min-h-screen">
        <div className="w-full max-w-6xl h-[calc(100vh-8rem)] bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="flex h-full">
            {/* Columna izquierda - Imagen */}
            <div className="w-1/2 relative">
              <div className="h-full relative">
                <Image
                  src={producto?.images?.[currentImageIndex]?.url || '/img1.jpg'}
                  alt={producto?.images?.[currentImageIndex]?.altText || producto?.title || 'Product image'}
                  fill
                  className="object-cover"
                />
                {/* Indicadores */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3 bg-black/30 backdrop-blur-md rounded-full px-6 py-3 border border-white/20">
                  {producto?.images?.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative transition-all duration-500 ${
                        index === currentImageIndex 
                          ? 'w-8 h-2' 
                          : 'w-2 h-2 hover:w-3 hover:h-2'
                      }`}
                    >
                      <div className={`w-full h-full rounded-full transition-all duration-500 ${
                        index === currentImageIndex 
                          ? 'bg-white shadow-lg' 
                          : 'bg-white/60 hover:bg-white/80'
                      }`} />
                    </button>
                  ))}
                </div>
                {/* Botones navegación */}
                <button
                  onClick={() => setCurrentImageIndex(prev => 
                    prev === 0 ? (producto?.images?.length || 1) - 1 : prev - 1
                  )}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-all duration-200"
                >
                  <FiArrowLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setCurrentImageIndex(prev => 
                    prev === (producto?.images?.length || 1) - 1 ? 0 : prev + 1
                  )}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-all duration-200"
                >
                  <FiArrowLeft className="h-4 w-4 rotate-180" />
                </button>
              </div>
            </div>

            {/* Columna derecha - Controles */}
            <div className="w-1/2 p-8 flex flex-col">
              <div className="mb-6">
                <div className="max-w-xs mx-auto">
                  <h1 className="text-3xl font-bold text-white mb-2 leading-tight text-left">{producto?.title}</h1>
                  <div className="flex items-baseline space-x-3 mb-3">
                    <span className="text-2xl font-bold text-white">{formatPrice(producto?.priceRange?.maxVariantPrice)}</span>
                  </div>
                  <p className="text-white/85 text-base leading-relaxed text-left">
                    {producto?.description || 'Descripción del producto no disponible.'}
                  </p>
                </div>
              </div>

              <div className="flex-1 space-y-6 flex flex-col items-center">
                {/* Selectores de color */}
                <div className="max-w-xs w-full">
                  <label className="block text-white/90 text-sm font-semibold mb-4 uppercase tracking-wider text-left">COLOR</label>
                  <div className="flex relative justify-start">
                    {getAvailableColors().map((colorInfo, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedColor(colorInfo.nombre)}
                        disabled={!colorInfo.disponible}
                        className={`w-12 h-1 rounded-none ${
                          !colorInfo.disponible ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
                        }`}
                        style={{ backgroundColor: colorInfo.codigo }}
                      />
                    ))}
                    {/* Línea indicadora alineada a la izquierda */}
                    {selectedColor && (
                      <div 
                        className="absolute -bottom-2 h-0.5 bg-white transition-all duration-300"
                        style={{
                          left: `${getAvailableColors().findIndex(c => c.nombre === selectedColor) * 48}px`,
                          width: '48px'
                        }}
                      />
                    )}
                  </div>
                </div>

                {/* Selector de talla */}
                <div className="max-w-xs w-full">
                  <label className="block text-white/90 text-sm font-semibold mb-4 uppercase tracking-wider text-left">SIZE</label>
                  <div className="flex space-x-2 justify-start">
                    {getAvailableSizes().map((tallaInfo, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedSize(tallaInfo.talla)}
                        disabled={!tallaInfo.disponible}
                        className={`w-10 h-10 rounded-full border-2 transition-all duration-300 flex items-center justify-center text-xs font-medium ${
                          selectedSize === tallaInfo.talla
                            ? 'bg-white text-black border-white'
                            : 'bg-transparent text-white/70 border-white/30 hover:border-white/50'
                        } ${!tallaInfo.disponible ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        {tallaInfo.talla}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Botón agregar al carrito */}
              <div className="mt-6 flex justify-center">
                <div className="max-w-xs w-full">
                  <button
                    onClick={handleAddToCart}
                    className="w-full bg-white/20 backdrop-blur-md text-white py-4 rounded-full font-medium hover:bg-white/30 transition-all duration-200 flex items-center justify-between px-6 border border-white/30 cursor-pointer relative z-10"
                    type="button"
                  >
                    <span>Add to Cart</span>
                    <FiShoppingCart className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Botón de regreso - Móvil */}
      {!isFullscreen && (
        <div 
          className="md:hidden absolute left-4 z-20"
          style={{ top: `${headerHeight}px` }}
        >
          <button 
            onClick={() => router.back()}
            className="bg-black/30 backdrop-blur-sm text-white p-3 rounded-full hover:bg-black/50 transition-all duration-200"
            aria-label="Volver atrás"
          >
            <FiArrowLeft className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Panel móvil */}
      {!isFullscreen && (
        <div className={`md:hidden fixed bottom-0 left-0 right-0 z-20 transition-transform duration-300 ${
          isPanelVisible ? 'translate-y-0' : 'translate-y-full'
        }`}>
          {/* Botón toggle para subir/bajar el panel */}
          <div className="absolute bottom-full w-full flex justify-end p-4">
              <button
                onClick={() => setIsPanelVisible(!isPanelVisible)}
                className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all duration-200"
                aria-label={isPanelVisible ? "Ocultar panel" : "Mostrar panel"}
              >
                {isPanelVisible ? (
                  <FiChevronDown className="h-5 w-5" />
                ) : (
                  <FiChevronUp className="h-5 w-5" />
                )}
              </button>
          </div>
          
          <div ref={mainPanelRef} className="bg-white/20 backdrop-blur-xl rounded-t-3xl shadow-2xl">
            <div className="px-4 pt-6 pb-6 max-h-[60vh] overflow-y-auto">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h1 className="text-2xl font-bold text-white">{producto?.title}</h1>
                  <span className="text-lg font-bold text-white">{formatPrice(producto?.priceRange?.maxVariantPrice)}</span>
                </div>
              </div>

              {/* Información seleccionada */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {/* Talla seleccionada */}
                <div className="relative dropdown-container">
                  <button
                    onClick={() => {
                      setIsSizeDropdownOpen(!isSizeDropdownOpen);
                      setIsColorDropdownOpen(false);
                    }}
                    className="w-full bg-black/20 backdrop-blur-sm border border-white/20 rounded-full px-4 py-3 text-sm font-medium text-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/40 focus:bg-black/30 transition-all duration-200 text-center hover:bg-black/30 flex items-center justify-between"
                  >
                    <span className="flex-1 text-left">{selectedSize || 'Talla'}</span>
                    <FiChevronDown className={`h-4 w-4 text-white/80 transition-transform duration-200 ${isSizeDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {/* Dropdown de tallas */}
                  {isSizeDropdownOpen && (
                    <div 
                      ref={sizeDropdownRef}
                      className="absolute bottom-full left-0 right-0 mb-2 bg-black/90 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl z-50 max-h-48 overflow-y-auto hide-scrollbar"
                    >
                      {getAvailableSizes().map((tallaInfo, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setSelectedSize(tallaInfo.talla);
                            closeSizeDropdown();
                          }}
                          disabled={!tallaInfo.disponible}
                          className={`w-full px-4 py-3 text-sm font-medium text-left first:rounded-t-2xl last:rounded-b-2xl ${
                            !tallaInfo.disponible 
                              ? 'text-white/40 cursor-not-allowed' 
                              : selectedSize === tallaInfo.talla
                                ? 'bg-white/20 text-white'
                                : 'text-white/80 hover:bg-white/10'
                          }`}
                        >
                          {tallaInfo.talla} {!tallaInfo.disponible ? '(Agotado)' : ''}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Color seleccionado */}
                <div className="relative dropdown-container">
                  <button
                    onClick={() => {
                      setIsColorDropdownOpen(!isColorDropdownOpen);
                      setIsSizeDropdownOpen(false);
                    }}
                    className="w-full bg-black/20 backdrop-blur-sm border border-white/20 rounded-full px-4 py-3 text-sm font-medium text-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/40 focus:bg-black/30 transition-all duration-200 text-center hover:bg-black/30 flex items-center justify-between"
                  >
                    <span className="flex-1 text-left">{selectedColor || 'Color'}</span>
                    <FiChevronDown className={`h-4 w-4 text-white/80 transition-transform duration-200 ${isColorDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {/* Dropdown de colores */}
                  {isColorDropdownOpen && (
                    <div 
                      ref={colorDropdownRef}
                      className="absolute bottom-full left-0 right-0 mb-2 bg-black/90 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl z-50 max-h-48 overflow-y-auto hide-scrollbar"
                    >
                      {getAvailableColors().map((colorInfo, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setSelectedColor(colorInfo.nombre);
                            closeColorDropdown();
                          }}
                          disabled={!colorInfo.disponible}
                          className={`w-full px-4 py-3 text-sm font-medium text-left first:rounded-t-2xl last:rounded-b-2xl flex items-center gap-3 ${
                            !colorInfo.disponible 
                              ? 'text-white/40 cursor-not-allowed' 
                              : selectedColor === colorInfo.nombre
                                ? 'bg-white/20 text-white'
                                : 'text-white/80 hover:bg-white/10'
                          }`}
                        >
                          <div 
                            className="w-4 h-4 rounded-full border border-white/30"
                            style={{ backgroundColor: colorInfo.codigo }}
                          />
                          {colorInfo.nombre} {!colorInfo.disponible ? '(Agotado)' : ''}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-white/20 backdrop-blur-md text-white py-4 rounded-full font-medium hover:bg-white/30 transition-all duration-200 flex items-center justify-between px-6 border border-white/30 cursor-pointer relative z-10"
                  type="button"
                >
                  <span>Add to Cart</span>
                  <FiShoppingCart className="h-5 w-5" />
                </button>
              </div>

              {/* Descripción del producto */}
              <div ref={descriptionSectionRef} className="mb-6">
                <p className="text-white/90 text-sm font-normal leading-relaxed">
                  {producto?.description || 'Descripción del producto no disponible.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Modo fullscreen */}
      {isFullscreen && (
        <div 
          className="fixed inset-0 z-50 bg-black select-none"
          style={{ touchAction: 'none' }}
          onTouchStart={handleFullscreenTouchStart}
          onTouchMove={handleFullscreenTouchMove}
          onTouchEnd={handleFullscreenTouchEnd}
        >
          {/* Imagen con zoom */}
          <div className="relative w-full h-full flex items-center justify-center">
            {producto?.images?.[currentImageIndex] && (
              <Image
                src={producto.images[currentImageIndex].url}
                alt={producto.images[currentImageIndex].altText || producto?.title || 'Product image'}
                width={800}
                height={800}
                className="max-w-full max-h-full object-contain transition-opacity duration-300"
                style={{
                  transform: `scale(${zoomLevel}) translate(${imagePosition.x}px, ${imagePosition.y}px)`,
                  transition: isDragging ? 'none' : 'transform 0.3s ease-out'
                }}
                priority
              />
            )}
          </div>
          
          {/* Controles de navegación en fullscreen */}
          {producto?.images && producto.images.length > 1 && (
            <>
              <button
                onClick={() => setCurrentImageIndex(prev => 
                  prev === 0 ? producto.images.length - 1 : prev - 1
                )}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 backdrop-blur-sm text-white p-4 rounded-full hover:bg-black/70 transition-all duration-200"
                aria-label="Imagen anterior"
              >
                <FiArrowLeft className="h-6 w-6" />
              </button>
              <button
                onClick={() => setCurrentImageIndex(prev => 
                  prev === producto.images.length - 1 ? 0 : prev + 1
                )}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 backdrop-blur-sm text-white p-4 rounded-full hover:bg-black/70 transition-all duration-200"
                aria-label="Siguiente imagen"
              >
                <FiArrowLeft className="h-6 w-6 rotate-180" />
              </button>
            </>
          )}
          
          {/* Indicadores en fullscreen */}
          {producto?.images && producto.images.length > 1 && (
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {producto.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`transition-all duration-500 ease-in-out transform ${
                    index === currentImageIndex 
                      ? 'w-8 h-2 bg-white scale-100' 
                      : 'w-2 h-2 bg-white/60 hover:bg-white/80 scale-100 hover:scale-110'
                  } rounded-full`}
                  aria-label={`Ver imagen ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Botón salir fullscreen */}
      {isFullscreen && (
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={() => {
              setIsFullscreen(false);
              setImagePosition({ x: 0, y: 0 });
              setZoomLevel(1);
              setIsDragging(false);
            }}
            className="bg-black/50 backdrop-blur-sm text-white p-3 rounded-full hover:bg-black/70 transition-all duration-200"
            aria-label="Cerrar vista completa"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}