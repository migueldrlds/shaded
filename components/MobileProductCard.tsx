'use client';

import LinkWithTransition from 'components/link-with-transition';
import Image from 'next/image';
import React from 'react';

// Componente para card móvil
interface MobileProductCardProps {
  product: any;
}

const MobileProductCard: React.FC<MobileProductCardProps> = ({ product }) => {
  if (!product) return null;

  // Función para formatear el precio dentro del componente cliente
  const formatPrice = (price: any) => {
    if (!price) return '$0.00';
    return `$${parseFloat(price.amount).toFixed(2)} ${price.currencyCode}`;
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

  // Extraer colores únicos de las variantes
  const getAvailableColors = () => {
    if (!product?.variants) return [];
    
    const colorMap = new Map();
    product.variants.forEach((variant: any) => {
      const colorOption = variant.selectedOptions?.find((option: any) => 
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
    if (!product?.variants) return [];
    
    const sizeMap = new Map();
    product.variants.forEach((variant: any) => {
      const sizeOption = variant.selectedOptions?.find((option: any) => 
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

  return (
    <div className="w-full max-w-2xl relative">
       {/* Card único con imagen y información - Todo clickeable */}
       <LinkWithTransition 
         href={`/product/${product.handle}`}
         className="block bg-white/30 backdrop-blur-xl rounded-3xl h-66 relative overflow-visible transition-all duration-300 hover:bg-white/40 cursor-pointer"
       >
         <div className="flex h-full">
           {/* Información del producto - lado izquierdo */}
           <div className="flex-1 p-6 flex flex-col justify-between z-10 relative">
            <h2 className="text-2xl font-medium" style={{ color: '#000000' }}>
              {product.title}
            </h2>
            
            <div className="flex flex-col items-start gap-3">
              {/* Botones de colores disponibles */}
              <div className="flex gap-2">
                {getAvailableColors().map((colorInfo, index) => (
                  <div 
                    key={index}
                    className={`inline-flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ${
                      !colorInfo.disponible ? 'opacity-40' : ''
                    }`}
                  >
                    <div 
                      className="w-6 h-6 rounded-full border-1 border-white"
                      style={{ backgroundColor: colorInfo.codigo }}
                    ></div>
                  </div>
                ))}
              </div>
              
              {/* Badges de tallas disponibles */}
              <div className="flex gap-1.5 flex-wrap">
                {getAvailableSizes().map((sizeInfo, index) => (
                  <span
                    key={index}
                    className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-light transition-all duration-300 ${
                      sizeInfo.disponible 
                        ? 'bg-white/30 backdrop-blur-sm text-black' 
                        : 'bg-white/15 backdrop-blur-sm text-black/40'
                    }`}
                    style={{ fontFamily: 'NCS' }}
                  >
                    {sizeInfo.talla}
                  </span>
                ))}
              </div>
              
              {/* Contenedor redondeado para precio y botón */}
              <div className="bg-black/80 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center justify-between w-fit gap-2">
                {/* Precio */}
                <div>
                  <span className="text-sm font-light text-white">
                    {formatPrice(product.priceRange?.maxVariantPrice)}
                  </span>
                </div>
                
                {/* Icono de flecha */}
                <div className="inline-flex items-center justify-center w-8 h-8 bg-white text-black rounded-full">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
           {/* Imagen del producto - lado derecho - Se sale del card */}
           <div className="absolute -right-3 -top-4 w-64 h-[calc(100%+1rem)] flex-shrink-0">
            <Image
              src={product.featuredImage?.url || '/img1.jpg'}
              alt={product.title}
              fill
              className="object-contain rounded-3xl"
              priority={false}
              unoptimized={true}
            />
          </div>
        </div>
      </LinkWithTransition>
    </div>
  );
};

export default MobileProductCard;
