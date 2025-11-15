'use client';

import { useAuth } from 'components/auth/auth-context';
import LinkWithTransition from 'components/link-with-transition';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FiArrowLeft, FiPackage } from 'react-icons/fi';

interface Order {
  id: string;
  orderNumber: number;
  processedAt: string;
  totalPrice: {
    amount: string;
    currencyCode: string;
  };
  statusUrl: string;
  lineItems: {
    edges: Array<{
      node: {
        title: string;
        quantity: number;
        variant: {
          id: string;
          title: string;
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

export default function MisOrdenes() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { customer, isLoading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !customer) {
      router.push('/login');
      return;
    }

    if (customer) {
      fetchOrders();
    }
  }, [customer, authLoading, router]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/customer/orders');
      const data = await response.json();
      
      if (response.ok) {
        setOrders(data.orders || []);
      } else {
        console.error('Error fetching orders:', data.error);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
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

  const formatPrice = (amount: string, currencyCode: string) => {
    const currency = currencyCode || 'USD';
    const numericAmount = amount ? parseFloat(amount) : 0;
    
    try {
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency
      }).format(numericAmount);
      
      // Formato: USD $0.00
      return `${currency} ${formatted}`;
    } catch (error) {
      console.warn('Error formatting price:', error);
      return `USD $${numericAmount.toFixed(2)}`;
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen relative" style={{ backgroundColor: '#d2d5d3' }}>
        <div className="relative z-10 pt-40 px-4 pb-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse space-y-8">
              <div className="h-8 bg-gray-300 rounded w-1/4"></div>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white/20 rounded-2xl p-6">
                    <div className="h-4 bg-gray-300 rounded w-1/3 mb-4"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: '#d2d5d3' }}>
      {/* Contenido principal */}
      <div className="relative z-10 pt-40 px-4 pb-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center mb-8">
            <LinkWithTransition 
              href="/"
              className="mr-4 p-2 hover:bg-black/5 rounded-full transition-colors duration-200"
            >
              <FiArrowLeft className="h-6 w-6" style={{ color: '#2E2E2C' }} />
            </LinkWithTransition>
            <h1 className="text-4xl font-bold uppercase" style={{ color: '#2E2E2C' }}>
              Mis Órdenes
            </h1>
          </div>

          {/* Customer info */}
          {customer && (
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 mb-8">
              <h2 className="text-xl font-medium mb-2" style={{ color: '#2E2E2C' }}>
                Bienvenido, {customer.firstName}
              </h2>
              <p className="text-sm opacity-80" style={{ color: '#2E2E2C' }}>
                Aquí puedes ver el historial de tus pedidos
              </p>
            </div>
          )}

          {/* Orders List */}
          {orders.length === 0 ? (
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-12 text-center">
              <FiPackage className="h-16 w-16 mx-auto mb-4 opacity-50" style={{ color: '#2E2E2C' }} />
              <h3 className="text-xl font-medium mb-2" style={{ color: '#2E2E2C' }}>
                No tienes órdenes aún
              </h3>
              <p className="text-sm opacity-80 mb-6" style={{ color: '#2E2E2C' }}>
                Cuando realices tu primera compra, aparecerá aquí
              </p>
              <LinkWithTransition 
                href="/productos"
                className="inline-block bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors duration-200"
              >
                Explorar Productos
              </LinkWithTransition>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order.id} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                  {/* Order Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-medium" style={{ color: '#2E2E2C' }}>
                        Orden #{order.orderNumber}
                      </h3>
                      <p className="text-sm opacity-80" style={{ color: '#2E2E2C' }}>
                        {formatDate(order.processedAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold" style={{ color: '#2E2E2C' }}>
                        {formatPrice(order.totalPrice.amount, order.totalPrice.currencyCode)}
                      </p>
                      <LinkWithTransition
                        href={`/orden/${order.orderNumber}`}
                        className="text-sm underline hover:no-underline transition-all duration-200"
                        style={{ color: '#2E2E2C' }}
                      >
                        Ver estado
                      </LinkWithTransition>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-3">
                    {order.lineItems.edges.map(({ node: item }, index) => (
                      <div key={index} className="flex items-center space-x-4 bg-white/5 rounded-lg p-3">
                        {/* Imagen del producto con fallback */}
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
                            <FiPackage 
                              className="h-8 w-8 text-gray-400" 
                            />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm" style={{ color: '#2E2E2C' }}>
                            {item.title}
                          </h4>
                          {item.variant?.title && item.variant.title !== 'Default Title' && (
                            <p className="text-xs opacity-80" style={{ color: '#2E2E2C' }}>
                              {item.variant.title}
                            </p>
                          )}
                          <p className="text-xs opacity-80" style={{ color: '#2E2E2C' }}>
                            Cantidad: {item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
