'use client';

import Image from "next/image";
import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";

export default function Welcome() {
  return (
    <div className="relative h-screen overflow-hidden" style={{ backgroundColor: '#d2d5d3' }}>
      {/* Video de fondo */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src="/shadedbg.mp4"
        autoPlay
        muted
        loop
        playsInline
      />
      
      {/* Overlay sutil */}
      <div className="absolute inset-0 bg-black/20"></div>

      {/* Logo centrado fuera del card */}
      <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
        <Image src="/logo.png" alt="Shaded Logo" width={220} height={56} priority />
      </div>
      
      {/* Contenido principal */}
      <div className="relative z-10 flex items-end justify-center h-screen">
        <div className="bg-white/10 backdrop-blur-2xl rounded-[60px] border border-white/20 p-6 md:p-8 w-full mx-4 mb-10 md:mx-4 md:max-w-lg max-h-[calc(100vh-4rem)] overflow-hidden">
          {/* Logo o título principal */}
          <div className="text-center mb-6">
            <h1 className="text-1xl font-medium text-white mb-4" style={{ fontFamily: 'Agressive' }}>
              Welcome to Shaded
            </h1>
            <p className="text-sm text-white/60 leading-relaxed">
              Discover our premium collection of streetwear essentials. 
              Find your perfect style with Shaded.
            </p>
          </div>

          {/* Botón de Sign In */}
          <div className="text-center mt-8">
            <Link 
              href="/login" 
              className="inline-block transition-all duration-200 hover:opacity-90" 
              aria-label="Sign in"
            >
              <span className="rounded-full text-lg font-medium px-24 py-5 border border-white text-white">
                Sign In
              </span>
            </Link>
          </div>

          {/* Enlace de registro */}
          <div className="text-center mt-6">
            <p className="text-sm text-white/70">
              Don't have an account?{' '}
              <Link href="/register" className="text-white hover:underline font-medium">
                Register
              </Link>
            </p>
          </div>

          {/* Back to home */}
          <div className="text-center mt-4">
            <Link href="/" className="inline-flex items-center text-sm text-white/70 hover:text-white transition-colors duration-200">
              <FiArrowUpRight className="h-4 w-4 mr-1 rotate-180" />
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

