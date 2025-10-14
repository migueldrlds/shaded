'use client';

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { FiArrowUpRight } from "react-icons/fi";

export default function Home() {
  const backgroundVideoRef = useRef<HTMLVideoElement>(null);
  const sereneVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let syncInterval: NodeJS.Timeout;
    let isSyncing = false;

    const syncVideos = () => {
      if (backgroundVideoRef.current && sereneVideoRef.current && !isSyncing) {
        isSyncing = true;
        
        const bgTime = backgroundVideoRef.current.currentTime;
        const sereneTime = sereneVideoRef.current.currentTime;
        const timeDiff = Math.abs(bgTime - sereneTime);
        
        // Si hay diferencia de más de 0.05 segundos, sincronizar
        if (timeDiff > 0.05) {
          // Usar el video de fondo como referencia principal
          sereneVideoRef.current.currentTime = bgTime;
        }
        
        isSyncing = false;
      }
    };

    const initializeSync = () => {
      if (backgroundVideoRef.current && sereneVideoRef.current) {
        // Esperar un poco más para que los videos estén completamente cargados
        setTimeout(() => {
          // Sincronizar inmediatamente
          if (backgroundVideoRef.current && sereneVideoRef.current) {
            const bgTime = backgroundVideoRef.current.currentTime;
            sereneVideoRef.current.currentTime = bgTime;
            
            // Iniciar sincronización continua cada 50ms para mayor precisión
            syncInterval = setInterval(syncVideos, 50);
          }
        }, 500);
      }
    };

    // Inicializar cuando el componente se monte
    const timer = setTimeout(initializeSync, 100);

    return () => {
      clearTimeout(timer);
      if (syncInterval) {
        clearInterval(syncInterval);
      }
    };
  }, []);

  return (
    <div className="relative min-h-screen">
      {/* Video de fondo */}
      <video
        ref={backgroundVideoRef}
        className="fixed inset-0 w-full h-full object-cover z-0"
        src="/videoloop2.mp4"
        autoPlay
        muted
        loop
        playsInline
      />
      
      {/* Cards principales */}
      <div className="relative z-10 flex items-center justify-center min-h-screen pt-25 px-4">
        <div className="bg-black/30 backdrop-blur-md rounded-[60px] border border-white/10 p-2 lg:p-6 w-full max-w-5xl mb-4">
          {/* Card Introducing Serene - Ocupa toda la fila */}
          <div className="bg-black/90 backdrop-blur-md rounded-[60px] lg:rounded-[40px] w-full flex flex-col h-[28rem] relative overflow-hidden">
            {/* Video de fondo */}
            <video
              ref={sereneVideoRef}
              className="absolute inset-0 w-full h-full object-cover"
              src="/videoloop2.mp4"
              autoPlay
              muted
              loop
              playsInline
            />
            
            {/* Overlay negro sutil */}
            <div className="absolute inset-0 bg-black/30"></div>
            
            {/* Texto centrado verticalmente y alineado a la izquierda */}
            <div className="relative z-10 flex flex-col justify-center h-full px-8 space-y-4">
              <h1 className="text-4xl font-light text-white">
                Introducing Serene
              </h1>
              <Link href="/coleccion" className="bg-white/20 backdrop-blur-sm border border-white/70 text-white px-6 py-3 rounded-full text-sm font-light hover:bg-white/30 transition-all duration-200 w-fit">
                View collection
              </Link>
            </div>
          </div>

          {/* Nueva fila: Card de texto que ocupa toda la fila */}
          <div className="mt-4">
            <div className="bg-black/90 backdrop-blur-md rounded-[60px] lg:rounded-[40px] w-full flex flex-col h-[16rem] p-8 relative items-center justify-center">
              <h1 className="text-3xl font-medium text-white text-center mb-2 max-w-xs">See all of our collections</h1>
              <Link href="/coleccion" className="mt-4 inline-flex items-center transition-all duration-200 hover:opacity-90" aria-label="Explore collections">
                <span className="rounded-full text-sm font-light px-8 py-2" style={{ backgroundColor: '#d2d5d3', color: '#2E2E2C' }}>Explore</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Card de DESCUENTO para nuevos miembros */}
      <div className="relative z-10 px-4 pb-12">
        <div className="bg-black/30 backdrop-blur-md rounded-[60px] border border-white/10 p-2 lg:p-6 w-full max-w-5xl mx-auto">
          <div className="relative overflow-hidden rounded-[60px] lg:rounded-[40px] h-[20rem] md:h-[28rem]">
            <Image src="/img1.jpg" alt="Get a Discount" fill className="object-cover" />
            <div className="absolute inset-0 bg-black/40"></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
              <h3 className="text-3xl lg:text-5xl font-medium text-white mb-2">Get a Discount</h3>
              <p className="text-sm lg:text-base text-white/80 mb-4">for all new members</p>
              <Link href="/coleccion" className="inline-flex items-center transition-all duration-200 hover:opacity-90" aria-label="Sign in">
                <span className="rounded-full text-sm font-light px-8 py-2" style={{ backgroundColor: '#d2d5d3', color: '#2E2E2C' }}>Sign In</span>
                <span className="rounded-full w-10 h-10 flex items-center justify-center" style={{ backgroundColor: '#d2d5d3', color: '#2E2E2C' }}>
                  <FiArrowUpRight className="h-5 w-5" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Card de SHADED MOVEMENT */}
      <div className="relative z-10 px-4 pb-12">
        <div className="bg-black/30 backdrop-blur-md rounded-[60px] border border-white/10 p-2 lg:p-6 w-full max-w-5xl mx-auto">
          <div className="bg-black/90 backdrop-blur-md rounded-[60px] lg:rounded-[40px] p-8 lg:p-12">
            <div className="text-center">
              <h2 className="text-2xl lg:text-4xl font-medium text-white mb-6" style={{ fontFamily: 'Agressive' }}>
                SHADED is more than just an Athleisure Brand—IT'S A MOVEMENT.
              </h2>
              <p className="text-sm lg:text-lg text-white/80 leading-relaxed max-w-4xl mx-auto">
                We totally get it—life is all about movement! Whether you're slaying a workout, managing a busy schedule, or simply enjoying some well-deserved chill time, our collection has got your back. Each piece is designed to help you feel confident and comfortable, no matter where the day takes you!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
