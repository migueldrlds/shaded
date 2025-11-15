'use client';

import { useAuth } from 'components/auth/auth-context';
import LinkWithTransition from 'components/link-with-transition';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FiArrowLeft, FiCheckCircle, FiPackage } from 'react-icons/fi';

interface OrderDetail {
  id: string;
  orderNumber: number;
  processedAt: string;
  totalPrice: {
    amount: string;
    currencyCode: string;
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

interface ReturnItem {
  variantId: string;
  title: string;
  variantTitle: string;
  quantity: number;
  maxQuantity: number;
  price: string;
  currencyCode: string;
  imageUrl?: string;
  imageAlt?: string;
  reason: string;
}

const returnReasons = [
  'Size was too small',
  'Size was too large', 
  'Changed my mind',
  'Item not as described',
  'Received the wrong item',
  'Damaged or defective',
  'Style',
  'Color',
  'Other'
];

export default function SolicitudDevolucion({ params }: { params: Promise<{ id: string }> }) {
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [returnItems, setReturnItems] = useState<ReturnItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const { customer, isLoading: authLoading } = useAuth();
  const router = useRouter();

  // Resolve params first
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
        
        // Verificar si hay lineItems
        if (!data.order.lineItems || !data.order.lineItems.edges || data.order.lineItems.edges.length === 0) {
          setReturnItems([]);
          return;
        }
        
        // Initialize return items - preseleccionados para devolver
        const items: ReturnItem[] = data.order.lineItems.edges
          .filter(({ node: item }: any) => item && item.title)
          .map(({ node: item }: any) => {
            // Generar un ID único si no hay variant
            const variantId = item?.variant?.id || `item-${item.title?.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}`;
            
            return {
              variantId: variantId,
              title: item?.title || 'Producto sin nombre',
              variantTitle: item?.variant?.title || 'Default Title',
              quantity: item?.quantity || 1, // Preseleccionar para devolver
              maxQuantity: item?.quantity || 1,
              price: item?.variant?.price?.amount || '0.00',
              currencyCode: item?.variant?.price?.currencyCode || data.order.totalPrice?.currencyCode || 'USD',
              imageUrl: item?.variant?.image?.url || null,
              imageAlt: item?.variant?.image?.altText || item?.title || 'Product image',
              reason: ''
            };
          });
        
        setReturnItems(items);
      } else {
        console.error('Error fetching order detail:', data.error);
        router.push('/mis-ordenes');
      }
    } catch (error) {
      console.error('Error fetching order detail:', error);
      router.push('/mis-ordenes');
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (amount: string | null | undefined, currencyCode: string | null | undefined) => {
    const currency = currencyCode || 'USD';
    const numericAmount = amount ? parseFloat(amount) : 0;
    
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency
      }).format(numericAmount);
    } catch (error) {
      console.warn('Error formatting price:', error);
      return `USD $${numericAmount.toFixed(2)}`;
    }
  };

  const updateItemQuantity = (variantId: string, quantity: number) => {
    setReturnItems(items => items.map(item => 
      item.variantId === variantId 
        ? { ...item, quantity: Math.max(0, Math.min(quantity, item.maxQuantity)) }
        : item
    ));
  };

  const updateItemReason = (variantId: string, reason: string) => {
    setReturnItems(items => items.map(item => 
      item.variantId === variantId 
        ? { ...item, reason }
        : item
    ));
  };

  const getReturnTotal = () => {
    return returnItems.reduce((total, item) => {
      if (item.quantity > 0) {
        return total + (parseFloat(item.price) * item.quantity);
      }
      return total;
    }, 0);
  };

  const getSelectedItemsCount = () => {
    return returnItems.filter(item => item.quantity > 0).length;
  };

  const handleSubmitReturn = async () => {
    // Check if all items have reasons (todos están preseleccionados)
    const itemsWithoutReason = returnItems.filter(item => !item.reason);
    if (itemsWithoutReason.length > 0) {
      alert('Por favor selecciona una razón para la devolución');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/returns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: order?.id,
          orderNumber: order?.orderNumber,
          returnItems: returnItems // Todos los items están preseleccionados
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setShowSuccess(true);
        
        // Redirect after 3 seconds
        setTimeout(() => {
          router.push(`/orden/${orderId}`);
        }, 3000);
      } else {
        alert(data.error || 'Error al procesar la solicitud de devolución');
      }
    } catch (error) {
      console.error('Error submitting return request:', error);
      alert('Error al procesar la solicitud de devolución');
    } finally {
      setIsSubmitting(false);
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
              Orden no encontrada
            </h1>
            <LinkWithTransition 
              href="/mis-ordenes"
              className="inline-block bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors duration-200"
            >
              Volver a Mis Órdenes
            </LinkWithTransition>
          </div>
        </div>
      </div>
    );
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen relative" style={{ backgroundColor: '#d2d5d3' }}>
        <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 text-center max-w-md">
            <FiCheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#2E2E2C' }}>
              ¡Solicitud enviada!
            </h2>
            <p className="text-sm opacity-80 mb-6" style={{ color: '#2E2E2C' }}>
              Tu solicitud de devolución ha sido enviada. Te contactaremos pronto con los siguientes pasos.
            </p>
            <div className="animate-pulse">
              <div className="h-2 bg-gray-300 rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: '#d2d5d3' }}>
      <div className="relative z-10 pt-40 px-4 pb-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center mb-8">
            <LinkWithTransition 
              href={`/orden/${order.orderNumber}`}
              className="mr-4 p-2 hover:bg-black/5 rounded-full transition-colors duration-200"
            >
              <FiArrowLeft className="h-6 w-6" style={{ color: '#2E2E2C' }} />
            </LinkWithTransition>
            <div>
              <h1 className="text-4xl font-bold uppercase" style={{ color: '#2E2E2C' }}>
                Solicitar devolución
              </h1>
              <p className="text-sm opacity-80 mt-1" style={{ color: '#2E2E2C' }}>
                Orden #{order.orderNumber}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Columna principal */}
            <div className="lg:col-span-2 space-y-6">
              {/* Producto a devolver */}
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                <h3 className="text-xl font-medium mb-6" style={{ color: '#2E2E2C' }}>
                  Producto a devolver
                </h3>
                {returnItems.length === 0 ? (
                  <div className="text-center py-8" style={{ color: '#2E2E2C' }}>
                    <FiPackage className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">No hay productos disponibles para devolver</p>
                    <p className="text-sm opacity-70">Esta orden puede que ya no sea elegible para devoluciones</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {returnItems.map((item, index) => (
                    <div key={item.variantId} className="border border-white/20 rounded-lg p-6">
                      <div className="flex items-start space-x-4 mb-6">
                        {/* Imagen del producto */}
                        <div className="w-20 h-20 bg-white rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                          {item.imageUrl ? (
                            <Image
                              src={item.imageUrl}
                              alt={item.imageAlt || item.title}
                              width={80}
                              height={80}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <FiPackage className="h-10 w-10 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-medium mb-2" style={{ color: '#2E2E2C' }}>
                            {item.title}
                          </h4>
                          {item.variantTitle && item.variantTitle !== 'Default Title' && (
                            <p className="text-sm opacity-80 mb-2" style={{ color: '#2E2E2C' }}>
                              {item.variantTitle}
                            </p>
                          )}
                          {item.price && (
                            <p className="text-sm font-medium mb-2" style={{ color: '#2E2E2C' }}>
                              {formatPrice(item.price, item.currencyCode)}
                            </p>
                          )}
                          <p className="text-sm opacity-80" style={{ color: '#2E2E2C' }}>
                            Cantidad: {item.maxQuantity}
                          </p>
                        </div>
                      </div>
                      
                      {/* Razón de devolución */}
                      <div>
                        <label className="block text-sm font-medium mb-3" style={{ color: '#2E2E2C' }}>
                          ¿Por qué lo quieres devolver?
                        </label>
                        <select
                          value={item.reason}
                          onChange={(e) => updateItemReason(item.variantId, e.target.value)}
                          className="w-full bg-white/20 backdrop-blur-xl border border-white/20 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
                          style={{ color: '#2E2E2C' }}
                        >
                          <option value="">Seleccionar razón</option>
                          {returnReasons.map(reason => (
                            <option key={reason} value={reason} className="bg-white text-black">
                              {reason}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar - Resumen */}
            <div className="space-y-6">
              {/* Resumen de devolución */}
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                <h3 className="text-xl font-medium mb-4" style={{ color: '#2E2E2C' }}>
                  Devolución
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between" style={{ color: '#2E2E2C' }}>
                    <span>{getSelectedItemsCount()} item(s)</span>
                    <span>
                      {formatPrice(getReturnTotal().toString(), order?.totalPrice?.currencyCode || 'USD')}
                    </span>
                  </div>
                </div>
                
                <div className="mt-6">
                  <p className="text-xs opacity-80 mb-4" style={{ color: '#2E2E2C' }}>
                    La elegibilidad de devolución y reembolso se basará en nuestra política de devoluciones.
                  </p>
                  <button
                    onClick={handleSubmitReturn}
                    disabled={isSubmitting || getSelectedItemsCount() === 0}
                    className="w-full bg-black text-white py-3 rounded-full font-medium hover:bg-gray-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Procesando...' : 'Solicitar devolución'}
                  </button>
                  <button
                    onClick={() => router.push(`/orden/${order.orderNumber}`)}
                    className="w-full mt-3 border border-black/20 py-3 rounded-full font-medium hover:bg-black/5 transition-colors duration-200"
                    style={{ color: '#2E2E2C' }}
                    disabled={isSubmitting}
                  >
                    Cancelar
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
