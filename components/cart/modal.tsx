'use client';

import { useGSAP } from '@gsap/react';
import LinkWithTransition from 'components/link-with-transition';
import Price from 'components/price';
import { useLanguage } from 'components/providers/language-provider';
import gsap from 'gsap';
import CustomEase from 'gsap/CustomEase';
import { DEFAULT_OPTION } from 'lib/constants';
import { createUrl } from 'lib/utils';
import Image from 'next/image';
import { useCallback, useEffect, useRef } from 'react';
import { createCartAndSetCookie, redirectToCheckout } from './actions';
import { useCart } from './cart-context';
import { useCartModal } from './cart-modal-context';
import './Cart.css';
import { DeleteItemButton } from './delete-item-button';
import { EditItemQuantityButton } from './edit-item-quantity-button';

gsap.registerPlugin(CustomEase);
CustomEase.create('hop', '.15, 1, .25, 1');

type MerchandiseSearchParams = {
  [key: string]: string;
};

export default function CartModal() {
  console.log('🛒 CartModal component is rendering...');
  
  const cartRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  
  const cartContext = useCart();
  const { isOpen, openCart, closeCart } = useCartModal();
  const { t } = useLanguage();
  console.log('🛒 CartModal - cartContext:', cartContext);
  console.log('🛒 CartModal - cartContext.cart:', cartContext.cart);
  console.log('🛒 CartModal - cartContext.cart.lines:', cartContext.cart?.lines?.length);
  console.log('🛒 CartModal - cartContext.contextId:', cartContext.contextId);
  
  const { cart, updateCartItem } = cartContext;
  
  // Log cada vez que el cart cambia
  console.log('🛒 CartModal - cart prop:', cart);
  console.log('🛒 CartModal - cart.lines:', cart?.lines?.length);
  const quantityRef = useRef(cart?.totalQuantity);
  
  console.log('🛒 CartModal component render - cart:', cart);
  console.log('🛒 CartModal component render - isOpen:', isOpen);

  useEffect(() => {
    if (!cart) {
      createCartAndSetCookie();
    }
  }, [cart]);

  useEffect(() => {
    console.log('🛒 CartModal - Cart updated:', {
      totalQuantity: cart?.totalQuantity,
      previousQuantity: quantityRef.current,
      isOpen,
      lines: cart?.lines?.length
    });
    
    if (
      cart?.totalQuantity &&
      cart?.totalQuantity !== quantityRef.current &&
      cart?.totalQuantity > 0
    ) {
      console.log('🛒 Abriendo carrito automáticamente...');
      if (!isOpen) {
        openCart();
      }
      quantityRef.current = cart?.totalQuantity;
    }
  }, [isOpen, cart?.totalQuantity, quantityRef, openCart]);

  // Agregar un useEffect para detectar cambios en el carrito
  useEffect(() => {
    console.log('🛒 CartModal - Cart changed:', {
      cart: cart,
      lines: cart?.lines?.length,
      totalQuantity: cart?.totalQuantity
    });
  }, [cart]);


  const handleClose = useCallback(() => {
    if (!cartRef.current) return;
    
    const tl = gsap.timeline({
      onComplete: () => {
        closeCart();
      },
    });

    tl.to(cartRef.current, {
      x: '100%',
      duration: 1,
      ease: 'hop',
      pointerEvents: 'none',
    });
  }, [closeCart]);

  // Manejar clicks fuera del carrito
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        cartRef.current &&
        !cartRef.current.contains(e.target as Node) &&
        isOpen
      ) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen, handleClose]);

  // Animación GSAP para abrir el carrito y animar los elementos revealer
  useGSAP(() => {
    if (isOpen && cartRef.current) {
      // Configurar posición inicial de los elementos revealer (solo dentro de cart-items, excluyendo cart-nav y cart-summary)
      const revealerElements = cartRef.current.querySelectorAll('.cart-item .revealer p, .cart-item .revealer span');
      if (revealerElements && revealerElements.length > 0) {
        gsap.set(revealerElements, {
          y: '100%',
        });
      }

      // Configurar posición inicial del precio del subtotal (solo el precio, no el texto "Subtotal")
      const subtotalPrice = cartRef.current.querySelectorAll('.cart-summary .cart-summary-row:nth-child(2) .revealer:last-child p');
      if (subtotalPrice && subtotalPrice.length > 0) {
        gsap.set(subtotalPrice, {
          y: '100%',
        });
      }

      // Configurar posición inicial del texto del botón Checkout
      const checkoutButtonText = cartRef.current.querySelectorAll('.checkout-btn .revealer p');
      if (checkoutButtonText && checkoutButtonText.length > 0) {
        gsap.set(checkoutButtonText, {
          y: '100%',
        });
      }

      // Configurar posición inicial de las imágenes de los productos
      const productImages = cartRef.current.querySelectorAll('.cart-item-img');
      if (productImages && productImages.length > 0) {
        gsap.set(productImages, {
          opacity: 0,
        });
      }

      // Animar el sidebar
      const sidebarTween = gsap.to(cartRef.current, {
        x: '0%',
        duration: 1,
        ease: 'hop',
        pointerEvents: 'all',
      });

      // Animar los elementos revealer con stagger, empezando después de un pequeño delay
      setTimeout(() => {
        // Recolectar todos los elementos que deben animarse con stagger
        const allRevealerElements: HTMLElement[] = [];
        
        // Agregar párrafos dentro de cart-items
        const revealerParagraphs = cartRef.current?.querySelectorAll('.cart-item .revealer p');
        if (revealerParagraphs && revealerParagraphs.length > 0) {
          revealerParagraphs.forEach(el => allRevealerElements.push(el as HTMLElement));
        }

        // Agregar spans dentro de cart-items (talla, color, cantidad)
        const revealerSpans = cartRef.current?.querySelectorAll('.cart-item .revealer span');
        if (revealerSpans && revealerSpans.length > 0) {
          revealerSpans.forEach(el => allRevealerElements.push(el as HTMLElement));
        }

        // Agregar el precio del subtotal
        const subtotalPrice = cartRef.current?.querySelectorAll('.cart-summary .cart-summary-row:nth-child(2) .revealer:last-child p');
        if (subtotalPrice && subtotalPrice.length > 0) {
          subtotalPrice.forEach(el => allRevealerElements.push(el as HTMLElement));
        }

        // Agregar el texto del botón Checkout
        const checkoutButtonText = cartRef.current?.querySelectorAll('.checkout-btn .revealer p');
        if (checkoutButtonText && checkoutButtonText.length > 0) {
          checkoutButtonText.forEach(el => allRevealerElements.push(el as HTMLElement));
        }

        // Animar todos los elementos con stagger
        if (allRevealerElements.length > 0) {
          gsap.to(allRevealerElements, {
            y: '0%',
            duration: 0.75,
            ease: 'power3.out',
            stagger: 0.05,
          });
        }

        // Animar las imágenes de los productos con fade
        const productImagesAfter = cartRef.current?.querySelectorAll('.cart-item-img');
        if (productImagesAfter && productImagesAfter.length > 0) {
          gsap.to(productImagesAfter, {
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out',
            stagger: 0.08,
          });
        }
      }, 300); // Empezar la animación después de 300ms (mientras el sidebar se está abriendo)
    } else if (!isOpen && cartRef.current) {
      // Asegurar que el carrito esté fuera de la pantalla cuando está cerrado
      gsap.set(cartRef.current, {
        x: '100%',
        pointerEvents: 'none',
      });
      
      // Resetear posición de los elementos revealer (solo dentro de cart-items)
      const revealerElements = cartRef.current.querySelectorAll('.cart-item .revealer p, .cart-item .revealer span');
      if (revealerElements && revealerElements.length > 0) {
        gsap.set(revealerElements, {
          y: '100%',
        });
      }

      // Resetear posición del precio del subtotal
      const subtotalPrice = cartRef.current.querySelectorAll('.cart-summary .cart-summary-row:nth-child(2) .revealer:last-child p');
      if (subtotalPrice && subtotalPrice.length > 0) {
        gsap.set(subtotalPrice, {
          y: '100%',
        });
      }

      // Resetear posición del texto del botón Checkout
      const checkoutButtonText = cartRef.current.querySelectorAll('.checkout-btn .revealer p');
      if (checkoutButtonText && checkoutButtonText.length > 0) {
        gsap.set(checkoutButtonText, {
          y: '100%',
        });
      }

      // Resetear opacidad de las imágenes
      const productImages = cartRef.current.querySelectorAll('.cart-item-img');
      if (productImages && productImages.length > 0) {
        gsap.set(productImages, {
          opacity: 0,
        });
      }
    }
  }, [isOpen]);

  console.log('🛒 CartModal render - isOpen:', isOpen, 'cart lines:', cart?.lines?.length);
  
  return (
    <>
      <div className="cart-overlay" ref={overlayRef} />
      <div className="cart-sidebar" ref={cartRef}>
        <div className="cart-nav">
          <div className="revealer">
            <p>{t('cart.bag')}</p>
          </div>
          <div
            className="revealer"
            id="close-cart-sidebar"
            onClick={handleClose}
          >
            <p>{t('cart.close')}</p>
          </div>
               </div>

        <div className="cart-items" data-lenis-prevent={true}>
              {!cart || cart.lines.length === 0 ? (
            <div className="empty-cart">
              <p>{t('cart.emptyBag')}</p>
                </div>
              ) : (
            cart.lines
                      .sort((a, b) =>
                        a.merchandise.product.title.localeCompare(
                          b.merchandise.product.title
                        )
                      )
                      .map((item, i) => {
                        const merchandiseSearchParams =
                          {} as MerchandiseSearchParams;

                        item.merchandise.selectedOptions.forEach(
                          ({ name, value }) => {
                            if (value !== DEFAULT_OPTION) {
                      merchandiseSearchParams[name.toLowerCase()] = value;
                            }
                          }
                        );

                        const merchandiseUrl = createUrl(
                  `/product/${item.merchandise.product.handle || ''}`,
                          new URLSearchParams(merchandiseSearchParams)
                        );

                        return (
                  <div className="cart-item" key={i}>
                    <LinkWithTransition 
                      href={merchandiseUrl}
                      onClick={handleClose}
                      className="cart-item-img"
                      style={{ display: 'block', cursor: 'pointer' }}
                    >
                                  <Image
                                    className="h-full w-full object-cover"
                        width={200}
                        height={200}
                                    alt={
                          item.merchandise.product.featuredImage.altText ||
                                      item.merchandise.product.title
                                    }
                        src={item.merchandise.product.featuredImage.url}
                                  />
                                </LinkWithTransition>
                    <div className="cart-item-info">
                      <div className="cart-item-info-row">
                        <LinkWithTransition 
                          href={merchandiseUrl}
                          onClick={handleClose}
                          className="revealer cart-item-product-name"
                          style={{ cursor: 'pointer' }}
                        >
                          <p>{item.merchandise.product.title}</p>
                                  </LinkWithTransition>
                        <div className="revealer cart-item-product-price">
                                <Price
                                  amount={item.cost.totalAmount.amount}
                            currencyCode={item.cost.totalAmount.currencyCode || 'USD'}
                                />
                        </div>
                      </div>
                      <div className="cart-item-info-row" style={{ marginTop: '0.5em' }}>
                        <div className="revealer" style={{ display: 'flex', gap: '1em', alignItems: 'center' }}>
                          {item.merchandise.selectedOptions
                            .filter(option => {
                              const name = option.name.toLowerCase();
                              return (name.includes('size') || name.includes('talla')) && option.value !== DEFAULT_OPTION;
                            })
                            .map((option, idx) => (
                              <span key={idx} style={{ color: '#fff', fontSize: '0.875rem', opacity: 0.8 }}>
                                {t('cart.size')}: {option.value}
                              </span>
                            ))}
                          {item.merchandise.selectedOptions
                            .filter(option => {
                              const name = option.name.toLowerCase();
                              return (name.includes('color') || name.includes('colour')) && option.value !== DEFAULT_OPTION;
                            })
                            .map((option, idx) => (
                              <span key={idx} style={{ color: '#fff', fontSize: '0.875rem', opacity: 0.8 }}>
                                {t('cart.color')}: {option.value}
                              </span>
                            ))}
                        </div>
                      </div>
                      <div className="cart-item-info-row">
                        <div className="revealer" style={{ display: 'flex', alignItems: 'center', gap: '0.5em' }}>
                                  <EditItemQuantityButton
                                    item={item}
                                    type="minus"
                                    optimisticUpdate={updateCartItem}
                                  />
                          <span style={{ color: '#fff' }}>
                                      {item.quantity}
                                    </span>
                                  <EditItemQuantityButton
                                    item={item}
                                    type="plus"
                                    optimisticUpdate={updateCartItem}
                                  />
                        </div>
                        <div className="revealer cart-item-remove-btn">
                          <DeleteItemButton
                            item={item}
                            optimisticUpdate={updateCartItem}
                          />
                        </div>
                                </div>
                              </div>
                            </div>
                        );
              })
                       )}
                     </div>
        {cart && cart.lines.length > 0 && (
          <div className="cart-summary">
            <div className="cart-summary-row">
              <div className="revealer">
                <p>{t('cart.shipping')}</p>
              </div>
              <div className="revealer">
                <p>{t('cart.atCheckout')}</p>
              </div>
            </div>
            <div className="cart-summary-row">
              <div className="revealer">
                <p>{t('cart.subtotal')}</p>
                     </div>
              <div className="revealer">
                       <Price
                         amount={cart.cost.totalAmount.amount}
                  currencyCode={cart.cost.totalAmount.currencyCode || 'USD'}
                       />
                     </div>
                   </div>
            <div className="cart-summary-row">
              <form action={redirectToCheckout} style={{ width: '100%' }}>
                <button type="submit" className="checkout-btn">
                  <div className="revealer">
                    <p>{t('cart.checkout')}</p>
                  </div>
                </button>
                  </form>
            </div>
                </div>
              )}
              </div>
    </>
  );
}

