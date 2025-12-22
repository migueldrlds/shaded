'use client';

import shopifyLoader from 'lib/image-loader';
import Image from 'next/image';
import React from 'react';

interface DesktopProductCardAltProps {
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
    }>;
    priceRange?: {
      maxVariantPrice: {
        amount: string;
        currencyCode: string;
      };
    };
  };
}

const formatPrice = (price: { amount: string; currencyCode: string } | undefined) => {
  if (!price) return '$0.00 USD';
  const currencyCode = price.currencyCode || 'USD';
  return `$${parseFloat(price.amount).toFixed(2)} ${currencyCode}`;
};

const DesktopProductCardAlt: React.FC<DesktopProductCardAltProps> = ({ product }) => {
  if (!product) return null;


  const getHoverImage = () => {
    if (!product.images || product.images.length <= 2) {

      return null;
    }

    const featuredImageUrl = product.featuredImage?.url;


    for (let i = 2; i < product.images.length; i++) {
      const image = product.images[i];
      if (image?.url && image.url !== featuredImageUrl) {
        return image.url;
      }
    }


    const lastImage = product.images[product.images.length - 1];
    if (lastImage?.url && lastImage.url !== featuredImageUrl && product.images.length > 2) {
      return lastImage.url;
    }

    return null;
  };

  const firstImage = product.featuredImage?.url || '/img1.jpg';
  const hoverImage = getHoverImage();
  const hasHoverImage = hoverImage !== null;

  return (
    <div className="card-wrapper product-card-wrapper underline-links-hover group">
      <div className="card card--standard card--media" style={{ '--ratio-percent': '100.0%' } as React.CSSProperties}>
        <div className="card__inner color-scheme-2 gradient ratio" style={{ '--ratio-percent': '100.0%' } as React.CSSProperties}>
          <div className="card__media">
            <div className="media media--transparent media--hover-effect">
              <a href={`/product/${product.handle}`} className="full-unstyled-link block w-full h-full">

                <Image
                  src={firstImage}
                  alt={product.title}
                  fill
                  className={`motion-reduce ${hasHoverImage ? 'group-hover:opacity-0' : ''} transition-opacity duration-500`}
                  style={{ objectFit: 'contain' }}
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  priority={false}
                  loader={shopifyLoader}
                />


                {hasHoverImage && hoverImage && (
                  <Image
                    src={hoverImage}
                    alt={product.title}
                    fill
                    className="motion-reduce opacity-0 group-hover:opacity-100 transition-opacity duration-500 absolute inset-0"
                    style={{ objectFit: 'contain' }}
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    loading="lazy"
                    loader={shopifyLoader}
                  />
                )}
              </a>
            </div>
          </div>
        </div>

        <div className="card__content">
          <div className="card__information">
            <h3 className="card__heading h5">
              <a
                href={`/product/${product.handle}`}
                className="full-unstyled-link card__title-link"
                id={`CardLink-${product.handle}`}
              >
                {product.title}
              </a>
            </h3>
            <div className="card-information">
              <div className="price">
                <div className="price__container">
                  <span className="price-item price-item--regular price-item--default">
                    {formatPrice(product?.priceRange?.maxVariantPrice)}
                  </span>
                  <span className="price-item price-item--sale price-item--hover">
                    {formatPrice(product?.priceRange?.maxVariantPrice)}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="card__badge bottom left"></div>
        </div>
      </div>
    </div>
  );
};

export default DesktopProductCardAlt;
