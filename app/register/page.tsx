'use client';

import { useAuth } from 'components/auth/auth-context';
import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import { FiArrowUpRight, FiEye, FiEyeOff } from "react-icons/fi";

export default function Register() {
  const [isVisible, setIsVisible] = useState(false);
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

    // Validations
    if (password !== confirmPassword) {
      setErrors(['Passwords do not match']);
      return;
    }

    if (password.length < 8) {
      setErrors(['Password must be at least 8 characters long']);
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await register(firstName, lastName, email, password);
      
      if (result.success) {
        if (result.needsActivation && result.customerId) {
          // Redirect to verification page if activation is needed
          const params = new URLSearchParams({
            email,
            customerId: result.customerId,
            password
          });
          router.push(`/verificar-codigo?${params.toString()}`);
        } else {
          // Redirect to login page with success message
          router.push('/login?registered=true');
        }
      } else {
        setErrors(result.errors || ['Registration failed']);
      }
    } catch (error) {
      console.error('Registration error:', error);
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
      <div className="relative z-10 flex items-center justify-center min-h-screen py-12">
        <div 
          className={`bg-white/30 backdrop-blur-2xl rounded-[40px] border border-white/10 p-8 w-full max-w-md mx-4 transition-opacity duration-1000 ease-in-out ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-between mb-6">
              <Image src="/logob.png" alt="Shaded Logo" width={120} height={30} priority />
              <Link href="/login" className="text-sm text-black/70 hover:text-black transition-colors duration-200">
                Login
              </Link>
            </div>
            <h1 className="text-3xl font-medium text-black mb-2" style={{ fontFamily: 'Agressive' }}>
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

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full bg-transparent border-0 border-b-[0.5px] border-black/30 px-0 py-2 text-black placeholder-black/40 focus:outline-none focus:ring-0 focus:border-black/70 transition-all duration-200"
                  placeholder="First name"
                  required
                />
              </div>
              <div>
                <input
                  type="text"
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full bg-transparent border-0 border-b-[0.5px] border-black/30 px-0 py-2 text-black placeholder-black/40 focus:outline-none focus:ring-0 focus:border-black/70 transition-all duration-200"
                  placeholder="Last name"
                  required
                />
              </div>
            </div>

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
              <input
                type={showPassword ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-transparent border-0 border-b-[0.5px] border-black/30 px-0 py-2 text-black placeholder-black/40 focus:outline-none focus:ring-0 focus:border-black/70 transition-all duration-200"
                placeholder="Confirm password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-black text-white py-3 rounded-full font-medium hover:bg-gray-800 transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-sm text-black/70">
              Already have an account?{' '}
              <Link href="/login" className="text-black hover:underline">
                Login
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
      </div>
    </div>
  );
}