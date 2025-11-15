'use client';

import LinkWithTransition from 'components/link-with-transition';
import Image from "next/image";
import { useEffect, useState } from "react";
import { FiArrowUpRight } from "react-icons/fi";

export default function Welcome() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  return (
    <div className="relative h-screen overflow-hidden">
      {/* Video de fondo (fijo, debajo de todo) */}
      <video
        className="fixed inset-0 w-full h-full object-cover -z-20"
        src="/shadedbg.mp4"
        autoPlay
        muted
        loop
        playsInline
      />
      
      {/* Overlay sutil (fijo, sobre el video) */}
      <div className="fixed inset-0 bg-black/20 -z-10"></div>

      {/* Logo centrado fuera del card */}
      <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
        <Image src="/logo.png" alt="Shaded Logo" width={220} height={56} priority />
      </div>
      
      {/* Contenido principal */}
      <div className="relative z-10 flex items-end justify-center h-screen">
        <div 
          className={`bg-white/10 backdrop-blur-2xl rounded-[60px] border border-white/20 p-6 md:p-8 w-full mx-4 mb-10 md:mx-4 md:max-w-lg max-h-[calc(100vh-4rem)] overflow-hidden transition-opacity duration-1000 ease-in-out ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Logo o título principal */}
          <div className="text-center mb-6">
            <h1 className="text-1xl font-medium text-white mb-4">
              Welcome to Shaded
            </h1>
            <p className="text-sm text-white/60 leading-relaxed">
              Discover our premium collection of streetwear essentials. 
              Find your perfect style with Shaded.
            </p>
          </div>

          {/* Botón de Sign In */}
          <div className="text-center mt-8">
            <LinkWithTransition 
              href="/login" 
              className="inline-block transition-all duration-200 hover:opacity-90" 
              aria-label="Sign in"
            >
              <span className="rounded-full text-lg font-medium px-24 py-5 border border-white text-white">
                Sign In
              </span>
            </LinkWithTransition>
          </div>

          {/* Enlace de registro */}
          <div className="text-center mt-6">
            <p className="text-sm text-white/70">
              Don't have an account?{' '}
              <LinkWithTransition href="/register" className="text-white hover:underline font-medium">
                Register
              </LinkWithTransition>
            </p>
          </div>

          {/* Back to home */}
          <div className="text-center mt-4">
            <LinkWithTransition href="/" className="inline-flex items-center text-sm text-white/70 hover:text-white transition-colors duration-200">
              <FiArrowUpRight className="h-4 w-4 mr-1 rotate-180" />
              Back to home
            </LinkWithTransition>
          </div>
        </div>
      </div>
    </div>
  );
}

