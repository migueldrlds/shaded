'use client';

export default function Support() {
  return (
    <div className="min-h-screen relative" style={{ backgroundColor: '#d2d5d3' }}>
      
      {/* Contenido principal */}
      <div className="relative z-10 pt-40 px-4 pb-8">
        <div className="max-w-4xl mx-auto">
          {/* Título de la página */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold uppercase mb-4" style={{ color: '#2E2E2C', fontFamily: 'Agressive' }}>
              Customer Support
            </h1>
            <p className="text-lg opacity-80" style={{ color: '#2E2E2C' }}>
              We're here to help you with any questions or concerns
            </p>
          </div>

          {/* Card con el contenido */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Información de contacto */}
              <div>
                <h2 className="text-2xl font-semibold mb-4" style={{ color: '#2E2E2C' }}>Contact Information</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2" style={{ color: '#2E2E2C' }}>Email Support</h3>
                    <p className="text-sm opacity-80" style={{ color: '#2E2E2C' }}>support@shaded.com</p>
                    <p className="text-xs opacity-60" style={{ color: '#2E2E2C' }}>Response within 24-48 hours</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2" style={{ color: '#2E2E2C' }}>Phone Support</h3>
                    <p className="text-sm opacity-80" style={{ color: '#2E2E2C' }}>+1 (555) 123-4567</p>
                    <p className="text-xs opacity-60" style={{ color: '#2E2E2C' }}>Mon-Fri 9AM-6PM EST</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2" style={{ color: '#2E2E2C' }}>Live Chat</h3>
                    <p className="text-sm opacity-80" style={{ color: '#2E2E2C' }}>Available on our website</p>
                    <p className="text-xs opacity-60" style={{ color: '#2E2E2C' }}>Mon-Fri 9AM-6PM EST</p>
                  </div>
                </div>
              </div>

              {/* Preguntas frecuentes */}
              <div>
                <h2 className="text-2xl font-semibold mb-4" style={{ color: '#2E2E2C' }}>Frequently Asked Questions</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2" style={{ color: '#2E2E2C' }}>How do I track my order?</h3>
                    <p className="text-sm opacity-80" style={{ color: '#2E2E2C' }}>You'll receive a tracking number via email once your order ships.</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2" style={{ color: '#2E2E2C' }}>What is your return policy?</h3>
                    <p className="text-sm opacity-80" style={{ color: '#2E2E2C' }}>We offer 30-day returns on all items in original condition.</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2" style={{ color: '#2E2E2C' }}>Do you ship internationally?</h3>
                    <p className="text-sm opacity-80" style={{ color: '#2E2E2C' }}>Yes, we ship to most countries worldwide.</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2" style={{ color: '#2E2E2C' }}>How can I change my order?</h3>
                    <p className="text-sm opacity-80" style={{ color: '#2E2E2C' }}>Contact us immediately if your order hasn't shipped yet.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Botón de contacto */}
            <div className="mt-8 text-center">
              <a 
                href="/contact" 
                className="inline-block bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors duration-200"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

