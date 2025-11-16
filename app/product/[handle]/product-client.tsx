'use client';

import { useCart } from 'components/cart/cart-context';
import LinkWithTransition from 'components/link-with-transition';
import NewsletterForm from 'components/newsletter-form';
import { useLanguage } from 'components/providers/language-provider';
import SplitText from 'components/SplitText';
import { gsap } from 'gsap';
import type { Product } from 'lib/shopify/types';
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { FiArrowLeft, FiChevronDown, FiMinus, FiPlus, FiShare2, FiShoppingCart, FiX } from 'react-icons/fi';

interface ProductClientProps {
  producto: Product;
  recommendedProducts?: Product[];
  otherProducts?: Product[];
}

export default function ProductClient({ producto, recommendedProducts = [], otherProducts = [] }: ProductClientProps) {
  const router = useRouter();
  const { addCartItem } = useCart();
  const { t } = useLanguage();
  // Estados para la galería de imágenes
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [zoomLevel, setZoomLevel] = useState(1);
  const [lastPinchDistance, setLastPinchDistance] = useState(0);
  
  // Estados para el producto
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [showFullDetails, setShowFullDetails] = useState(false);
  
  // Estados para dropdowns personalizados
  const [isSizeDropdownOpen, setIsSizeDropdownOpen] = useState(false);
  const [isColorDropdownOpen, setIsColorDropdownOpen] = useState(false);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  
  // Refs para dropdowns animados
  const sizeDropdownRef = useRef<HTMLDivElement>(null);
  const colorDropdownRef = useRef<HTMLDivElement>(null);
  const descriptionAccordionRef = useRef<HTMLDivElement>(null);
  const descriptionDesktopRef = useRef<HTMLDivElement>(null);
  
  // Refs para animación staggered del panel derecho
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const priceRef = useRef<HTMLDivElement>(null);
  const shippingRef = useRef<HTMLParagraphElement>(null);
  const colorLabelRef = useRef<HTMLLabelElement>(null);
  const colorButtonsRef = useRef<HTMLDivElement>(null);
  const sizeLabelRef = useRef<HTMLLabelElement>(null);
  const sizeButtonsRef = useRef<HTMLDivElement>(null);
  const quantityLabelRef = useRef<HTMLLabelElement>(null);
  const quantityControlsRef = useRef<HTMLDivElement>(null);
  const addToCartRef = useRef<HTMLDivElement>(null);
  const productDetailsRef = useRef<HTMLButtonElement>(null);
  const shareButtonRef = useRef<HTMLButtonElement>(null);
  const productImageRef = useRef<HTMLDivElement>(null);
  
  // Refs para evitar que las animaciones se ejecuten múltiples veces
  // Usamos sessionStorage para persistir entre re-renders causados por revalidateTag
  const hasAnimatedImage = useRef(false);
  const hasAnimatedPanel = useRef(false);
  const currentProductId = useRef<string | null>(null);
  
  // Resetear refs cuando cambia el producto (navegación a otro producto)
  useEffect(() => {
    if (producto?.id && currentProductId.current !== producto.id) {
      currentProductId.current = producto.id;
      hasAnimatedImage.current = false;
      hasAnimatedPanel.current = false;
    }
  }, [producto?.id]);

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

  // Pre-cargar solo la imagen actual y las adyacentes (solo en escritorio)
  useEffect(() => {
    if (!producto?.images || producto.images.length === 0 || typeof window === 'undefined') return;
    
    // Verificar si estamos en escritorio
    const isDesktop = window.innerWidth >= 768;
    if (!isDesktop) return;

    // Limpiar preloads anteriores que no se estén usando
    const allPreloads = document.querySelectorAll('link[rel="preload"][as="image"]');
    const currentImageUrls = new Set([
      producto.images[currentImageIndex]?.url,
      producto.images[currentImageIndex + 1 >= producto.images.length ? 0 : currentImageIndex + 1]?.url,
      producto.images[currentImageIndex - 1 < 0 ? producto.images.length - 1 : currentImageIndex - 1]?.url
    ].filter(Boolean));

    // Remover preloads que ya no son necesarios
    allPreloads.forEach((link) => {
      const href = link.getAttribute('href');
      if (href && !currentImageUrls.has(href) && href.includes('cdn.shopify.com')) {
        link.remove();
      }
    });

    // Pre-cargar solo la imagen actual y las adyacentes
    const imagesToPreload = [
      producto.images[currentImageIndex]?.url, // Imagen actual
      producto.images[currentImageIndex + 1 >= producto.images.length ? 0 : currentImageIndex + 1]?.url, // Siguiente
      producto.images[currentImageIndex - 1 < 0 ? producto.images.length - 1 : currentImageIndex - 1]?.url // Anterior
    ].filter(Boolean);

    imagesToPreload.forEach((imageUrl) => {
      if (imageUrl) {
        // Verificar si ya existe un preload para esta imagen
        const existingLink = document.querySelector(`link[rel="preload"][as="image"][href="${imageUrl}"]`);
        if (!existingLink) {
          const link = document.createElement('link');
          link.rel = 'preload';
          link.as = 'image';
          link.href = imageUrl;
          document.head.appendChild(link);
        }
      }
    });
  }, [currentImageIndex, producto?.images]);

  // Animación de la imagen del producto (solo desktop)
  useEffect(() => {
    if (typeof window === 'undefined' || !producto?.id) return;
    const isDesktop = window.innerWidth >= 768;
    if (!isDesktop || !productImageRef.current) return;

    // Verificar si ya se animó en esta sesión (solo evitar si ya se ejecutó en este render)
    if (hasAnimatedImage.current) return;

    // Configurar estado inicial: slide desde la izquierda con fade
    gsap.set(productImageRef.current, {
      opacity: 0,
      y: 100,
    });

    // Animar: slide in con fade
    gsap.to(productImageRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
      delay: 0.3,
      onComplete: () => {
        hasAnimatedImage.current = true;
        if (typeof window !== 'undefined' && producto?.id) {
          sessionStorage.setItem(`product-animated-image-${producto.id}`, 'true');
        }
      }
    });

    return () => {
      if (productImageRef.current) {
        gsap.killTweensOf(productImageRef.current);
      }
    };
  }, [producto?.id]);

  // Animación staggered del panel derecho (solo desktop)
  useEffect(() => {
    if (typeof window === 'undefined' || !producto?.id) return;
    const isDesktop = window.innerWidth >= 768;
    if (!isDesktop) return;

    // Verificar si ya se animó en esta sesión (solo evitar si ya se ejecutó en este render)
    if (hasAnimatedPanel.current) return;

    const elements = [
      priceRef.current,
      shippingRef.current,
      colorLabelRef.current,
      colorButtonsRef.current,
      sizeLabelRef.current,
      sizeButtonsRef.current,
      quantityLabelRef.current,
      quantityControlsRef.current,
      addToCartRef.current,
      productDetailsRef.current,
      shareButtonRef.current,
    ].filter(Boolean);

    if (elements.length === 0) return;

    // Configurar estado inicial
    gsap.set(elements, {
      opacity: 0,
      y: 30,
    });

    // Animar con stagger
    const tl = gsap.timeline({ delay: 0.8 }); // Delay para que aparezca después del título
    tl.to(elements, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power3.out',
      stagger: 0.08,
      onComplete: () => {
        hasAnimatedPanel.current = true;
        if (typeof window !== 'undefined' && producto?.id) {
          sessionStorage.setItem(`product-animated-panel-${producto.id}`, 'true');
        }
      }
    });

    return () => {
      gsap.killTweensOf(elements);
    };
  }, [producto?.id]);

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

  // Animaciones GSAP para acordeón de descripción
  useEffect(() => {
    const accordionRef = descriptionDesktopRef.current || descriptionAccordionRef.current;
    if (!accordionRef) return;

    if (isDescriptionOpen) {
      // Abrir acordeón
      gsap.set(accordionRef, { height: 0, opacity: 0, overflow: 'hidden' });
      const height = accordionRef.scrollHeight;
      gsap.to(accordionRef, {
        height: height,
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out',
        onComplete: () => {
          gsap.set(accordionRef, { height: 'auto', overflow: 'visible' });
        }
      });
    } else {
      // Cerrar acordeón
      const height = accordionRef.scrollHeight;
      gsap.set(accordionRef, { height: height, overflow: 'hidden' });
      gsap.to(accordionRef, {
        height: 0,
        opacity: 0,
        duration: 0.5,
        ease: 'power4.out'
      });
    }
  }, [isDescriptionOpen]);


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

  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const shareData = {
      title: producto?.title || 'Product',
      text: producto?.description || '',
      url: url
    };

    try {
      // Intentar usar la Web Share API si está disponible
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        // Fallback: copiar al portapapeles
        await navigator.clipboard.writeText(url);
        alert('Link copiado al portapapeles!');
      }
    } catch (error: any) {
      // Si el usuario cancela, no hacer nada
      if (error.name !== 'AbortError') {
        // Si falla, intentar copiar al portapapeles como fallback
        try {
          await navigator.clipboard.writeText(url);
          alert('Link copiado al portapapeles!');
        } catch (clipboardError) {
          console.error('Error compartiendo:', clipboardError);
        }
      }
    }
  };

  const handleAddToCart = async () => {
    if (!producto?.variants || producto.variants.length === 0) {
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
      return;
    }

    if (!selectedVariant.availableForSale) {
      return;
    }

    // Agregar al carrito
    try {
      // Agregar la cantidad seleccionada al carrito de una vez
      await addCartItem(selectedVariant, producto, quantity);
    } catch (error) {
      console.error('❌ Error agregando producto al carrito:', error);
    }
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
      {/* Video de fondo - Solo en escritorio */}
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

      {/* Fondo blanco para móvil */}
      <div className="md:hidden fixed inset-0 bg-white" style={{ zIndex: -1 }}></div>

      {/* Galería de imágenes móvil con swipe */}
      {!isFullscreen && producto?.images && producto.images.length > 0 && (
        <div 
          className="md:hidden fixed top-0 left-0 right-0 w-full select-none overflow-hidden"
          style={{ zIndex: 0, touchAction: 'pan-y', height: 'calc(100vh - 180px)', bottom: '180px' }}
          onTouchStart={(e) => {
            if (e.touches.length === 1) {
              const touch = e.touches[0];
              if (touch) {
                setTouchStart({ x: touch.clientX, y: touch.clientY });
              }
            }
          }}
          onTouchMove={(e) => {
            if (touchStart && e.touches.length === 1 && !isTransitioning) {
              const touch = e.touches[0];
              if (touch) {
                const deltaX = touch.clientX - touchStart.x;
                const deltaY = touch.clientY - touchStart.y;
                
                // Solo prevenir scroll si el movimiento es predominantemente horizontal
                if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
                  e.preventDefault();
                }
              }
            }
          }}
          onTouchEnd={(e) => {
            if (touchStart && e.changedTouches.length === 1 && !isTransitioning) {
              const touch = e.changedTouches[0];
              if (touch) {
                const deltaX = touch.clientX - touchStart.x;
                const deltaY = touch.clientY - touchStart.y;
                const swipeThreshold = 50;
              
              // Determinar si es swipe horizontal
              if (Math.abs(deltaX) > swipeThreshold && Math.abs(deltaX) > Math.abs(deltaY)) {
                setIsTransitioning(true);
                
                if (deltaX < 0) {
                  // Swipe izquierda - siguiente imagen
                  setCurrentImageIndex((prev) => {
                    const nextIndex = prev + 1;
                    // Si es infinito, cuando llega al final vuelve a 0 sin animación visible
                    return nextIndex >= (producto?.images?.length || 0) ? 0 : nextIndex;
                  });
                } else {
                  // Swipe derecha - imagen anterior
                  setCurrentImageIndex((prev) => {
                    const prevIndex = prev - 1;
                    // Si es infinito, cuando llega al inicio va al final sin animación visible
                    return prevIndex < 0 ? (producto?.images?.length || 0) - 1 : prevIndex;
                  });
                }
                
                // Reset de transición después de un breve delay
                setTimeout(() => setIsTransitioning(false), 300);
                }
              }
              
              setTouchStart(null);
            }
          }}
        >
          {/* Contenedor de imágenes con transición infinita */}
          <div 
            className="flex h-full transition-transform duration-300 ease-out"
            style={{
              transform: `translateX(-${currentImageIndex * 100}vw)`
            }}
          >
            {producto.images.map((imagen, index) => (
              <div 
                key={index} 
                className="h-full flex-shrink-0 relative"
                style={{ width: '100vw', minWidth: '100vw' }}
              >
                <Image
                  src={imagen.url}
                  alt={imagen.altText || producto?.title || 'Product image'}
                  fill
                  className="object-cover"
                  priority={index === 0}
                  sizes="100vw"
                  onClick={() => setIsFullscreen(true)}
                />
              </div>
            ))}
          </div>
          
          {/* Indicadores de fotos - Abajo del header */}
          {producto.images.length > 1 && (
            <div className="absolute top-24 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
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


      {/* Card de producto - Solo en escritorio */}
      <div className="hidden md:flex relative z-10 items-center justify-center p-8 pt-40 min-h-screen px-4">
        <div className="w-full max-w-7xl mx-auto bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="flex">
            {/* Columna izquierda - Imagen */}
            <div className="w-1/2 relative overflow-hidden flex-shrink-0">
              <div 
                className="relative w-full aspect-square min-h-[600px] cursor-pointer"
                onClick={() => setIsFullscreen(true)}
              >
                <div ref={productImageRef} className="relative w-full h-full">
                  <Image
                    src={producto?.images?.[currentImageIndex]?.url || '/img1.jpg'}
                    alt={producto?.images?.[currentImageIndex]?.altText || producto?.title || 'Product image'}
                    fill
                    className="object-cover"
                    style={{ objectFit: 'cover' }}
                    sizes="50vw"
                    priority
                    loading="eager"
                  />
                </div>
                {/* Indicadores */}
                <div 
                  className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3 bg-black/30 backdrop-blur-md rounded-full px-6 py-3 border border-white/20 z-20"
                  onClick={(e) => e.stopPropagation()}
                >
                  {producto?.images?.map((_, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentImageIndex(index);
                      }}
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
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(prev => 
                    prev === 0 ? (producto?.images?.length || 1) - 1 : prev - 1
                    );
                  }}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-all duration-200 z-20"
                >
                  <FiArrowLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(prev => 
                    prev === (producto?.images?.length || 1) - 1 ? 0 : prev + 1
                    );
                  }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-all duration-200 z-20"
                >
                  <FiArrowLeft className="h-4 w-4 rotate-180" />
                </button>
              </div>
            </div>

            {/* Columna derecha - Controles */}
            <div ref={rightPanelRef} className="w-1/2 p-8 flex flex-col justify-between relative z-20 flex-shrink-0">
              <div>
                <div className="mb-6">
                <div className="max-w-xs mx-auto">
                  <div className="slide-title mb-2" style={{ overflow: 'visible', lineHeight: '1.2' }}>
                    <SplitText
                      text={producto?.title || ''}
                      className="text-3xl font-bold text-white"
                      delay={500}
                      duration={1}
                      ease="power4.out"
                      splitType="words"
                      threshold={0.1}
                      rootMargin="-100px"
                      textAlign="left"
                    />
                  </div>
                    <div ref={priceRef} className="flex items-baseline space-x-3 mb-2">
                    <span className="text-2xl font-bold text-white">{formatPrice(producto?.priceRange?.maxVariantPrice)}</span>
                  </div>
                    <p ref={shippingRef} className="text-white/60 text-[10px] leading-relaxed text-left mb-6">
                      <LinkWithTransition href="/shipping-policy" className="underline hover:text-white/80 transition-colors">
                        {t('product.shipping')}
                      </LinkWithTransition> {t('product.shippingCalculated')}.
                  </p>
                </div>
              </div>

                <div className="space-y-6 flex flex-col items-center">
                {/* Selectores de color */}
                  <div className="max-w-xs w-full">
                  <label ref={colorLabelRef} className="block text-white/90 text-sm font-semibold mb-4 uppercase tracking-wider text-left">{t('product.color')}</label>
                  <div ref={colorButtonsRef} className="flex relative justify-start">
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
                  <label ref={sizeLabelRef} className="block text-white/90 text-sm font-semibold mb-4 uppercase tracking-wider text-left">{t('product.size')}</label>
                  <div ref={sizeButtonsRef} className="flex space-x-2 justify-start">
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

                  {/* Selector de cantidad */}
                  <div className="max-w-xs w-full">
                    <label ref={quantityLabelRef} className="block text-white/90 text-sm font-semibold mb-4 uppercase tracking-wider text-left">{t('product.quantity')}</label>
                    <div ref={quantityControlsRef} className="flex items-center justify-start gap-4">
                      <button
                        onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                        className="w-10 h-10 rounded-full border-2 border-white/30 text-white/90 hover:border-white/50 hover:text-white transition-all duration-200 flex items-center justify-center"
                        type="button"
                      >
                        <FiMinus className="h-4 w-4" />
                      </button>
                      <span className="text-white text-lg font-medium min-w-[2rem] text-center">{quantity}</span>
                      <button
                        onClick={() => setQuantity(prev => prev + 1)}
                        className="w-10 h-10 rounded-full border-2 border-white/30 text-white/90 hover:border-white/50 hover:text-white transition-all duration-200 flex items-center justify-center"
                        type="button"
                      >
                        <FiPlus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botón agregar al carrito */}
              <div ref={addToCartRef} className="flex justify-center mt-8">
                <div className="max-w-xs w-full">
                  <button
                    onClick={handleAddToCart}
                    className="w-full bg-white/20 backdrop-blur-md text-white py-4 rounded-full font-medium hover:bg-white/30 transition-all duration-200 flex items-center justify-between px-6 border border-white/30 cursor-pointer relative z-10"
                    type="button"
                  >
                    <span>{t('product.addToCart')}</span>
                    <FiShoppingCart className="h-5 w-5" />
                  </button>
        </div>
      </div>

              {/* Acordeón de descripción - Escritorio */}
              <div className="flex justify-center mt-6">
                <div className="max-w-xs w-full">
          <button 
                    ref={productDetailsRef}
                    onClick={() => setIsDescriptionOpen(!isDescriptionOpen)}
                    className="w-full flex items-center justify-between py-3 border-t border-b border-white/20 text-white/90 hover:text-white transition-colors"
          >
                    <span className="text-sm font-medium uppercase tracking-wider">{t('product.details')}</span>
                    <FiChevronDown 
                      className={`h-4 w-4 transition-transform duration-300 ${isDescriptionOpen ? 'rotate-180' : ''}`}
                    />
          </button>
                  <div 
                    ref={descriptionDesktopRef}
                    className="overflow-hidden"
                    style={{ height: 0, opacity: 0 }}
                  >
                    <p className="text-white/85 text-base leading-relaxed text-left pt-4">
                      {producto?.description || t('product.descriptionNotAvailable')}
                    </p>
        </div>
                  
                  {/* Botón Share */}
              <button
                    ref={shareButtonRef}
                    onClick={handleShare}
                    className="w-full flex items-center justify-between py-4 mt-2 text-white/90 hover:text-white transition-colors"
                    aria-label="Compartir producto"
                  >
                    <div className="flex items-center gap-2">
                      <FiShare2 className="h-4 w-4" />
                      <span className="text-sm font-medium uppercase tracking-wider">{t('product.share')}</span>
                    </div>
              </button>
          </div>
              </div>
            </div>
          </div>
                </div>
              </div>



      {/* Card móvil con nombre del producto */}
      {!isFullscreen && (
        <div className="md:hidden fixed left-0 right-0 w-full z-20" style={{ bottom: '180px' }}>
          <div className="bg-white rounded-t-[50px] shadow-2xl border-t border-black/10 p-6">
            <div className="flex items-center justify-between gap-4 mb-4">
              <h1 className="text-lg font-bold text-black text-left flex-1">
                {producto?.title}
              </h1>
                  <button
                onClick={handleShare}
                className="flex-shrink-0 p-2 hover:bg-black/5 rounded-full transition-all duration-200"
                aria-label="Compartir producto"
              >
                <FiShare2 className="h-5 w-5 text-black" />
                  </button>
            </div>
            <button
              onClick={() => setIsDetailsModalOpen(true)}
              className="w-full text-left text-sm font-medium text-black/70 hover:text-black transition-colors uppercase tracking-wider"
            >
              {t('product.detailsMobile')}
            </button>
          </div>
        </div>
      )}

      {/* Card móvil fijo en la parte inferior */}
      {!isFullscreen && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 w-full" id="bottom-card">
          <div className="bg-black rounded-t-[50px] shadow-2xl border-t border-white/10 p-8">
            {/* Fila 1: Selects de Talla y Color */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {/* Select de Talla */}
              <div className="relative">
                <select
                  value={selectedSize || ''}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="w-full bg-white/10 border border-white/30 rounded-full px-4 py-4 text-base font-medium text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-white/50 transition-all duration-200"
                >
                  <option value="" className="bg-black text-white" disabled>{t('product.sizePlaceholder')}</option>
                      {getAvailableSizes().map((tallaInfo, index) => (
                    <option
                          key={index}
                      value={tallaInfo.talla}
                          disabled={!tallaInfo.disponible}
                      className="bg-black text-white"
                        >
                          {tallaInfo.talla} {!tallaInfo.disponible ? t('product.outOfStock') : ''}
                    </option>
                      ))}
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <FiChevronDown className="h-4 w-4 text-white/70" />
                    </div>
                </div>

              {/* Select de Color */}
              <div className="relative">
                <select
                  value={selectedColor || ''}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="w-full bg-white/10 border border-white/30 rounded-full px-4 py-4 text-base font-medium text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-white/50 transition-all duration-200"
                >
                  <option value="" className="bg-black text-white" disabled>{t('product.colorPlaceholder')}</option>
                      {getAvailableColors().map((colorInfo, index) => (
                    <option
                          key={index}
                      value={colorInfo.nombre}
                          disabled={!colorInfo.disponible}
                      className="bg-black text-white"
                    >
                          {colorInfo.nombre} {!colorInfo.disponible ? t('product.outOfStock') : ''}
                    </option>
                      ))}
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <FiChevronDown className="h-4 w-4 text-white/70" />
                    </div>
                </div>
              </div>

            {/* Fila 2: Precio y Add to Cart */}
            <div className="flex items-center justify-between gap-4">
              {/* Precio a la izquierda */}
              <div className="flex-1">
                <span className="text-2xl font-bold text-white">
                  {formatPrice(producto?.priceRange?.maxVariantPrice)}
                </span>
              </div>

              {/* Botón Add to Cart a la derecha */}
                <button
                  onClick={handleAddToCart}
                disabled={!selectedSize || !selectedColor}
                className="flex-1 bg-white text-black py-4 px-6 rounded-full font-medium hover:bg-white/90 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  type="button"
                >
                  <span>{t('product.addToCart')}</span>
                <FiShoppingCart className="h-4 w-4" />
                </button>
              </div>
          </div>
        </div>
      )}

      {/* Modal de Product Details - Pantalla completa */}
      {isDetailsModalOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black">
          <div className="h-full flex flex-col">
            {/* Header del modal */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-xl font-bold text-white uppercase tracking-wider">
                {t('product.detailsMobile')}
              </h2>
              <button
                onClick={() => setIsDetailsModalOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-all duration-200"
                aria-label="Cerrar modal"
              >
                <FiX className="h-6 w-6 text-white" />
              </button>
            </div>

            {/* Contenido del modal */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="text-white/90 text-base leading-relaxed whitespace-pre-wrap">
                  {producto?.description || t('product.descriptionNotAvailable')}
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

      {/* Carruseles de productos recomendados - Solo en escritorio */}
      {!isFullscreen && (
        <div className="hidden md:flex w-full justify-center items-center py-8 px-4 md:px-8">
          <div className="w-full max-w-7xl mx-auto bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6 md:p-8">
            {/* Título "You may also love" */}
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center md:text-left uppercase tracking-wider">
              {t('product.youMayAlsoLove')}
            </h2>
            
            {/* Layout de dos columnas: productos a la izquierda, newsletter a la derecha */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:items-start">
              {/* Columna izquierda: Carrusel de productos */}
              {recommendedProducts && recommendedProducts.length > 0 && (
                <div className="md:col-span-2">
                  <div className="w-full flex justify-center">
                    <div className={`grid gap-6 md:gap-6 w-full ${
                      recommendedProducts.length === 1 
                        ? 'grid-cols-1 justify-items-center' 
                        : recommendedProducts.length === 2 
                        ? 'grid-cols-1 md:grid-cols-2 justify-items-center'
                        : recommendedProducts.length === 3 
                        ? 'grid-cols-1 md:grid-cols-3 justify-items-center'
                        : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4 justify-items-center'
                    }`}>
                      {recommendedProducts.slice(0, 4).map((product, index) => {
                        // Ya no necesitamos centrar con col-start porque usamos grid-cols apropiado
                    // Obtener segunda imagen si existe
                    const featuredImageUrl = product.featuredImage?.url;
                    const secondImage = product.images?.find(img => img.url !== featuredImageUrl);
                    const hoverImage = secondImage?.url || product.images?.[1]?.url || featuredImageUrl;

                      return (
                        <LinkWithTransition
                          key={product.handle}
                          href={`/product/${product.handle}`}
                          className="group cursor-pointer w-full max-w-[280px]"
                        >
                        <div className="relative aspect-square bg-white/5 rounded-lg overflow-hidden mb-4 w-full">
                          {product.featuredImage && (
                            <>
                              {/* Imagen principal */}
                              <Image
                                src={product.featuredImage.url}
                                alt={product.title}
                                fill
                                className="object-cover transition-opacity duration-300 group-hover:opacity-0"
                                sizes="(min-width: 768px) 25vw, 50vw"
                              />
                              {/* Segunda imagen en hover */}
                              {hoverImage && hoverImage !== product.featuredImage.url && (
                                <Image
                                  src={hoverImage}
                                  alt={product.title}
                                  fill
                                  className="object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100 absolute inset-0"
                                  sizes="(min-width: 768px) 25vw, 50vw"
                                />
                              )}
                            </>
                          )}
                        </div>
                        <h3 className="text-white text-sm md:text-base font-medium mb-1 line-clamp-1 text-center">
                          {product.title}
                        </h3>
                        <p className="text-white/70 text-xs md:text-sm text-center">
                          {formatPrice(product.priceRange?.maxVariantPrice)}
                        </p>
                      </LinkWithTransition>
                    );
                  })}
                </div>
                </div>
              </div>
              )}
              
              {/* Columna derecha: Newsletter */}
              <div className="md:col-span-1 flex flex-col justify-start md:self-start">
                <div className="text-center md:text-left">
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-3 uppercase tracking-wider">
                    {t('newsletter.bePartOfMovement')}
                  </h3>
                  <p className="text-white/80 text-sm md:text-base mb-6">
                    {t('newsletter.description')}
                  </p>
                  <NewsletterForm />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}