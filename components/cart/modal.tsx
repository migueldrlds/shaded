'use client';

import { Dialog, Transition } from '@headlessui/react';
import { ShoppingCartIcon, XMarkIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import LoadingDots from 'components/loading-dots';
import Price from 'components/price';
import { DEFAULT_OPTION } from 'lib/constants';
import { createUrl } from 'lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { Fragment, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { createCartAndSetCookie, redirectToCheckout } from './actions';
import { useCart } from './cart-context';
import { useCartModal } from './cart-modal-context';
import { DeleteItemButton } from './delete-item-button';
import { EditItemQuantityButton } from './edit-item-quantity-button';

type MerchandiseSearchParams = {
  [key: string]: string;
};

export default function CartModal() {
  console.log('🛒 CartModal component is rendering...');
  
  const cartContext = useCart();
  const { isOpen, openCart, closeCart } = useCartModal();
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

  // Prevenir el scroll del body cuando el modal esté abierto
  useEffect(() => {
    if (isOpen) {
      // Guardar el scroll actual
      const scrollY = window.scrollY;
      // Prevenir el scroll
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    } else {
      // Restaurar el scroll
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }
  }, [isOpen]);

  console.log('🛒 CartModal render - isOpen:', isOpen, 'cart lines:', cart?.lines?.length);
  
  return (
    <>
      <Transition show={isOpen}>
        <Dialog onClose={closeCart} className="relative z-[9999]">
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="opacity-0 backdrop-blur-none"
            enterTo="opacity-100 backdrop-blur-[.5px]"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="opacity-100 backdrop-blur-[.5px]"
            leaveTo="opacity-0 backdrop-blur-none"
          >
            <div 
              className="fixed inset-0 backdrop-blur-sm" 
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
              aria-hidden="true" 
            />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <Dialog.Panel className="fixed bottom-0 right-0 top-0 flex h-full w-full flex-col md:w-[390px]">
              {/* Fondo frosted glass */}
              <div 
                className="absolute inset-0 backdrop-blur-md rounded-l-2xl"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderRight: 'none'
                }}
              />
              {/* Contenido del modal */}
              <div className="relative flex h-full w-full flex-col p-6 text-white">
               <div className="flex items-center justify-between">
                 <p className="text-lg font-light">My Cart</p>
                 <button aria-label="Close cart" onClick={closeCart} className="cursor-pointer">
                   <CloseCart />
                 </button>
               </div>

              {!cart || cart.lines.length === 0 ? (
                <div className="mt-20 flex w-full flex-col items-center justify-center overflow-hidden px-4">
                  <ShoppingCartIcon className="h-16 text-white" />
                  <h2 className="mt-6 text-center text-2xl font-light text-white">
                    Your cart is empty
                  </h2>
                  <p className="mt-2 text-center text-sm font-light text-white/70">
                    There are no products in your cart,
                  </p>
                  <div className="mt-8 flex flex-col space-y-3 w-full max-w-xs">
                    <Link
                      href="/productos"
                      onClick={closeCart}
                      className="w-full px-6 py-3 text-center text-sm font-light text-white border border-white/30 rounded-full hover:bg-white/10 transition-all duration-200 cursor-pointer"
                    >
                      Shop all
                    </Link>
                    <Link
                      href="/coleccion"
                      onClick={closeCart}
                      className="w-full px-6 py-3 text-center text-sm font-light text-white border border-white/30 rounded-full hover:bg-white/10 transition-all duration-200 cursor-pointer"
                    >
                      Explore Collections
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="flex h-full flex-col justify-between overflow-hidden p-1">
                  <ul className="grow overflow-auto py-4">
                    {cart.lines
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
                              merchandiseSearchParams[name.toLowerCase()] =
                                value;
                            }
                          }
                        );

                        const merchandiseUrl = createUrl(
                          `/product/${item.merchandise.product.handle}`,
                          new URLSearchParams(merchandiseSearchParams)
                        );

                        return (
                           <li
                             key={i}
                             className="flex w-full flex-col border-b"
                             style={{ borderColor: 'rgba(255, 255, 255, 0.3)' }}
                           >
                            <div className="relative flex w-full flex-row justify-between px-1 py-4">
                              <div className="absolute z-40 -ml-1 -mt-2">
                                <DeleteItemButton
                                  item={item}
                                  optimisticUpdate={updateCartItem}
                                />
                              </div>
                              <div className="flex flex-row">
                                <div className="relative h-16 w-16 overflow-hidden rounded-md border border-neutral-300 bg-neutral-300 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800">
                                  <Image
                                    className="h-full w-full object-cover"
                                    width={64}
                                    height={64}
                                    alt={
                                      item.merchandise.product.featuredImage
                                        .altText ||
                                      item.merchandise.product.title
                                    }
                                    src={
                                      item.merchandise.product.featuredImage.url
                                    }
                                  />
                                </div>
                                <Link
                                  href={merchandiseUrl}
                                  onClick={closeCart}
                                  className="z-30 ml-2 flex flex-row space-x-4"
                                >
                                   <div className="flex flex-1 flex-col text-base">
                                     <span className="leading-tight font-light">
                                       {item.merchandise.product.title}
                                     </span>
                                     {item.merchandise.title !==
                                     DEFAULT_OPTION ? (
                                       <p className="text-sm text-white/70">
                                         {item.merchandise.title}
                                       </p>
                                     ) : null}
                                  </div>
                                </Link>
                              </div>
                              <div className="flex h-16 flex-col justify-between">
                                <Price
                                  className="flex justify-end space-y-2 text-right text-sm"
                                  amount={item.cost.totalAmount.amount}
                                  currencyCode={
                                    item.cost.totalAmount.currencyCode
                                  }
                                />
                                 <div 
                                   className="ml-auto flex h-9 flex-row items-center rounded-full border"
                                   style={{ borderColor: 'rgba(255, 255, 255, 0.3)' }}
                                 >
                                  <EditItemQuantityButton
                                    item={item}
                                    type="minus"
                                    optimisticUpdate={updateCartItem}
                                  />
                                  <p className="w-6 text-center">
                                    <span className="w-full text-sm">
                                      {item.quantity}
                                    </span>
                                  </p>
                                  <EditItemQuantityButton
                                    item={item}
                                    type="plus"
                                    optimisticUpdate={updateCartItem}
                                  />
                                </div>
                              </div>
                            </div>
                          </li>
                        );
                      })}
                  </ul>
                   <div className="py-4 text-sm text-white">
                     <div 
                       className="mb-3 flex items-center justify-between border-b pb-1"
                       style={{ borderColor: 'rgba(255, 255, 255, 0.3)' }}
                     >
                       <p className="font-light">Taxes</p>
                       <Price
                         className="text-right text-base text-white font-light"
                         amount={cart.cost.totalTaxAmount.amount}
                         currencyCode={cart.cost.totalTaxAmount.currencyCode}
                       />
                     </div>
                     <div 
                       className="mb-3 flex items-center justify-between border-b pb-1 pt-1"
                       style={{ borderColor: 'rgba(255, 255, 255, 0.3)' }}
                     >
                       <p className="font-light">Shipping</p>
                       <p className="text-right font-light">Calculated at checkout</p>
                     </div>
                     <div 
                       className="mb-3 flex items-center justify-between border-b pb-1 pt-1"
                       style={{ borderColor: 'rgba(255, 255, 255, 0.3)' }}
                     >
                       <p className="font-light">Total</p>
                       <Price
                         className="text-right text-base text-white font-light"
                         amount={cart.cost.totalAmount.amount}
                         currencyCode={cart.cost.totalAmount.currencyCode}
                       />
                     </div>
                   </div>
                  <form action={redirectToCheckout}>
                    <CheckoutButton />
                  </form>
                </div>
              )}
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
}

function CloseCart({ className }: { className?: string }) {
  return (
    <div 
      className="relative flex h-11 w-11 items-center justify-center rounded-full transition-colors"
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        border: '1px solid rgba(255, 255, 255, 0.5)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.7)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)';
      }}
    >
      <XMarkIcon
        className={clsx(
          'h-6 text-white transition-all ease-in-out',
          className
        )}
      />
    </div>
  );
}

function CheckoutButton() {
  const { pending } = useFormStatus();

  return (
     <button
       className="block w-full rounded-full p-3 text-center text-sm font-light text-black transition-all duration-200 hover:opacity-80 cursor-pointer"
       style={{
         backgroundColor: 'rgba(255, 255, 255, 0.6)',
         backdropFilter: 'blur(10px)',
         border: '1px solid rgba(255, 255, 255, 0.7)'
       }}
       onMouseEnter={(e) => {
         e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
         e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.9)';
       }}
       onMouseLeave={(e) => {
         e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.6)';
         e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.7)';
       }}
       type="submit"
       disabled={pending}
     >
      {pending ? <LoadingDots className="bg-black" /> : 'Proceed to Checkout'}
    </button>
  );
}
