'use client';

import LinkWithTransition from 'components/link-with-transition';
import shopifyLoader from 'lib/image-loader';
import Image from 'next/image';

interface DesktopProductCardProps {
  product: {
    handle: string;
    title: string;
    featuredImage?: {
      url: string;
    };
    images?: Array<{
      url: string;
      altText?: string;
    }>;
    variants?: Array<{
      availableForSale: boolean;
      selectedOptions?: Array<{
        name: string;
        value: string;
      }>;
      image?: {
        url: string;
      };
    }>;
    priceRange?: {
      maxVariantPrice: {
        amount: string;
        currencyCode: string;
      };
    };
  };
  collectionName?: string;
}

const formatPrice = (price: { amount: string; currencyCode: string } | undefined) => {
  if (!price) return '$0.00';
  return `$${parseFloat(price.amount).toFixed(2)} ${price.currencyCode}`;
};

const DesktopProductCard: React.FC<DesktopProductCardProps> = ({ product, collectionName }) => {
  if (!product) return null;

  // Función para obtener la segunda imagen disponible
  const getSecondImage = () => {
    if (product.images && product.images.length > 1) {
      // Buscar la segunda imagen que no sea la featuredImage
      const featuredImageUrl = product.featuredImage?.url;
      const secondImage = product.images.find(img => img.url !== featuredImageUrl);
      return secondImage?.url || product.images[1]?.url;
    }
    return product.featuredImage?.url;
  };

  return (
    <div className="flex justify-between items-start h-full pr-0">
      {/* Card izquierdo */}
      <div className="relative" style={{ top: '240px', width: '300px', right: '-30px' }}>
        <LinkWithTransition
          href={`/product/${product.handle}`}
          className="bg-transparent rounded-3xl overflow-hidden hover:shadow-lg transition-all duration-300 group relative w-full block cursor-pointer"
          style={{ height: '500px' }}
        >
          {/* Imagen del producto */}
          <div className="relative w-full h-full">
            <Image
              src={product.featuredImage?.url || '/img1.jpg'}
              alt={product.title}
              fill
              className="object-contain group-hover:scale-105 transition-transform duration-300"
              sizes="300px"
              priority={false}
              loader={shopifyLoader}
            />
            <Image
              src={product.featuredImage?.url || '/img1.jpg'}
              alt={product.title}
              fill
              className="object-contain group-hover:scale-105 transition-all duration-300 opacity-0 group-hover:opacity-100 absolute inset-0"
              sizes="300px"
              priority={false}
              loader={shopifyLoader}
            />
          </div>
        </LinkWithTransition>

        {/* Colores y tallas debajo del card del carrusel */}
        <div className="mt-3 space-y-2">
          {/* Colores disponibles */}
          <div className="flex gap-2">
            {Array.from(new Set(product.variants?.map(v => v.selectedOptions?.find(o => o.name === 'Color' || o.name === 'Colour')?.value).filter(Boolean))).slice(0, 4).map((color, index) => {
              // Encontrar la variante correspondiente a este color para obtener su imagen
              const variant = product.variants?.find(v => v.selectedOptions?.some(o => (o.name === 'Color' || o.name === 'Colour') && o.value === color));
              const variantImage = variant?.image?.url || product.featuredImage?.url;

              return (
                <LinkWithTransition
                  key={index}
                  href={`/product/${product.handle}?color=${encodeURIComponent(color || '')}`}
                  className="relative inline-flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 hover:scale-110 cursor-pointer overflow-hidden border border-white/30"
                >
                  <Image
                    src={variantImage || '/img1.jpg'}
                    alt={color || 'Color variant'}
                    fill
                    className="object-cover"
                    sizes="32px"
                    loader={shopifyLoader}
                  />
                </LinkWithTransition>
              );
            })}
          </div>

          {/* Tallas disponibles */}
          <div className="flex gap-1.5 flex-wrap">
            {Array.from(new Set(product.variants?.map(v => v.selectedOptions?.find(o => o.name === 'Size')?.value).filter(Boolean))).slice(0, 5).map((size, index) => (
              <span
                key={index}
                className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-light transition-all duration-300 ${product.variants?.some(v => v.selectedOptions?.find(o => o.name === 'Size')?.value === size && v.availableForSale)
                  ? 'bg-white/30 backdrop-blur-sm text-black'
                  : 'bg-white/15 backdrop-blur-sm text-black/40'
                  }`}
              >
                {size}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Card derecho */}
      <div className="relative mb-0 self-end" style={{ width: '900px' }}>
        <LinkWithTransition href={`/product/${product.handle}`} className="bg-transparent rounded-3xl overflow-hidden hover:shadow-lg transition-all duration-300 group relative w-full block cursor-pointer" style={{ height: '660px' }}>
          {/* Imagen del producto derecho */}
          <div className="relative w-full h-full">
            <Image
              src={getSecondImage() || '/img2.jpg'}
              alt={product?.title || 'Producto derecho'}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="900px"
              priority={false}
              loader={shopifyLoader}
            />
          </div>

          {/* Información del producto derecho */}
          <div className="absolute top-6 left-6 right-2 hidden md:block">
            <div className="flex flex-col justify-center">
              <h3 className="text-sm font-medium text-white">
                {product?.title}
              </h3>
            </div>
          </div>

          {/* Precio flotante centrado con botón circular pegado */}
          <div className="absolute right-130 top-1/2 -translate-y-1/2">
            <div className="flex items-center">
              <div className="bg-black/50 text-white rounded-full px-4 py-2.5 backdrop-blur-sm flex items-center gap-6">
                <div className="flex flex-col items-start gap-0.5">
                  <span className="text-xs">{product?.title}</span>
                  {collectionName && (
                    <span className="text-[9px] font-thin opacity-75 leading-tight">{collectionName}</span>
                  )}
                </div>
                <div className="flex items-center">
                  <span className="text-xs font-light">{formatPrice(product?.priceRange?.maxVariantPrice)}</span>
                </div>
              </div>
              <button className="ml-0 rounded-full bg-black/50 text-white backdrop-blur-sm flex items-center justify-center px-2.5 py-2.5">
                <div className="w-3 h-3 rounded-full bg-white"></div>
              </button>
            </div>
          </div>
        </LinkWithTransition>
      </div>
    </div>
  );
};

export default DesktopProductCard;
