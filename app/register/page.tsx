'use client';

import { useAuth } from 'components/auth/auth-context';
import { gsap } from 'gsap';
import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from "react";
import { FiArrowUpRight, FiEye, FiEyeOff } from "react-icons/fi";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, customer, isLoading } = useAuth();
  const router = useRouter();

  // Refs para animaciones GSAP
  const cardRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);

  // Animaciones GSAP
  useEffect(() => {
    let ctx = gsap.context(() => {
      if (cardRef.current) {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        
        // Misma animación para móvil y desktop: expandir altura
        // Primero obtener la altura natural mientras el card está visible
        const card = cardRef.current;
        const cardNaturalHeight = card.offsetHeight || card.scrollHeight;
        
        // Ahora establecer altura inicial a 0
        gsap.set(card, {
          height: 0,
          overflow: 'hidden',
          opacity: 0,
          transformOrigin: 'top center'
        });
        
        // Expandir altura del card
        tl.to(card, {
          height: cardNaturalHeight,
          opacity: 1,
          duration: 0.9,
          ease: 'power3.out',
          onComplete: () => {
            // Cuando termina, cambiar a altura auto
            if (card) {
              gsap.set(card, {
                height: 'auto',
                overflow: 'visible'
              });
            }
          }
        });
        
        // Animar header, formulario y links TODOS A LA VEZ (después del card)
        if (headerRef.current) {
          const headerElements = headerRef.current.querySelectorAll('h1, p, div, a, img');
          gsap.set(headerElements, { opacity: 0, y: 20 });
          tl.to(headerElements, {
            opacity: 1,
            y: 0,
            stagger: 0.08,
            duration: 0.6
          }, '-=0.5');
        }
        
        if (formRef.current) {
          // Animar inputs sin incluir el botón
          const formChildren = Array.from(formRef.current.children).filter(
            (child) => !(child instanceof HTMLButtonElement)
          );
          const submitButton = formRef.current.querySelector('button[type="submit"]');
          
          // Animar inputs con stagger
          gsap.set(formChildren, { opacity: 0, y: 15 });
          tl.to(formChildren, {
            opacity: 1,
            y: 0,
            stagger: 0.06,
            duration: 0.5
          }, '-=0.5');
          
          // Animar el botón por separado, simple
          if (submitButton) {
            gsap.set(submitButton, { opacity: 0 });
            tl.to(submitButton, {
              opacity: 1,
              duration: 0.5
            }, '-=0.2');
          }
        }
        
        if (linksRef.current) {
          const linkElements = linksRef.current.querySelectorAll('p, a');
          gsap.set(linkElements, { opacity: 0, y: 10 });
          tl.to(linkElements, {
            opacity: 1,
            y: 0,
            stagger: 0.05,
            duration: 0.4
          }, '-=0.4');
        }
      }
    });

    return () => ctx.revert();
  }, []);

  // Redirect if already logged in
  useEffect(() => {
    if (customer && !isLoading) {
      router.push('/');
    }
  }, [customer, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    
    // Registration disabled
    setErrors(['El registro está temporalmente deshabilitado']);
    return;
  };

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
      
      {/* Contenido principal */}
      <div className="relative z-10 flex items-center justify-center min-h-screen py-12">
        <div 
          ref={cardRef}
          className="bg-white/30 backdrop-blur-2xl rounded-[40px] border border-white/10 p-8 w-full max-w-md md:max-w-lg lg:max-w-xl mx-4 md:h-auto"
        >
          {/* Header */}
          <div ref={headerRef} className="text-center mb-8">
            <div className="flex items-center justify-between mb-6">
              <Image src="/logob.png" alt="Shaded Logo" width={120} height={30} priority />
              <Link href="/login" className="text-sm text-black/70 hover:text-black transition-colors duration-200">
                Login
              </Link>
            </div>
            <h1 className="text-3xl font-medium text-black mb-2">
              CREATE ACCOUNT
            </h1>
            <p className="text-sm text-black/70">Join the Shaded community</p>
          </div>

          {/* Error messages */}
          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="text-red-800 text-sm">
                {errors.map((error, index) => (
                  <div key={index}>{error}</div>
                ))}
              </div>
            </div>
          )}

          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full bg-transparent border-0 border-b-[0.5px] border-black/30 px-0 py-2 text-black placeholder-black/40 focus:outline-none focus:ring-0 focus:border-black/70 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="First name"
                  required
                  disabled
                />
              </div>
              <div>
                <input
                  type="text"
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full bg-transparent border-0 border-b-[0.5px] border-black/30 px-0 py-2 text-black placeholder-black/40 focus:outline-none focus:ring-0 focus:border-black/70 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Last name"
                  required
                  disabled
                />
              </div>
            </div>

            <div>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border-0 border-b-[0.5px] border-black/30 px-0 py-2 text-black placeholder-black/40 focus:outline-none focus:ring-0 focus:border-black/70 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Enter your email"
                required
                disabled
              />
            </div>

            <div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent border-0 border-b-[0.5px] border-black/30 px-0 py-2 pr-12 text-black placeholder-black/40 focus:outline-none focus:ring-0 focus:border-black/70 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Create password"
                  required
                  disabled
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 text-black/60 hover:text-black transition-colors duration-200 disabled:opacity-50"
                  disabled
                >
                  {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div>
              <input
                type={showPassword ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-transparent border-0 border-b-[0.5px] border-black/30 px-0 py-2 text-black placeholder-black/40 focus:outline-none focus:ring-0 focus:border-black/70 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Confirm password"
                required
                disabled
              />
            </div>

            <button
              type="submit"
              disabled
              className="w-full bg-black/50 text-white py-3 rounded-full font-medium transition-all duration-300 flex items-center justify-center opacity-50 cursor-not-allowed"
            >
              Registro Deshabilitado
            </button>
          </form>

          <div ref={linksRef} className="text-center mt-6">
            <p className="text-sm text-black/70">
              Already have an account?{' '}
              <Link href="/login" className="text-black hover:underline">
                Login
              </Link>
            </p>

            <div className="text-center mt-4">
              <Link href="/" className="inline-flex items-center text-sm text-black/70 hover:text-black transition-colors duration-200">
                <FiArrowUpRight className="h-4 w-4 mr-1 rotate-180" />
                Back to home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}