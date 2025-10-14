'use client';

export default function ReturnPolicy() {
  return (
    <div className="min-h-screen relative" style={{ backgroundColor: '#d2d5d3' }}>
      
      {/* Contenido principal */}
      <div className="relative z-10 pt-40 px-4 pb-8">
        <div className="max-w-4xl mx-auto">
          {/* Título de la página */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold uppercase mb-4" style={{ color: '#2E2E2C', fontFamily: 'Agressive' }}>
              Return and Exchange Policy
            </h1>
            <p className="text-lg opacity-80" style={{ color: '#2E2E2C' }}>
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          {/* Card con el contenido */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8">
            <div className="prose prose-lg max-w-none" style={{ color: '#2E2E2C' }}>
              <h2 className="text-2xl font-semibold mb-4">Return Policy</h2>
              <p className="mb-6">
                We offer a 30-day return policy for all items in original condition. Items must be unworn, unwashed, and with original tags attached.
              </p>

              <h2 className="text-2xl font-semibold mb-4">Eligible Items</h2>
              <ul className="mb-6 space-y-2">
                <li>• All clothing items in original condition</li>
                <li>• Items with original tags and packaging</li>
                <li>• Items purchased within the last 30 days</li>
              </ul>

              <h2 className="text-2xl font-semibold mb-4">Non-Returnable Items</h2>
              <ul className="mb-6 space-y-2">
                <li>• Items worn or washed</li>
                <li>• Items without original tags</li>
                <li>• Custom or personalized items</li>
                <li>• Sale items marked as final sale</li>
              </ul>

              <h2 className="text-2xl font-semibold mb-4">How to Return</h2>
              <ol className="mb-6 space-y-2">
                <li>1. Contact our customer service team</li>
                <li>2. Receive your return authorization number</li>
                <li>3. Package items securely with original tags</li>
                <li>4. Ship items back using prepaid return label</li>
              </ol>

              <h2 className="text-2xl font-semibold mb-4">Exchange Policy</h2>
              <p className="mb-6">
                We offer free exchanges for different sizes or colors of the same item. Exchanges are subject to availability and must be requested within 30 days of purchase.
              </p>

              <h2 className="text-2xl font-semibold mb-4">Refund Process</h2>
              <p className="mb-6">
                Once we receive your return, we will process your refund within 5-7 business days. Refunds will be issued to the original payment method.
              </p>

              <h2 className="text-2xl font-semibold mb-4">Return Shipping</h2>
              <p className="mb-6">
                We provide prepaid return labels for all returns. Return shipping costs will be deducted from your refund unless the return is due to our error.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

