'use client';

import { useCart } from 'components/cart/cart-context';
import LinkWithTransition from 'components/link-with-transition';
import NewsletterForm from 'components/newsletter-form';
import { useLanguage } from 'components/providers/language-provider';
import SplitText from 'components/SplitText';
import { gsap } from 'gsap';
import shopifyLoader from 'lib/image-loader';
import type { Metaobject, Product } from 'lib/shopify/types';
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { FiArrowLeft, FiChevronDown, FiMinus, FiPlus, FiShare2, FiShoppingCart, FiX } from 'react-icons/fi';

interface ProductClientProps {
  producto: Product;
  recommendedProducts?: Product[];
  otherProducts?: Product[];
  colorsMetaobjects?: Metaobject[];
}

export default function ProductClient({ producto, recommendedProducts = [], otherProducts = [], colorsMetaobjects = [] }: ProductClientProps) {
  const router = useRouter();
  const { addCartItem } = useCart();
  const { t } = useLanguage();
  // Estados para la galería de imágenes
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [zoomLevel, setZoomLevel] = useState(1);
  const [lastPinchDistance, setLastPinchDistance] = useState(0);

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

  // Extraer colores únicos de las variantes
  const getAvailableColors = () => {
    if (!producto?.variants) return [];

    const colorMap = new Map();
    producto.variants.forEach((variant) => {
      const colorOption = variant.selectedOptions?.find(option =>
        option.name.toLowerCase().includes('color') ||
        option.name.toLowerCase().includes('colour')
      );

      if (colorOption) {
        const colorName = colorOption.value;
        const isAvailable = variant.availableForSale;

        // 1. Intentar buscar en Metaobjetos
        let variantImage = null;
        if (colorsMetaobjects?.length) {
          const metaobject = colorsMetaobjects.find(m =>
            m.label?.toLowerCase() === colorName.toLowerCase() ||
            m.handle.toLowerCase() === colorName.toLowerCase()
          );
          if (metaobject?.image?.url) {
            variantImage = metaobject.image.url;
          }
        }

        // 2. Si no hay en Metaobjetos, usar lógica anterior (Variant Image)
        if (!variantImage) {
          variantImage = variant.image?.url;
        }

        // 3. Fallback: buscar por Alt Text en las imágenes del producto
        if (!variantImage && producto.images) {
          const colorImage = producto.images.find(img =>
            img.altText?.toLowerCase() === colorName.toLowerCase() ||
            img.altText?.toLowerCase().includes(`color: ${colorName.toLowerCase()}`)
          );
          if (colorImage) {
            variantImage = colorImage.url;
          }
        }

        // 4. Fallback final: imagen principal
        variantImage = variantImage || producto.featuredImage?.url;

        if (!colorMap.has(colorName)) {
          colorMap.set(colorName, {
            nombre: colorName,
            imagen: variantImage,
            codigo: getColorCode(colorName),
            disponible: isAvailable
          });
        } else {
          // Si ya existe, actualizar disponibilidad (si alguna variante está disponible)
          const existing = colorMap.get(colorName);
          if (isAvailable) {
            existing.disponible = true;
            // Si esta variante disponible tiene imagen (y la existente no, o es peor), actualizarla
            // Priorizamos: Metaobjeto > Variante especifica > Alt text > General
            if (variant.image?.url && !colorsMetaobjects?.some(m => m.label?.toLowerCase() === colorName.toLowerCase())) {
              existing.imagen = variant.image.url;
            }
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
    producto.variants.forEach((variant) => {
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

  // Estados para el producto (Inicialización lazy para evitar flash)
  const [selectedVariant, setSelectedVariant] = useState<any>(() => {
    return producto?.variants?.[0] || null;
  });

  const [selectedColor, setSelectedColor] = useState(() => {
    const colors = getAvailableColors();
    return colors.length > 0 ? colors[0].nombre : '';
  });

  const [selectedSize, setSelectedSize] = useState(() => {
    const sizes = getAvailableSizes();
    return sizes.length > 0 ? sizes[0].talla : '';
  });
  const [quantity, setQuantity] = useState(1);
  const [showFullDetails, setShowFullDetails] = useState(false);

  // Estados para dropdowns personalizados
  const [isSizeDropdownOpen, setIsSizeDropdownOpen] = useState(false);
  const [isColorDropdownOpen, setIsColorDropdownOpen] = useState(false);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Header sync state
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const lastScrollY = useRef(0);
  const galleryGridRef = useRef<HTMLDivElement>(null);

  // Sync sidebar with header visibility & Scroll Indicator
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Calculate progress based on Gallery Grid position
      if (galleryGridRef.current) {
        const rect = galleryGridRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const totalScrollable = rect.height - windowHeight;

        if (totalScrollable > 0) {
          // Adjust Start: Start counting when top of grid is near top of screen (e.g., 100px buffer)
          // Adjust End: End when bottom of grid hits bottom of screen
          const scrolled = -rect.top + 100; // Adding offset to start slightly earlier/smoother
          const percentage = (scrolled / totalScrollable) * 100;
          setScrollProgress(Math.min(100, Math.max(0, percentage)));
        } else {
          setScrollProgress(100); // If grid is smaller than screen, always full
        }
      }

      // Hide scroll indicator immediately on scroll
      if (currentScrollY > 100) {
        setShowScrollIndicator(false);
      } else {
        setShowScrollIndicator(true);
      }

      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        // Scrolling down & past threshold -> Header hides -> Sidebar moves up
        setIsHeaderVisible(false);
      } else {
        // Scrolling up -> Header shows -> Sidebar moves down
        setIsHeaderVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Filtrar imágenes basado en el color seleccionado (Rubik Variant manual)
  const galleryImages = useMemo(() => {
    if (!producto?.images) return [];
    if (!selectedColor) return producto.images;

    const normalizedColor = selectedColor.toLowerCase().trim();
    const matchingImages = producto.images.filter(img =>
      img.altText?.toLowerCase().trim() === normalizedColor
    );

    return matchingImages.length > 0 ? matchingImages : producto.images;
  }, [producto?.images, selectedColor]);

  // Resetear índice de imagen cuando cambia el color (y por tanto la galería)
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [selectedColor]);

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

      // Force scroll to top on product change with delay to beat browser restoration
      if (typeof window !== 'undefined') {
        const originalRestoration = window.history.scrollRestoration;
        window.history.scrollRestoration = 'manual';

        // Immediate reset
        window.scrollTo(0, 0);
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;

        // Delayed reset for transition finish
        const timer = setTimeout(() => {
          window.scrollTo(0, 0);
          window.history.scrollRestoration = originalRestoration; // Restore preference
        }, 100);

        return () => clearTimeout(timer);
      }
    }
  }, [producto?.id]);



  // Resetear estado si el producto cambia completamente (navegación)
  useEffect(() => {
    if (producto?.id && currentProductId.current !== producto.id) {
      // Si cambiamos de producto, podríamos necesitar resetear estados si no se desmonta el componente
      // Pero Next.js suele desmontar/remontar en navegación de rutas dinámicas.
      // Dejamos esto limpio por si acaso.
    }
  }, [producto?.id]);

  // Preload programático usando `new Image()` para evitar warnings de "unused preload"
  // y llenar la caché del navegador silenciosamente.
  useEffect(() => {
    if (!galleryImages || galleryImages.length === 0 || typeof window === 'undefined') return;

    const preloadImage = (img: any) => {
      if (!img?.url) return;
      const image = new window.Image();
      // Generar srcset simplificado para cubrir la mayoría de casos sin complejidad excesiva
      // Usamos el loader para obtener URLs válidas
      const widths = [640, 750, 828, 1080, 1200, 1920, 2048];
      const srcSet = widths
        .map(w => `${shopifyLoader({ src: img.url, width: w, quality: 75 })} ${w}w`)
        .join(', ');

      image.srcset = srcSet;
      image.sizes = window.innerWidth >= 768 ? '50vw' : '100vw';
      // Fallback src
      image.src = shopifyLoader({ src: img.url, width: 1080, quality: 75 });
    };

    // 1. Preload imagen actual
    preloadImage(galleryImages[currentImageIndex]);

    // 2. Preload siguiente imagen (predicción)
    const nextIndex = currentImageIndex + 1 < galleryImages.length ? currentImageIndex + 1 : 0;
    const nextImg = galleryImages[nextIndex];
    if (nextImg?.url && nextImg.url !== galleryImages[currentImageIndex]?.url) {
      preloadImage(nextImg);
    }
  }, [galleryImages, currentImageIndex]);

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
    if (!galleryImages) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setCurrentImageIndex((prevIndex) =>
          prevIndex === 0 ? (galleryImages.length || 1) - 1 : prevIndex - 1
        );
      } else if (e.key === 'ArrowRight') {
        setCurrentImageIndex((prevIndex) =>
          prevIndex === (galleryImages.length || 1) - 1 ? 0 : prevIndex + 1
        );
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [galleryImages]);


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
      // Override variant image with the currently displayed one (Rubik filtered)
      const variantWithImage = {
        ...selectedVariant,
        image: galleryImages[0] ? {
          url: galleryImages[0].url,
          altText: galleryImages[0].altText,
          width: galleryImages[0].width,
          height: galleryImages[0].height
        } : selectedVariant.image
      };

      // Agregar la cantidad seleccionada al carrito de una vez
      await addCartItem(variantWithImage, producto, quantity);
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
      {/* 1. Fondo Móvil: Blanco sólido */}
      <div className="fixed inset-0 bg-white -z-20 md:hidden" />

      {/* 2. Fondo Escritorio: Video Loop */}
      <video
        className="fixed inset-0 w-full h-full object-cover -z-20 hidden md:block"
        src="/Videoloop.mp4?v=2"
        autoPlay
        muted
        loop
        playsInline
      />

      {/* 3. Overlay Escritorio */}
      <div className="fixed inset-0 bg-black/20 -z-10 hidden md:block"></div>

      {/* LAYOUT MÓVIL (Scrollable) */}
      {!isFullscreen && (
        <div className="md:hidden w-full bg-white pb-10 pt-24">

          {/* 1. GALERÍA SWIPE CUSTOM (STRICT ONE-BY-ONE) */}
          <div
            className="relative w-full aspect-[3/4] bg-white overflow-hidden"
            style={{ touchAction: 'pan-y' }}
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
                        return nextIndex >= (galleryImages.length || 0) ? 0 : nextIndex;
                      });
                    } else {
                      // Swipe derecha - imagen anterior
                      setCurrentImageIndex((prev) => {
                        const prevIndex = prev - 1;
                        // Si es infinito, cuando llega al inicio va al final sin animación visible
                        return prevIndex < 0 ? (galleryImages.length || 0) - 1 : prevIndex;
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
            <div
              className="flex h-full transition-transform duration-300 ease-out"
              style={{
                transform: `translateX(-${currentImageIndex * 100}%)`
              }}
            >
              {galleryImages.map((imagen: any, index: number) => (
                <div
                  key={index}
                  className="w-full h-full flex-shrink-0 relative"
                  style={{ width: '100%' }}
                >
                  <Image
                    src={imagen.url}
                    alt={imagen.altText || producto?.title || 'Product image'}
                    fill
                    className="object-cover"
                    priority={index === currentImageIndex}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    onClick={() => setIsFullscreen(true)}
                    loader={shopifyLoader}
                  />
                </div>
              ))}
            </div>

            {/* Indicadores sobre la imagen */}
            {galleryImages && galleryImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10 bg-black/20 backdrop-blur-md px-3 py-2 rounded-full border border-white/10">
                {galleryImages.map((_, index) => (
                  <div
                    key={index}
                    className={`transition-all duration-300 rounded-full h-1.5 ${index === currentImageIndex
                      ? 'w-6 bg-white'
                      : 'w-1.5 bg-white/50'
                      }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* 2. INFO DEL PRODUCTO */}
          <div className="px-6 py-8">
            {/* Header: Título y Share */}
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-2xl font-bold text-black uppercase tracking-tight leading-tight">
                {producto?.title}
              </h1>
              <button
                onClick={handleShare}
                className="p-2 -mr-2 text-black/60 hover:text-black"
              >
                <FiShare2 className="w-5 h-5" />
              </button>
            </div>

            {/* Precio */}
            <div className="text-xl font-medium text-black/80 mb-8">
              {formatPrice(producto?.priceRange?.maxVariantPrice)}
            </div>

            {/* Selectores */}
            <div className="space-y-6 mb-8">
              {/* Talla */}
              <div>
                <label className="block text-xs font-bold text-black/40 uppercase tracking-widest mb-3">
                  {t('product.size')}
                </label>
                <div className="flex flex-wrap gap-2">
                  {getAvailableSizes().map((tallaInfo, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedSize(tallaInfo.talla)}
                      disabled={!tallaInfo.disponible}
                      className={`min-w-[40px] h-10 px-3 rounded-full border flex items-center justify-center text-sm font-medium transition-all ${selectedSize === tallaInfo.talla
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-black border-black/10 hover:border-black/30'
                        } ${!tallaInfo.disponible ? 'opacity-30 cursor-not-allowed bg-black/5 decoration-slice' : ''}`}
                    >
                      <span className={!tallaInfo.disponible ? 'line-through' : ''}>
                        {tallaInfo.talla}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Color */}
              <div>
                <label className="block text-xs font-bold text-black/40 uppercase tracking-widest mb-3">
                  {t('product.color')}
                </label>
                <div className="flex flex-wrap gap-2">
                  {getAvailableColors().map((colorInfo, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedColor(colorInfo.nombre)}
                      disabled={!colorInfo.disponible}
                      className={`relative w-10 h-10 rounded-full border border-black/20 flex items-center justify-center transition-all duration-300 ${selectedColor === colorInfo.nombre
                        ? 'ring-2 ring-black ring-offset-2 ring-offset-white scale-110'
                        : 'hover:scale-105'
                        } ${!colorInfo.disponible ? 'opacity-30 cursor-not-allowed' : ''}`}
                      style={{ backgroundColor: colorInfo.codigo }}
                      title={colorInfo.nombre}
                    >
                      <span className="sr-only">{colorInfo.nombre}</span>
                    </button>
                  ))}
                </div>
                {selectedColor && (
                  <div className="mt-2 text-xs text-black/60 font-medium ml-1">
                    {t('product.selected')}: {selectedColor}
                  </div>
                )}
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-xs font-bold text-black/40 uppercase tracking-widest mb-3">
                  {t('product.quantity')}
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                    className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center text-black hover:bg-black/5 transition-colors"
                  >
                    <FiMinus className="w-4 h-4" />
                  </button>
                  <span className="text-xl font-medium text-black min-w-[1.5rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(prev => prev + 1)}
                    className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center text-black hover:bg-black/5 transition-colors"
                  >
                    <FiPlus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={!selectedSize || !selectedColor}
              className="w-full bg-black text-white py-4 rounded-full font-bold text-lg mb-8 disabled:opacity-50 hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <span>{t('product.addToCart')}</span>
              <FiShoppingCart className="w-5 h-5" />
            </button>

            {/* Detalles / Descripción */}
            <div className="border-t border-black/5 pt-6">
              <button
                onClick={() => setIsDescriptionOpen(!isDescriptionOpen)}
                className="w-full flex justify-between items-center py-2"
              >
                <span className="text-sm font-bold uppercase tracking-wider text-black/70">{t('product.details')}</span>
                {isDescriptionOpen ? (
                  <FiMinus className="w-5 h-5 text-black/60" />
                ) : (
                  <FiPlus className="w-5 h-5 text-black/60" />
                )}
              </button>

              <div className={`overflow-hidden transition-all duration-300 ${isDescriptionOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                <p className="text-sm text-black/60 leading-relaxed">
                  {producto?.description || t('product.descriptionNotAvailable')}
                </p>
              </div>
            </div>
          </div>

          {/* 3. RECOMENDACIONES (Visible en Móvil ahora) */}
          <div className="border-t border-black/5 pt-10 pb-8 px-6">
            <h3 className="text-lg font-bold text-black uppercase tracking-wider mb-6 text-center">
              {t('product.youMayAlsoLove')}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {recommendedProducts.slice(0, 4).map((product) => (
                <LinkWithTransition
                  key={product.handle}
                  href={`/product/${product.handle}`}
                  className="group"
                >
                  <div className="relative aspect-[4/5] bg-gray-100 rounded-xl overflow-hidden mb-3">
                    {product.featuredImage && (
                      <Image
                        src={product.featuredImage.url}
                        alt={product.title}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <h4 className="text-sm font-medium text-black line-clamp-1">{product.title}</h4>
                  <p className="text-xs text-black/60">{formatPrice(product.priceRange?.maxVariantPrice)}</p>
                </LinkWithTransition>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Card de producto - Solo en escritorio */}
      <div className="hidden md:flex relative z-10 items-start justify-center p-8 pt-28 min-h-screen px-4">
        <div className="w-full max-w-7xl mx-auto bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20">
          <div className="flex items-start">
            {/* Columna izquierda - Bento Grid de Imágenes + Barra de Progreso Flotante */}
            <div className="w-[60%] relative p-4">
              {/* Barra de Progreso (Overlay) */}
              <div className="absolute left-8 top-0 h-full w-12 z-[60] pointer-events-none flex flex-col items-center">
                <div className="sticky top-1/2 -translate-y-1/2 pointer-events-auto flex flex-col items-center gap-4">
                  <button
                    onClick={() => window.scrollBy({ top: -300, behavior: 'smooth' })}
                    className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center hover:bg-black/40 transition-all duration-200 group border border-white/10"
                  >
                    <FiChevronDown className="h-5 w-5 text-white transform rotate-180 group-hover:-translate-y-0.5 transition-transform" />
                  </button>

                  <div className="w-2 h-48 bg-black/20 rounded-full relative overflow-hidden backdrop-blur-sm border border-white/10">
                    <div
                      className="absolute top-0 left-0 w-full bg-white rounded-full transition-all duration-100 ease-out shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                      style={{ height: `${scrollProgress}%` }}
                    />
                  </div>

                  <button
                    onClick={() => window.scrollBy({ top: 300, behavior: 'smooth' })}
                    className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center hover:bg-black/40 transition-all duration-200 group border border-white/10"
                  >
                    <FiChevronDown className="h-5 w-5 text-white group-hover:translate-y-0.5 transition-transform" />
                  </button>
                </div>
              </div>

              {/* Grid */}
              <div ref={galleryGridRef} className="w-full grid grid-cols-2 gap-3">
                {galleryImages.map((img: any, index: number) => (
                  <div
                    key={`${img.url}-${index}`}
                    className={`relative cursor-zoom-in group overflow-hidden rounded-2xl ${(index + 1) % 3 === 0 ? 'col-span-2 aspect-[3/4]' : 'col-span-1 aspect-[3/4]'
                      }`}
                    onClick={() => {
                      setCurrentImageIndex(index);
                      setIsFullscreen(true);
                    }}
                  >
                    <Image
                      src={img.url}
                      alt={img.altText || producto?.title || 'Product image'}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority={index < 3}
                      loader={shopifyLoader}
                    />
                    {/* Badge de índice opcional para debug o estilo */}
                  </div>
                ))}

              </div>
            </div>

            {/* Columna derecha - Controles (Sticky Centered) */}
            {/* Columna derecha - Controles (Sticky Compact Dynamic) */}
            <div
              ref={rightPanelRef}
              className={`w-[40%] sticky h-fit z-50 transition-all duration-300 ease-in-out ${isHeaderVisible ? 'top-24' : 'top-4'
                }`}
            >
              <div className="w-full flex flex-col p-5">
                <div className="w-full">
                  <div className="mb-2">
                    <div className="max-w-xs mx-auto">
                      <div className="slide-title mb-2" style={{ overflow: 'visible', lineHeight: '1.2' }}>
                        <SplitText
                          text={producto?.title || ''}
                          className="text-2xl font-bold text-white"
                          delay={500}
                          duration={1}
                          ease="power4.out"
                          splitType="words"
                          threshold={0.1}
                          rootMargin="-100px"
                          textAlign="left"
                        />
                      </div>
                      <div ref={priceRef} className="flex items-baseline space-x-3 mb-1">
                        <span className="text-xl font-bold text-white">{formatPrice(producto?.priceRange?.maxVariantPrice)}</span>
                      </div>
                      <p ref={shippingRef} className="text-white/60 text-[10px] leading-relaxed text-left mb-4">
                        <LinkWithTransition href="/shipping-policy" className="underline hover:text-white/80 transition-colors">
                          {t('product.shipping')}
                        </LinkWithTransition> {t('product.shippingCalculated')}.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 flex flex-col items-center">
                    {/* Selectores de color - Compact */}
                    <div className="max-w-xs w-full">
                      <label ref={colorLabelRef} className="block text-white/90 text-xs font-semibold mb-2 uppercase tracking-wider text-left">{t('product.color')}</label>
                      <div ref={colorButtonsRef} className="flex relative justify-start">
                        {getAvailableColors().map((colorInfo, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedColor(colorInfo.nombre)}
                            onMouseEnter={() => setHoveredColor(colorInfo.nombre)}
                            onMouseLeave={() => setHoveredColor(null)}
                            disabled={!colorInfo.disponible}
                            className={`relative w-8 h-8 rounded-full border border-white/20 mr-2 overflow-hidden transition-all duration-300 ${!colorInfo.disponible ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:scale-110'
                              } ${selectedColor === colorInfo.nombre ? 'ring-2 ring-white ring-offset-2 ring-offset-black' : ''}`}
                            style={{ backgroundColor: colorInfo.codigo }}
                            title={colorInfo.nombre}
                          >
                            <span className="sr-only">{colorInfo.nombre}</span>
                          </button>
                        ))}

                      </div>
                      {(hoveredColor || selectedColor) && (
                        <div className="mt-3 text-sm text-white/80 font-medium text-left">
                          {hoveredColor || selectedColor}
                        </div>
                      )}
                    </div>

                    {/* Selector de talla - Compact */}
                    <div className="max-w-xs w-full">
                      <label ref={sizeLabelRef} className="block text-white/90 text-xs font-semibold mb-2 uppercase tracking-wider text-left">{t('product.size')}</label>
                      <div ref={sizeButtonsRef} className="flex space-x-2 justify-start">
                        {getAvailableSizes().map((tallaInfo, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedSize(tallaInfo.talla)}
                            disabled={!tallaInfo.disponible}
                            className={`w-9 h-9 rounded-full border-2 transition-all duration-300 flex items-center justify-center text-xs font-medium ${selectedSize === tallaInfo.talla
                              ? 'bg-white text-black border-white'
                              : 'bg-transparent text-white/70 border-white/30 hover:border-white/50'
                              } ${!tallaInfo.disponible ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}`}
                          >
                            {tallaInfo.talla}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Selector de cantidad - Compact */}
                    <div className="max-w-xs w-full">
                      <label ref={quantityLabelRef} className="block text-white/90 text-xs font-semibold mb-2 uppercase tracking-wider text-left">{t('product.quantity')}</label>
                      <div ref={quantityControlsRef} className="flex items-center justify-start gap-3">
                        <button
                          onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                          className="w-8 h-8 rounded-full border-2 border-white/30 text-white/90 hover:border-white/50 hover:text-white transition-all duration-200 flex items-center justify-center"
                          type="button"
                        >
                          <FiMinus className="h-3 w-3" />
                        </button>
                        <span className="text-white text-base font-medium min-w-[1.5rem] text-center">{quantity}</span>
                        <button
                          onClick={() => setQuantity(prev => prev + 1)}
                          className="w-8 h-8 rounded-full border-2 border-white/30 text-white/90 hover:border-white/50 hover:text-white transition-all duration-200 flex items-center justify-center"
                          type="button"
                        >
                          <FiPlus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Botón agregar al carrito - Compact */}
                <div ref={addToCartRef} className="flex justify-center mt-5">
                  <div className="max-w-xs w-full">
                    <button
                      onClick={handleAddToCart}
                      className="w-full bg-white/20 backdrop-blur-md text-white py-3 rounded-full font-medium hover:bg-white/30 transition-all duration-200 flex items-center justify-between px-6 border border-white/30 cursor-pointer relative z-10"
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
      </div>

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
            {galleryImages[currentImageIndex] && (
              <Image
                src={galleryImages[currentImageIndex].url}
                alt={galleryImages[currentImageIndex].altText || producto?.title || 'Product image'}
                fill
                className="max-w-full max-h-full object-contain transition-opacity duration-300"
                style={{
                  transform: `scale(${zoomLevel}) translate(${imagePosition.x}px, ${imagePosition.y}px)`,
                  transition: isDragging ? 'none' : 'transform 0.3s ease-out'
                }}
                sizes="100vw"
                priority
                loader={shopifyLoader}
              />
            )}
          </div>

          {/* Controles de navegación en fullscreen */}
          {galleryImages.length > 1 && (
            <>
              <button
                onClick={() => setCurrentImageIndex(prev =>
                  prev === 0 ? galleryImages.length - 1 : prev - 1
                )}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 backdrop-blur-sm text-white p-4 rounded-full hover:bg-black/70 transition-all duration-200"
                aria-label="Imagen anterior"
              >
                <FiArrowLeft className="h-6 w-6" />
              </button>
              <button
                onClick={() => setCurrentImageIndex(prev =>
                  prev === galleryImages.length - 1 ? 0 : prev + 1
                )}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 backdrop-blur-sm text-white p-4 rounded-full hover:bg-black/70 transition-all duration-200"
                aria-label="Siguiente imagen"
              >
                <FiArrowLeft className="h-6 w-6 rotate-180" />
              </button>
            </>
          )}

          {/* Indicadores en fullscreen */}
          {galleryImages.length > 1 && (
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {galleryImages.map((_: any, index: number) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`transition-all duration-500 ease-in-out transform ${index === currentImageIndex
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
                    <div className={`grid gap-6 md:gap-6 w-full ${recommendedProducts.length === 1
                      ? 'grid-cols-1 justify-items-center'
                      : recommendedProducts.length === 2
                        ? 'grid-cols-1 md:grid-cols-2 justify-items-center'
                        : recommendedProducts.length === 3
                          ? 'grid-cols-1 md:grid-cols-3 justify-items-center'
                          : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4 justify-items-center'
                      }`}>
                      {recommendedProducts.slice(0, 4).map((product, index) => {
                        // Logic: User wants the SECOND image as the main image.
                        // And the THIRD image as the hover image.
                        const featuredImageUrl = product.featuredImage?.url;
                        const secondImageUrl = product.images?.[1]?.url;
                        const thirdImageUrl = product.images?.[2]?.url;

                        // Main display: Second image (fallback to featured)
                        const displayImage = secondImageUrl || featuredImageUrl;
                        // Hover display: Third image (fallback to featured)
                        const hoverImage = thirdImageUrl || featuredImageUrl;

                        // Extraer colores únicos para este producto recomendado
                        const productColors = (() => {
                          if (!product.variants) return [];
                          const colorMap = new Map();
                          product.variants.forEach(variant => {
                            const colorOption = variant.selectedOptions?.find(opt =>
                              opt.name.toLowerCase().includes('color') || opt.name.toLowerCase().includes('colour')
                            );
                            if (colorOption) {
                              colorMap.set(colorOption.value, {
                                name: colorOption.value,
                                code: getColorCode(colorOption.value)
                              });
                            }
                          });
                          return Array.from(colorMap.values());
                        })();

                        return (
                          <LinkWithTransition
                            key={product.handle}
                            href={`/product/${product.handle}`}
                            className="group cursor-pointer w-full max-w-[280px]"
                          >
                            <div className="relative aspect-square bg-white/5 rounded-[20px] overflow-hidden mb-4 w-full border border-white/10 group-hover:border-white/30 transition-colors">
                              {displayImage && (
                                <>
                                  {/* Imagen principal (Ahora es la segunda foto) */}
                                  <Image
                                    src={displayImage}
                                    alt={product.title}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    sizes="(min-width: 768px) 25vw, 50vw"
                                  />
                                  {/* Imagen hover (Ahora es la primera foto) */}
                                  {hoverImage && (
                                    <Image
                                      src={hoverImage}
                                      alt={product.title}
                                      fill
                                      className="object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100 absolute inset-0 scale-105"
                                      sizes="(min-width: 768px) 25vw, 50vw"
                                    />
                                  )}
                                </>
                              )}

                              {/* Tag de "New" o similar si se quisiera agregar */}
                            </div>

                            <div className="flex flex-col items-center">
                              <h3 className="text-white text-sm md:text-base font-medium mb-1 line-clamp-1 text-center group-hover:text-white/80 transition-colors">
                                {product.title}
                              </h3>
                              <p className="text-white/70 text-xs md:text-sm text-center mb-2">
                                {formatPrice(product.priceRange?.maxVariantPrice)}
                              </p>

                              {/* Swatches de colores */}
                              {productColors.length > 0 && (
                                <div className="flex justify-center gap-2 items-center">
                                  {productColors.slice(0, 5).map((color: any) => (
                                    <div
                                      key={color.name}
                                      className="w-3 h-3 rounded-full border border-white/20 shadow-sm"
                                      style={{ backgroundColor: color.code }}
                                      title={color.name}
                                    />
                                  ))}
                                  {productColors.length > 5 && (
                                    <span className="text-[10px] text-white/50">+</span>
                                  )}
                                </div>
                              )}
                            </div>
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