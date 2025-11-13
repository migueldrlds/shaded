'use client';

import Image from 'next/image';
import React from 'react';

interface MobileProductCardAltProps {
  product: any;
}

const MobileProductCardAlt: React.FC<MobileProductCardAltProps> = ({ product }) => {
  if (!product) return null;

  const formatPrice = (price: any) => {
    if (!price) return '$0.00';
    return `$${parseFloat(price.amount).toFixed(2)} ${price.currencyCode}`;
  };

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
          const existing = colorMap.get(colorName);
          if (isAvailable) {
            existing.disponible = true;
          }
        }
      }
    });
    
    return Array.from(colorMap.values());
  };

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
    <a
      href={`/product/${product.handle}`}
      className="group relative block w-full h-[500px] rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 hover:shadow-2xl transition-all duration-300 cursor-pointer"
    >
      {/* Imagen del producto */}
      <div className="relative w-full h-full">
        <Image
          src={product.featuredImage?.url || '/img1.jpg'}
          alt={product.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          priority={false}
          unoptimized={true}
        />
        
        {/* Overlay con gradiente */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      </div>

      {/* Información del producto en la parte inferior */}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <div className="flex flex-col gap-3">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Agressive' }}>
              {product.title}
            </h2>
            <p className="text-sm text-white/90 mb-2" style={{ fontFamily: 'Agressive' }}>
              by shaded
            </p>
          </div>
          
          {/* Precio y colores */}
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-white" style={{ fontFamily: 'Agressive' }}>
              {formatPrice(product.priceRange?.maxVariantPrice)}
            </span>
            
            {/* Colores disponibles */}
            <div className="flex gap-2">
              {getAvailableColors().slice(0, 4).map((colorInfo, index) => (
                <div
                  key={index}
                  className={`w-6 h-6 rounded-full border-2 border-white/70 ${
                    !colorInfo.disponible ? 'opacity-40' : ''
                  }`}
                  style={{ backgroundColor: colorInfo.codigo }}
                />
              ))}
            </div>
          </div>
          
          {/* Tallas disponibles */}
          <div className="flex gap-1.5 flex-wrap">
            {getAvailableSizes().slice(0, 5).map((sizeInfo, index) => (
              <span
                key={index}
                className={`inline-flex items-center justify-center px-2 py-1 rounded-full text-xs font-medium transition-all ${
                  sizeInfo.disponible 
                    ? 'bg-white/90 text-black' 
                    : 'bg-white/40 text-white/60'
                }`}
                style={{ fontFamily: 'NCS' }}
              >
                {sizeInfo.talla}
              </span>
            ))}
          </div>
          
          {/* Call to action */}
          <div className="flex items-center gap-2 text-white/90 mt-2">
            <span className="text-sm" style={{ fontFamily: 'Agressive' }}>Tap to view</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </a>
  );
};

export default MobileProductCardAlt;
