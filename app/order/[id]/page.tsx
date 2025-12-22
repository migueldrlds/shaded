'use client';

import { useAuth } from 'components/auth/auth-context';
import LinkWithTransition from 'components/link-with-transition';
import { useLanguage } from 'components/providers/language-provider';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FiArrowLeft, FiCheckCircle, FiClock, FiPackage, FiTruck } from 'react-icons/fi';

interface OrderDetail {
  id: string;
  orderNumber: number;
  processedAt: string;
  totalPrice: {
    amount: string;
    currencyCode: string;
  };
  subtotalPrice: {
    amount: string;
    currencyCode: string;
  };
  totalShippingPrice: {
    amount: string;
    currencyCode: string;
  };
  totalTax: {
    amount: string;
    currencyCode: string;
  };
  statusUrl: string;
  fulfillmentStatus: string;
  financialStatus: string;
  shippingAddress?: {
    firstName: string;
    lastName: string;
    address1: string;
    address2?: string;
    city: string;
    province: string;
    country: string;
    zip: string;
  };
  lineItems: {
    edges: Array<{
      node: {
        title: string;
        quantity: number;
        variant: {
          id: string;
          title: string;
          price: {
            amount: string;
            currencyCode: string;
          };
          image?: {
            url: string;
            altText: string;
          };
          product: {
            handle: string;
          };
        };
      };
    }>;
  };
}

export default function OrderDetail({ params }: { params: Promise<{ id: string }> }) {
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [orderId, setOrderId] = useState<string | null>(null);
  const { customer, isLoading: authLoading } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();


  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setOrderId(resolvedParams.id);
    };
    getParams();
  }, [params]);

  useEffect(() => {
    if (!authLoading && !customer) {
      router.push('/login');
      return;
    }

    if (customer && orderId) {
      fetchOrderDetail(orderId);
    }
  }, [customer, authLoading, router, orderId]);

  const fetchOrderDetail = async (orderId: string) => {
    try {
      setIsLoading(true);

      const response = await fetch(`/api/customer/orders/${orderId}`);
      const data = await response.json();

      if (response.ok) {
        setOrder(data.order);
      } else {
        console.error('Error fetching order detail:', data.error);
        router.push('/orders');
      }
    } catch (error) {
      console.error('Error fetching order detail:', error);
      router.push('/orders');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatPrice = (amount: string | null | undefined, currencyCode: string | null | undefined) => {
    const currency = currencyCode || 'USD';
    const numericAmount = amount ? parseFloat(amount) : 0;

    try {
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency
      }).format(numericAmount);


      return `${currency} ${formatted}`;
    } catch (error) {
      console.warn('Error formatting price:', error);
      return `USD $${numericAmount.toFixed(2)}`;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'fulfilled':
        return <FiCheckCircle className="h-5 w-5 text-green-600" />;
      case 'partial':
        return <FiTruck className="h-5 w-5 text-yellow-600" />;
      case 'unfulfilled':
        return <FiClock className="h-5 w-5 text-gray-600" />;
      default:
        return <FiPackage className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'fulfilled':
        return t('orders.statusFulfilled');
      case 'partial':
        return t('orders.statusPartial');
      case 'unfulfilled':
        return t('orders.statusPending');
      default:
        return t('orders.statusConfirmed');
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen relative" style={{ backgroundColor: '#d2d5d3' }}>
        <div className="relative z-10 pt-40 px-4 pb-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
              <div className="bg-white/20 rounded-2xl p-8 space-y-4">
                <div className="h-6 bg-gray-300 rounded w-1/3"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                <div className="h-4 bg-gray-300 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen relative" style={{ backgroundColor: '#d2d5d3' }}>
        <div className="relative z-10 pt-40 px-4 pb-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4" style={{ color: '#2E2E2C' }}>
              {t('order.notFound')}
            </h1>
            <LinkWithTransition
              href="/orders"
              className="inline-block bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors duration-200"
            >
              {t('order.backToOrders')}
            </LinkWithTransition>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: '#d2d5d3' }}>

      <div className="relative z-10 pt-40 px-4 pb-8">
        <div className="max-w-4xl mx-auto">

          <div className="flex items-center mb-8">
            <LinkWithTransition
              href="/orders"
              className="mr-4 p-2 hover:bg-black/5 rounded-full transition-colors duration-200"
            >
              <FiArrowLeft className="h-6 w-6" style={{ color: '#2E2E2C' }} />
            </LinkWithTransition>
            <div>
              <h1 className="text-4xl font-bold uppercase" style={{ color: '#2E2E2C' }}>
                {t('orders.orderNumber', { number: order.orderNumber })}
              </h1>
              <p className="text-sm opacity-80 mt-1" style={{ color: '#2E2E2C' }}>
                {t('orders.confirmedAt', { date: formatDate(order.processedAt) })}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            <div className="lg:col-span-2 space-y-6">

              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                <div className="flex items-center mb-4">
                  {getStatusIcon(order.fulfillmentStatus || 'confirmed')}
                  <h2 className="text-xl font-medium ml-3" style={{ color: '#2E2E2C' }}>
                    {getStatusText(order.fulfillmentStatus || 'confirmed')}
                  </h2>
                </div>
                <p className="text-sm opacity-80" style={{ color: '#2E2E2C' }}>
                  {formatDate(order.processedAt)}
                </p>
              </div>


              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                <h3 className="text-xl font-medium mb-4" style={{ color: '#2E2E2C' }}>
                  {t('order.products', { count: order.lineItems.edges.length })}
                </h3>
                <div className="space-y-4">
                  {order.lineItems.edges.map(({ node: item }, index) => (
                    <div key={index} className="flex items-center space-x-4 bg-white/5 rounded-lg p-4">

                      <div className="w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                        {item.variant?.image?.url ? (
                          <Image
                            src={item.variant.image.url}
                            alt={item.variant.image.altText || item.title}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <FiPackage className="h-8 w-8 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium" style={{ color: '#2E2E2C' }}>
                          {item.title}
                        </h4>
                        {item.variant?.title && item.variant.title !== 'Default Title' && (
                          <p className="text-sm opacity-80" style={{ color: '#2E2E2C' }}>
                            {item.variant.title}
                          </p>
                        )}
                        <p className="text-sm opacity-80" style={{ color: '#2E2E2C' }}>
                          {t('orders.quantity', { quantity: item.quantity })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium" style={{ color: '#2E2E2C' }}>
                          {formatPrice(item.variant?.price?.amount, item.variant?.price?.currencyCode)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>


              {order.shippingAddress && (
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                  <h3 className="text-xl font-medium mb-4" style={{ color: '#2E2E2C' }}>
                    {t('order.shippingAddress')}
                  </h3>
                  <div className="text-sm" style={{ color: '#2E2E2C' }}>
                    <p>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                    <p>{order.shippingAddress.address1}</p>
                    {order.shippingAddress.address2 && <p>{order.shippingAddress.address2}</p>}
                    <p>{order.shippingAddress.city}, {order.shippingAddress.province} {order.shippingAddress.zip}</p>
                    <p>{order.shippingAddress.country}</p>
                  </div>
                </div>
              )}
            </div>


            <div className="space-y-6">

              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                <h3 className="text-xl font-medium mb-4" style={{ color: '#2E2E2C' }}>
                  {t('order.summary')}
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between" style={{ color: '#2E2E2C' }}>
                    <span>{t('order.subtotal')}</span>
                    <span>
                      {formatPrice(
                        order.subtotalPrice?.amount || order.totalPrice?.amount,
                        order.totalPrice?.currencyCode || 'USD'
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between" style={{ color: '#2E2E2C' }}>
                    <span>{t('order.shipping')}</span>
                    <span>
                      {order.totalShippingPrice?.amount && parseFloat(order.totalShippingPrice.amount) > 0
                        ? formatPrice(order.totalShippingPrice.amount, order.totalPrice?.currencyCode || 'USD')
                        : formatPrice('0', order.totalPrice?.currencyCode || 'USD')
                      }
                    </span>
                  </div>
                  {order.totalTax?.amount && parseFloat(order.totalTax.amount) > 0 && (
                    <div className="flex justify-between" style={{ color: '#2E2E2C' }}>
                      <span>{t('order.tax')}</span>
                      <span>{formatPrice(order.totalTax.amount, order.totalPrice?.currencyCode || 'USD')}</span>
                    </div>
                  )}
                  <div className="border-t border-white/20 pt-3">
                    <div className="flex justify-between font-bold text-lg" style={{ color: '#2E2E2C' }}>
                      <span>{t('order.total')}</span>
                      <span>
                        {formatPrice(order.totalPrice?.amount, order.totalPrice?.currencyCode || 'USD')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>


              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                <div className="space-y-3">
                  <LinkWithTransition
                    href={`/returns/${order.orderNumber}`}
                    className="block w-full bg-black text-white text-center py-3 rounded-full font-medium hover:bg-gray-800 transition-colors duration-200"
                  >
                    {t('order.returnRequest')}
                  </LinkWithTransition>
                  <a
                    href={order.statusUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full border border-black/20 text-center py-3 rounded-full font-medium hover:bg-black/5 transition-colors duration-200"
                    style={{ color: '#2E2E2C' }}
                  >
                    {t('order.viewInShopify')}
                  </a>
                  <button className="block w-full border border-black/20 text-center py-3 rounded-full font-medium hover:bg-black/5 transition-colors duration-200" style={{ color: '#2E2E2C' }}>
                    {t('order.buyAgain')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
