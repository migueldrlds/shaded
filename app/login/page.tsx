'use client';

import { useAuth } from 'components/auth/auth-context';
import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import { FiArrowUpRight, FiEye, FiEyeOff } from "react-icons/fi";

export default function Login() {
  const [isVisible, setIsVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, customer, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
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
    setIsSubmitting(true);

    try {
      const result = await login(email, password);
      
      if (result.success) {
        // Redirect to home page on successful login
        router.push('/');
      } else if (result.needsActivation && result.customerId) {
        // Redirect to verification page
        const params = new URLSearchParams({
          email,
          customerId: result.customerId,
          password
        });
        router.push(`/verificar-codigo?${params.toString()}`);
      } else {
        setErrors(result.errors || ['Login failed']);
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors(['An unexpected error occurred']);
    } finally {
      setIsSubmitting(false);
    }
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
      <div className="relative z-10 flex items-end justify-center min-h-screen">
        {/* Layout móvil: card único */}
        <div 
          className={`bg-white/30 backdrop-blur-2xl rounded-t-[60px] md:hidden border border-white/10 border-b-0 p-8 w-full transition-opacity duration-1000 ease-in-out ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Formulario de login móvil */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-medium text-black mb-2" style={{ fontFamily: 'Agressive' }}>
              Welcome Back
            </h1>
            <p className="text-sm text-black/70">Login to your account</p>
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

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border-0 border-b-[0.5px] border-black/30 px-0 py-2 text-black placeholder-black/40 focus:outline-none focus:ring-0 focus:border-black/70 transition-all duration-200"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent border-0 border-b-[0.5px] border-black/30 px-0 py-2 pr-12 text-black placeholder-black/40 focus:outline-none focus:ring-0 focus:border-black/70 transition-all duration-200"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 text-black/60 hover:text-black transition-colors duration-200"
                >
                  {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <button
                  type="button"
                  aria-pressed={rememberMe}
                  aria-label="Remember me"
                  onClick={() => setRememberMe(!rememberMe)}
                  className={`w-12 h-6 rounded-full relative transition-colors duration-200 focus:outline-none ${rememberMe ? 'bg-black' : 'bg-black/20'}`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform duration-200 ${rememberMe ? 'translate-x-6' : ''}`}
                  />
                </button>
                <span className="ml-3 text-sm text-black/70">Remember me</span>
              </div>
              <Link href="/forgot-password" className="text-sm text-black/70 hover:text-black transition-colors duration-200">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-black text-white py-3 rounded-full font-medium hover:bg-gray-800 transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-sm text-black/70">
              Don't have an account?{' '}
              <Link href="/register" className="text-black hover:underline">
                Register
              </Link>
            </p>
          </div>

          <div className="text-center mt-4">
            <Link href="/" className="inline-flex items-center text-sm text-black/70 hover:text-black transition-colors duration-200">
              <FiArrowUpRight className="h-4 w-4 mr-1 rotate-180" />
              Back to home
            </Link>
          </div>
        </div>

        {/* Layout desktop: 2 columnas x 2 filas */}
        <div 
          className={`hidden md:grid md:grid-cols-2 md:gap-6 md:w-full md:max-w-4xl md:mx-20 md:my-8 transition-opacity duration-1000 ease-in-out ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Columna izquierda */}
          <div className="space-y-6">
            {/* Fila 1: Formulario de login */}
            <div className="bg-white/30 backdrop-blur-2xl rounded-[40px] border border-white/10 p-8">
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <Image src="/logob.png" alt="Shaded Logo" width={120} height={30} priority />
                  <Link href="/register" className="text-sm text-black/70 hover:text-black transition-colors duration-200">
                    Register
                  </Link>
                </div>
                <h1 className="text-3xl font-medium text-black mb-2" style={{ fontFamily: 'Agressive' }}>
                  LOG IN
                </h1>
                <p className="text-sm text-black/70">Access your account</p>
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

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <input
                    type="email"
                    id="email-desktop"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent border-0 border-b-[0.5px] border-black/30 px-0 py-2 text-black placeholder-black/40 focus:outline-none focus:ring-0 focus:border-black/70 transition-all duration-200"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password-desktop"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-transparent border-0 border-b-[0.5px] border-black/30 px-0 py-2 pr-12 text-black placeholder-black/40 focus:outline-none focus:ring-0 focus:border-black/70 transition-all duration-200"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-0 top-1/2 transform -translate-y-1/2 text-black/60 hover:text-black transition-colors duration-200"
                    >
                      {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <button
                      type="button"
                      aria-pressed={rememberMe}
                      aria-label="Remember me"
                      onClick={() => setRememberMe(!rememberMe)}
                      className={`w-12 h-6 rounded-full relative transition-colors duration-200 focus:outline-none ${rememberMe ? 'bg-black' : 'bg-black/20'}`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform duration-200 ${rememberMe ? 'translate-x-6' : ''}`}
                      />
                    </button>
                    <span className="ml-3 text-sm text-black/70">Remember me</span>
                  </div>
                  <Link href="/forgot-password" className="text-sm text-black/70 hover:text-black transition-colors duration-200">
                    Forgot password?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-black text-white py-3 rounded-full font-medium hover:bg-gray-800 transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Logging in...' : 'Enter'}
                </button>
              </form>

            </div>

            {/* Fila 2: Card New Collection */}
            <div className="bg-black/80 backdrop-blur-2xl rounded-[40px] border border-black/40 p-8">
              <div>
                <h2 className="text-2xl font-medium text-white mb-4" style={{ fontFamily: 'Agressive' }}>
                  New Collection
                </h2>
                <p className="text-sm text-white/70 mb-6">
                  Discover our latest streetwear essentials
                </p>
                <div className="flex justify-end">
                  <Link href="/coleccion" className="text-white text-lg font-medium hover:text-white/70 transition-colors duration-200">
                    Explore Now
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Columna derecha: Card que ocupa ambas filas */}
          <div className="relative bg-white/30 backdrop-blur-2xl rounded-[40px] border border-white/10 pl-4 pr-8 py-4 flex flex-col justify-start overflow-hidden">
            {/* Imagen de fondo */}
            <div className="absolute inset-0 z-0">
              <Image
                src="/img1.jpg"
                alt="Background"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/40"></div>
            </div>
            <div className="relative z-10 h-full">
              <div className="bg-white/20 backdrop-blur-xl rounded-l-[30px] rounded-r-2xl border border-white/20 px-6 py-4 h-full max-w-[200px] w-full text-left flex flex-col">
                <h2 className="text-1xl font-medium text-white mb-4" style={{ fontFamily: 'Agressive' }}>
                  Join the Movement
                </h2>
                <p className="text-1xl text-white/70 mb-6">
                  Be part of our community and get exclusive access to new releases, special offers, and insider updates.
                </p>
                <div className="space-y-2">
                  <div className="text-sm text-white/80">Early access to new drops</div>
                  <div className="text-sm text-white/80">Exclusive member discounts</div>
                  <div className="text-sm text-white/80">Free shipping on all orders</div>
                </div>
                
                {/* Logo en la parte inferior */}
                <div className="mt-auto pb-4 flex justify-center">
                  <Image
                    src="/logo.png"
                    alt="Shaded Logo"
                    width={120}
                    height={30}
                    className="opacity-80"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

