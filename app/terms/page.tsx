'use client';

export default function Terms() {
  return (
    <div className="min-h-screen relative" style={{ backgroundColor: '#d2d5d3' }}>
      
      {/* Contenido principal */}
      <div className="relative z-10 pt-40 px-4 pb-8">
        <div className="max-w-4xl mx-auto">
          {/* Título de la página */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold uppercase mb-4" style={{ color: '#2E2E2C', fontFamily: 'Agressive' }}>
              Terms and Conditions
            </h1>
            <p className="text-lg opacity-80" style={{ color: '#2E2E2C' }}>
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          {/* Card con el contenido */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8">
            <div className="prose prose-lg max-w-none" style={{ color: '#2E2E2C' }}>
              <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
              <p className="mb-6">
                By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.
              </p>

              <h2 className="text-2xl font-semibold mb-4">2. Use License</h2>
              <p className="mb-6">
                Permission is granted to temporarily download one copy of the materials on Shaded's website for personal, non-commercial transitory viewing only.
              </p>

              <h2 className="text-2xl font-semibold mb-4">3. Disclaimer</h2>
              <p className="mb-6">
                The materials on Shaded's website are provided on an 'as is' basis. Shaded makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
              </p>

              <h2 className="text-2xl font-semibold mb-4">4. Limitations</h2>
              <p className="mb-6">
                In no event shall Shaded or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Shaded's website, even if Shaded or a Shaded authorized representative has been notified orally or in writing of the possibility of such damage.
              </p>

              <h2 className="text-2xl font-semibold mb-4">5. Accuracy of materials</h2>
              <p className="mb-6">
                The materials appearing on Shaded's website could include technical, typographical, or photographic errors. Shaded does not warrant that any of the materials on its website are accurate, complete or current.
              </p>

              <h2 className="text-2xl font-semibold mb-4">6. Links</h2>
              <p className="mb-6">
                Shaded has not reviewed all of the sites linked to our website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Shaded of the site.
              </p>

              <h2 className="text-2xl font-semibold mb-4">7. Modifications</h2>
              <p className="mb-6">
                Shaded may revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.
              </p>

              <h2 className="text-2xl font-semibold mb-4">8. Governing Law</h2>
              <p className="mb-6">
                These terms and conditions are governed by and construed in accordance with the laws of the United States and you irrevocably submit to the exclusive jurisdiction of the courts in that state or location.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

