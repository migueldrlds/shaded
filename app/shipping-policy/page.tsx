'use client';

export default function ShippingPolicy() {
  return (
    <div className="min-h-screen relative" style={{ backgroundColor: '#d2d5d3' }}>
      
      {/* Contenido principal */}
      <div className="relative z-10 pt-40 px-4 pb-8">
        <div className="max-w-4xl mx-auto">
          {/* Título de la página */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold uppercase mb-4" style={{ color: '#2E2E2C', fontFamily: 'Agressive' }}>
              Shipping Policy
            </h1>
            <p className="text-lg opacity-80" style={{ color: '#2E2E2C' }}>
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          {/* Card con el contenido */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8">
            <div className="prose prose-lg max-w-none" style={{ color: '#2E2E2C' }}>
              <h2 className="text-2xl font-semibold mb-4">Shipping Information</h2>
              <p className="mb-6">
                We offer fast and reliable shipping to customers worldwide. All orders are processed and shipped within 1-2 business days.
              </p>

              <h2 className="text-2xl font-semibold mb-4">Shipping Methods</h2>
              <ul className="mb-6 space-y-2">
                <li>• Standard Shipping: 5-7 business days</li>
                <li>• Express Shipping: 2-3 business days</li>
                <li>• Overnight Shipping: 1 business day (US only)</li>
              </ul>

              <h2 className="text-2xl font-semibold mb-4">Shipping Costs</h2>
              <p className="mb-6">
                Shipping costs are calculated at checkout based on your location and selected shipping method. Free shipping is available on orders over $75.
              </p>

              <h2 className="text-2xl font-semibold mb-4">International Shipping</h2>
              <p className="mb-6">
                We ship to most countries worldwide. International orders may be subject to customs duties and taxes, which are the responsibility of the customer.
              </p>

              <h2 className="text-2xl font-semibold mb-4">Order Tracking</h2>
              <p className="mb-6">
                Once your order ships, you will receive a tracking number via email. You can track your package using this number on the carrier's website.
              </p>

              <h2 className="text-2xl font-semibold mb-4">Delivery Issues</h2>
              <p className="mb-6">
                If you experience any issues with delivery, please contact our customer service team within 30 days of the expected delivery date.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

