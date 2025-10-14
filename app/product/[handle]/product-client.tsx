'use client';

import { useCart } from 'components/cart/cart-context';
import type { Product } from 'lib/shopify/types';
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FiArrowLeft, FiChevronDown, FiChevronUp, FiShoppingCart, FiX } from 'react-icons/fi';

interface ProductClientProps {
  producto: Product;
}

export default function ProductClient({ producto }: ProductClientProps) {
  const router = useRouter();
  const { addCartItem } = useCart();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPanelVisible, setIsPanelVisible] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [zoomLevel, setZoomLevel] = useState(1.5);
  const [lastPinchDistance, setLastPinchDistance] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [showFullDetails, setShowFullDetails] = useState(false);

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
    console.log('🛒 BOTÓN CLICKEADO - Add to Cart');
    console.log('=== DEBUGGING ADD TO CART ===');
    console.log('Producto:', producto?.title);
    console.log('Variantes disponibles:', producto?.variants?.length);
    console.log('Talla seleccionada:', selectedSize);
    console.log('Color seleccionado:', selectedColor);
    
    if (!producto?.variants || producto.variants.length === 0) {
      console.log('❌ No hay variantes disponibles');
      return;
    }

    // Mostrar todas las variantes y sus opciones
    console.log('Todas las variantes:');
    producto.variants.forEach((variant, index) => {
      console.log(`Variante ${index}:`, {
        id: variant.id,
        title: variant.title,
        available: variant.availableForSale,
        options: variant.selectedOptions
      });
    });

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
      
      console.log('Comparando variante:', {
        variantTitle: variant.title,
        sizeOption: sizeOption?.value,
        colorOption: colorOption?.value,
        selectedSize,
        selectedColor,
        matches: sizeOption?.value === selectedSize && colorOption?.value === selectedColor
      });
      
      return sizeOption?.value === selectedSize && colorOption?.value === selectedColor;
    });

    if (!selectedVariant) {
      console.log('❌ No se encontró la variante seleccionada');
      console.log('Intentando agregar la primera variante disponible...');
      
      // Si no encuentra la variante específica, usar la primera disponible
      const firstAvailableVariant = producto.variants.find(v => v.availableForSale);
      if (firstAvailableVariant) {
        console.log('✅ Usando primera variante disponible:', firstAvailableVariant.title);
        try {
          await addCartItem(firstAvailableVariant, producto);
        } catch (error) {
          console.error('❌ Error agregando producto al carrito:', error);
        }
        return;
      }
      return;
    }

    if (!selectedVariant.availableForSale) {
      console.log('❌ La variante seleccionada no está disponible');
      return;
    }

    // Agregar al carrito
    console.log('✅ Agregando al carrito:', selectedVariant.title);
    try {
      await addCartItem(selectedVariant, producto);
      console.log('✅ Producto agregado al carrito exitosamente');
    } catch (error) {
      console.error('❌ Error agregando producto al carrito:', error);
    }
  };

  // Funciones para gestos nativos
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isFullscreen) {
      if (e.touches.length === 1) {
        setIsDragging(true);
        setDragStart({
          x: (e.touches[0]?.clientX || 0) - imagePosition.x,
          y: (e.touches[0]?.clientY || 0) - imagePosition.y
        });
      } else if (e.touches.length === 2) {
        const distance = Math.sqrt(
          Math.pow((e.touches[0]?.clientX || 0) - (e.touches[1]?.clientX || 0), 2) +
          Math.pow((e.touches[0]?.clientY || 0) - (e.touches[1]?.clientY || 0), 2)
        );
        setLastPinchDistance(distance);
      }
    } else {
      setTouchEnd(0);
      setTouchStart(e.targetTouches[0]?.clientX || 0);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isFullscreen) {
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
        const distance = Math.sqrt(
          Math.pow((e.touches[0]?.clientX || 0) - (e.touches[1]?.clientX || 0), 2) +
          Math.pow((e.touches[0]?.clientY || 0) - (e.touches[1]?.clientY || 0), 2)
        );
        
        if (lastPinchDistance > 0) {
          const scale = distance / lastPinchDistance;
          setZoomLevel(prev => Math.max(1, Math.min(3, prev * scale)));
        }
        setLastPinchDistance(distance);
      }
    } else if (!isFullscreen) {
      setTouchEnd(e.targetTouches[0]?.clientX || 0);
    }
  };

  const handleTouchEnd = () => {
    if (isFullscreen) {
      setIsDragging(false);
      return;
    }

    if (!touchStart || !touchEnd || !producto?.images) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === (producto?.images?.length || 1) - 1 ? 0 : prevIndex + 1
      );
    }
    if (isRightSwipe) {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === 0 ? (producto?.images?.length || 1) - 1 : prevIndex - 1
      );
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

      {/* Imagen de fondo para móvil */}
      <div 
        className="md:hidden fixed inset-0 cursor-pointer select-none overflow-hidden"
        style={{ 
          zIndex: -1,
          touchAction: isFullscreen ? 'none' : 'pan-y' 
        }}
        onClick={() => setIsFullscreen(!isFullscreen)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div 
          className="flex h-full transition-transform duration-500 ease-out"
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
              />
            </div>
          ))}
        </div>
        
        <div className={`absolute inset-0 transition-opacity duration-300 ${
          isFullscreen ? 'bg-black/5' : 'bg-black/20'
        }`}></div>
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
        <div className="md:hidden relative z-10 pt-40 px-4 min-h-screen">
          <div className="flex items-center justify-center relative">
            <button 
              onClick={() => router.back()}
              className="absolute left-0 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all duration-200"
            >
              <FiArrowLeft className="h-5 w-5" />
            </button>

            <div className="flex space-x-3 bg-black/30 backdrop-blur-md rounded-full px-6 py-3 border border-white/20">
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
          </div>
        </div>
      )}

      {/* Panel móvil */}
      {!isFullscreen && (
        <div className={`md:hidden relative z-20 transition-transform duration-300 ${
          isPanelVisible ? 'translate-y-0' : 'translate-y-full'
        }`}>
          <div className="flex justify-end px-4 pt-4 pb-2">
            <button
              onClick={() => setIsPanelVisible(false)}
              className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all duration-200"
            >
              <FiChevronDown className="h-5 w-5" />
            </button>
          </div>

          <div className="bg-white/20 backdrop-blur-xl rounded-t-3xl shadow-2xl">
            <div className="px-4 pt-6 pb-6 max-h-[60vh] overflow-y-auto">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h1 className="text-2xl font-bold text-white">{producto?.title}</h1>
                  <span className="text-lg font-bold text-white">{formatPrice(producto?.priceRange?.maxVariantPrice)}</span>
                </div>
              </div>

              <p className="text-white/90 text-sm font-normal leading-relaxed mb-6">
                {producto?.description || 'Descripción del producto no disponible.'}
              </p>

              {/* Información seleccionada */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {/* Talla seleccionada */}
                <div className="relative">
                  <select
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    className="w-full bg-white/20 border border-white/30 rounded-full px-4 py-3 text-sm font-medium text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/40 text-center pr-10"
                  >
                    {getAvailableSizes().map((tallaInfo, index) => (
                      <option 
                        key={index} 
                        value={tallaInfo.talla}
                        disabled={!tallaInfo.disponible}
                        className="bg-black text-white text-center"
                      >
                        {tallaInfo.talla} {!tallaInfo.disponible ? '(Agotado)' : ''}
                      </option>
                    ))}
                  </select>
                  <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/70 pointer-events-none" />
                </div>

                {/* Color seleccionado */}
                <div className="relative">
                  <select
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                    className="w-full bg-white/20 border border-white/30 rounded-full px-4 py-3 text-sm font-medium text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/40 text-center pr-10"
                  >
                    {getAvailableColors().map((colorInfo, index) => (
                      <option 
                        key={index} 
                        value={colorInfo.nombre}
                        disabled={!colorInfo.disponible}
                        className="bg-black text-white text-center"
                      >
                        {colorInfo.nombre} {!colorInfo.disponible ? '(Agotado)' : ''}
                      </option>
                    ))}
                  </select>
                  <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/70 pointer-events-none" />
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
            </div>
          </div>
        </div>
      )}

      {/* Botón fullscreen */}
      {!isFullscreen && !isPanelVisible && (
        <div className="md:hidden relative z-30 p-4">
          <button
            onClick={() => setIsPanelVisible(true)}
            className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all duration-200"
          >
            <FiChevronUp className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Imagen fullscreen */}
      {isFullscreen && (
        <div 
          className="fixed inset-0 z-50 cursor-grab select-none bg-black"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{ touchAction: 'none' }}
        >
          <Image
            src={producto?.images?.[currentImageIndex]?.url || '/img1.jpg'}
            alt={producto?.images?.[currentImageIndex]?.altText || producto?.title || 'Product image'}
            fill
            className="object-cover"
            style={{
              transform: `scale(${zoomLevel}) translate(${imagePosition.x}px, ${imagePosition.y}px)`,
              transition: isDragging ? 'none' : 'transform 0.3s ease-out'
            }}
          />
        </div>
      )}

      {/* Botón salir fullscreen */}
      {isFullscreen && (
        <div className="fixed top-4 right-4 z-60">
          <button
            onClick={() => {
              setIsFullscreen(false);
              setImagePosition({ x: 0, y: 0 });
              setZoomLevel(1.5);
              setIsDragging(false);
            }}
            className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all duration-200"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}
