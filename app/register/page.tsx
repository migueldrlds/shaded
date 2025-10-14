'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FiArrowUpRight, FiEye, FiEyeOff } from "react-icons/fi";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica de registro
    console.log('Registration attempt:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="relative min-h-screen" style={{ backgroundColor: '#d2d5d3' }}>
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
      
      {/* Contenido principal */}
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        {/* Layout móvil: card único */}
        <div className="bg-white/30 backdrop-blur-2xl rounded-t-[60px] md:hidden border border-white/10 border-b-0 p-8 w-full">
          {/* Formulario de registro móvil */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-medium text-black mb-2" style={{ fontFamily: 'Agressive' }}>
              Create Account
            </h1>
            <p className="text-sm text-black/70">Join the Shaded community</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full bg-transparent border-0 border-b-[0.5px] border-black/30 px-0 py-2 text-black placeholder-black/40 focus:outline-none focus:ring-0 focus:border-black/70 transition-all duration-200"
                  placeholder="First name"
                  required
                />
              </div>
              <div>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full bg-transparent border-0 border-b-[0.5px] border-black/30 px-0 py-2 text-black placeholder-black/40 focus:outline-none focus:ring-0 focus:border-black/70 transition-all duration-200"
                  placeholder="Last name"
                  required
                />
              </div>
            </div>

            <div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-transparent border-0 border-b-[0.5px] border-black/30 px-0 py-2 text-black placeholder-black/40 focus:outline-none focus:ring-0 focus:border-black/70 transition-all duration-200"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-transparent border-0 border-b-[0.5px] border-black/30 px-0 py-2 pr-12 text-black placeholder-black/40 focus:outline-none focus:ring-0 focus:border-black/70 transition-all duration-200"
                  placeholder="Create password"
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

            <div>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full bg-transparent border-0 border-b-[0.5px] border-black/30 px-0 py-2 pr-12 text-black placeholder-black/40 focus:outline-none focus:ring-0 focus:border-black/70 transition-all duration-200"
                  placeholder="Confirm password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 text-black/60 hover:text-black transition-colors duration-200"
                >
                  {showConfirmPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-start">
              <button
                type="button"
                aria-pressed={formData.agreeToTerms}
                aria-label="Agree to terms"
                onClick={() => setFormData(prev => ({ ...prev, agreeToTerms: !prev.agreeToTerms }))}
                className={`w-12 h-6 rounded-full relative transition-colors duration-200 focus:outline-none mt-1 ${formData.agreeToTerms ? 'bg-black' : 'bg-black/20'}`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform duration-200 ${formData.agreeToTerms ? 'translate-x-6' : ''}`}
                />
              </button>
              <span className="ml-3 text-sm text-black/70">
                I agree to the{' '}
                <Link href="/terms" className="text-black hover:underline">
                  Terms and Conditions
                </Link>
                {' '}and{' '}
                <Link href="/privacy" className="text-black hover:underline">
                  Privacy Policy
                </Link>
              </span>
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-full font-medium hover:bg-gray-800 transition-all duration-300 flex items-center justify-center"
            >
              Create Account
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-sm text-black/70">
              Already have an account?{' '}
              <Link href="/login" className="text-black hover:underline">
                Sign In
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

        {/* Layout desktop: 2 columnas */}
        <div className="hidden md:grid md:grid-cols-2 md:gap-6 md:w-full md:max-w-4xl md:mx-20 md:my-8">
          {/* Columna izquierda: Formulario */}
          <div className="bg-white/30 backdrop-blur-2xl rounded-[40px] border border-white/10 p-8">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <Image src="/logob.png" alt="Shaded Logo" width={120} height={30} priority />
                <Link href="/login" className="text-sm text-black/70 hover:text-black transition-colors duration-200">
                  Sign In
                </Link>
              </div>
              <h1 className="text-3xl font-medium text-black mb-2" style={{ fontFamily: 'Agressive' }}>
                CREATE ACCOUNT
              </h1>
              <p className="text-sm text-black/70">Join the Shaded movement</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full bg-transparent border-0 border-b-[0.5px] border-black/30 px-0 py-2 text-black placeholder-black/40 focus:outline-none focus:ring-0 focus:border-black/70 transition-all duration-200"
                    placeholder="First name"
                    required
                  />
                </div>
                <div>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full bg-transparent border-0 border-b-[0.5px] border-black/30 px-0 py-2 text-black placeholder-black/40 focus:outline-none focus:ring-0 focus:border-black/70 transition-all duration-200"
                    placeholder="Last name"
                    required
                  />
                </div>
              </div>

              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-transparent border-0 border-b-[0.5px] border-black/30 px-0 py-2 text-black placeholder-black/40 focus:outline-none focus:ring-0 focus:border-black/70 transition-all duration-200"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full bg-transparent border-0 border-b-[0.5px] border-black/30 px-0 py-2 pr-12 text-black placeholder-black/40 focus:outline-none focus:ring-0 focus:border-black/70 transition-all duration-200"
                    placeholder="Create password"
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

              <div>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full bg-transparent border-0 border-b-[0.5px] border-black/30 px-0 py-2 pr-12 text-black placeholder-black/40 focus:outline-none focus:ring-0 focus:border-black/70 transition-all duration-200"
                    placeholder="Confirm password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 text-black/60 hover:text-black transition-colors duration-200"
                  >
                    {showConfirmPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-start">
                <button
                  type="button"
                  aria-pressed={formData.agreeToTerms}
                  aria-label="Agree to terms"
                  onClick={() => setFormData(prev => ({ ...prev, agreeToTerms: !prev.agreeToTerms }))}
                  className={`w-12 h-6 rounded-full relative transition-colors duration-200 focus:outline-none mt-1 ${formData.agreeToTerms ? 'bg-black' : 'bg-black/20'}`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform duration-200 ${formData.agreeToTerms ? 'translate-x-6' : ''}`}
                  />
                </button>
                <span className="ml-3 text-sm text-black/70">
                  I agree to the{' '}
                  <Link href="/terms" className="text-black hover:underline">
                    Terms and Conditions
                  </Link>
                </span>
              </div>

              <button
                type="submit"
                className="w-full bg-black text-white py-3 rounded-full font-medium hover:bg-gray-800 transition-all duration-300 flex items-center justify-center"
              >
                Create Account
              </button>
            </form>
          </div>

          {/* Columna derecha: Card promocional */}
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
                  Welcome to Shaded
                </h2>
                <p className="text-1xl text-white/70 mb-6">
                  Join our community and get exclusive access to new releases, special offers, and insider updates.
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

