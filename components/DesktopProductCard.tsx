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


  const getBannerImage = () => {
    if (product.images && product.images.length > 0) {

      const bannerImage = product.images.find(img =>
        img.altText && img.altText.toLowerCase().includes('banner')
      );
      if (bannerImage) return bannerImage.url;


      if (product.images.length > 1) {
        const featuredImageUrl = product.featuredImage?.url;
        const secondImage = product.images.find(img => img.url !== featuredImageUrl);
        return secondImage?.url || product.images[1]?.url;
      }
    }

    return product.featuredImage?.url;
  };

  return (
    <div className="flex justify-between items-start h-full pr-0">

      <div className="relative" style={{ top: '240px', width: '300px', right: '-30px' }}>
        <LinkWithTransition
          href={`/product/${product.handle}`}
          className="bg-transparent rounded-3xl overflow-hidden transition-all duration-300 group relative w-full block cursor-pointer"
          style={{ height: '500px' }}
        >

          <div className="relative w-full h-full">
            <Image
              src={product.featuredImage?.url || '/img1.jpg'}
              alt={product.title}
              fill
              className="object-contain transition-transform duration-300"
              sizes="400px"
              priority={false}
              quality={90}
              loader={shopifyLoader}
            />
            <Image
              src={product.featuredImage?.url || '/img1.jpg'}
              alt={product.title}
              fill
              className="object-contain transition-all duration-300 opacity-0 absolute inset-0"
              sizes="400px"
              priority={false}
              quality={90}
              loader={shopifyLoader}
            />
          </div>
        </LinkWithTransition>


        <div className="mt-3 space-y-2">

          <div className="flex gap-2">
            {Array.from(new Set(product.variants?.map(v => v.selectedOptions?.find(o => o.name === 'Color' || o.name === 'Colour')?.value).filter(Boolean))).slice(0, 4).map((color, index) => {

              const colorMap: Record<string, string> = {
                'Black': '#000000',
                'White': '#ffffff',
                'Grey': '#808080',
                'Gray': '#808080',
                'Heather Grey': '#a9a9a9',
                'Navy': '#000080',
                'Blue': '#0000ff',
                'Red': '#ff0000',
                'Green': '#008000',
                'Beige': '#f5f5dc',
                'Cream': '#fffdd0',
                'Brown': '#a52a2a',

              };



              const backgroundColor = colorMap[color || ''] || '#cccccc';
              const isWhite = color?.toLowerCase() === 'white' || backgroundColor === '#ffffff';

              return (
                <LinkWithTransition
                  key={index}
                  href={`/product/${product.handle}?color=${encodeURIComponent(color || '')}`}
                  className={`relative inline-flex items-center justify-center w-6 h-6 rounded-full transition-all duration-300 hover:scale-110 cursor-pointer overflow-hidden border ${isWhite ? 'border-gray-200' : 'border-transparent'}`}
                  style={{ backgroundColor }}
                  title={color}
                >
                  <span className="sr-only">{color}</span>
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


      <div className="relative mb-0 self-end" style={{ width: '900px' }}>
        <LinkWithTransition href={`/product/${product.handle}`} className="bg-transparent rounded-3xl overflow-hidden hover:shadow-lg transition-all duration-300 group relative w-full block cursor-pointer" style={{ height: '660px' }}>

          <div className="relative w-full h-full">
            <Image
              src={getBannerImage() || '/img2.jpg'}
              alt={product?.title || 'Producto derecho'}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 1200px, 100vw"
              quality={100}
              priority={true}
              loader={shopifyLoader}
            />
          </div>


          <div className="absolute top-6 left-6 right-2 hidden md:block">
            <div className="flex flex-col justify-center">
              <h3 className="text-sm font-medium text-white">
                {product?.title}
              </h3>
            </div>
          </div>


          <div className="absolute right-130 top-1/2 -translate-y-1/2">
            <div className="flex items-center">
              <div className="bg-black/50 text-white rounded-full px-4 py-2.5 backdrop-blur-sm flex items-center gap-6">
                <div className="flex flex-col items-start gap-0.5">
                  <span className="text-sm font-medium">{product?.title}</span>
                  {collectionName && (
                    <span className="text-[10px] font-thin opacity-75 leading-tight">{collectionName}</span>
                  )}
                </div>
                <div className="flex items-center">
                  <span className="text-xs font-thin tracking-wide">{formatPrice(product?.priceRange?.maxVariantPrice)}</span>
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
