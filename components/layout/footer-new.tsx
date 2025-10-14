'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function FooterNew() {
  return (
    <footer className="mt-20 mb-8" style={{ backgroundColor: '#d2d5d3' }}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="relative">
          <div className="absolute inset-0 backdrop-blur-md rounded-2xl" style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderColor: 'rgba(255, 255, 255, 0.3)', 
            borderWidth: '1px', 
            borderStyle: 'solid' 
          }}></div>
          <div className="relative py-12 px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Logo y marca */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-6">
              <Image
                src="/logo.png"
                alt="Logo"
                width={120}
                height={30}
                sizes="(max-width: 768px) 100px, 120px"
                priority
              />
            </div>
            <p className="text-white/80 text-sm leading-relaxed">
              Join the movement with Shaded! Follow us on Social media for exclusive updates, style inspiration, and special offers. Be part of our community and stay connected with the latest in athleisure!
            </p>
          </div>

          {/* Políticas y soporte */}
          <div>
            <h3 className="text-white font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/return-policy" className="text-white/70 hover:text-white transition-colors text-sm">
                  Return and Exchange Policy
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="text-white/70 hover:text-white transition-colors text-sm">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-white/70 hover:text-white transition-colors text-sm">
                  Terms and Conditions
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-white/70 hover:text-white transition-colors text-sm">
                  Customer Support
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-white/70 hover:text-white transition-colors text-sm">
                  Contact Form
                </Link>
              </li>
            </ul>
          </div>

          {/* Colecciones */}
          <div>
            <h3 className="text-white font-semibold mb-4">Collections</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/productos?coleccion=serene" className="text-white/70 hover:text-white transition-colors text-sm">
                  INTRODUCING SERENE
                </Link>
              </li>
              <li>
                <Link href="/coleccion" className="text-white/70 hover:text-white transition-colors text-sm">
                  All Collections
                </Link>
              </li>
            </ul>
          </div>

          {/* Redes sociales */}
          <div>
            <h3 className="text-white font-semibold mb-4">Connect with us</h3>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-white transition-colors text-sm"
              >
                Facebook
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-white transition-colors text-sm"
              >
                Instagram
              </a>
            </div>
          </div>
            </div>

            {/* Línea divisoria y copyright */}
            <div className="border-t border-white/20 mt-8 pt-8">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <p className="text-white/60 text-sm">
                  © 2024 Shaded. All rights reserved.
                </p>
                <div className="flex space-x-6 mt-4 md:mt-0">
                  <Link href="/privacy" className="text-white/60 hover:text-white transition-colors text-sm">
                    Privacy Policy
                  </Link>
                  <Link href="/cookies" className="text-white/60 hover:text-white transition-colors text-sm">
                    Cookie Policy
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
