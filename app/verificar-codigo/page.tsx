'use client';

import Link from "next/link";
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from "react";
import { FiArrowLeft, FiMail } from "react-icons/fi";

export default function VerificarCodigo() {
  const [isVisible, setIsVisible] = useState(false);
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [password, setPassword] = useState('');
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    // Get parameters from URL
    const emailParam = searchParams.get('email');
    const customerIdParam = searchParams.get('customerId');
    const passwordParam = searchParams.get('password');
    
    if (emailParam) setEmail(emailParam);
    if (customerIdParam) setCustomerId(customerIdParam);
    if (passwordParam) setPassword(passwordParam);
    
    // Focus first input
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
    
    return () => clearTimeout(timer);
  }, [searchParams]);

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) return; // Solo permitir un dígito
    if (value && !/^\d$/.test(value)) return; // Solo números

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const digits = pastedData.replace(/\D/g, '').slice(0, 6);
    
    if (digits.length === 6) {
      const newCode = digits.split('');
      setCode(newCode);
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);

    const activationToken = code.join('');
    
    if (activationToken.length !== 6) {
      setErrors(['Por favor ingresa el código completo de 6 dígitos']);
      return;
    }

    if (!customerId || !password) {
      setErrors(['Información de sesión faltante. Por favor intenta el login nuevamente.']);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/auth/activate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          customerId, 
          activationToken, 
          password 
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Redirect to home page on successful activation
        router.push('/?activated=true');
      } else {
        setErrors(data.errors || [data.error || 'Código de verificación incorrecto']);
        // Clear code if error
        setCode(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      console.error('Activation error:', error);
      setErrors(['Ocurrió un error inesperado']);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) return;
    
    try {
      // Trigger password recovery to resend code
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        alert('Código reenviado a tu email');
      }
    } catch (error) {
      console.error('Resend error:', error);
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
              <Link 
                href="/login"
                className="p-2 hover:bg-black/5 rounded-full transition-colors duration-200"
              >
                <FiArrowLeft className="h-6 w-6" style={{ color: '#2E2E2C' }} />
              </Link>
              <div className="flex-1"></div>
            </div>
            
            <div className="flex justify-center mb-4">
              <div className="bg-white/20 backdrop-blur-xl rounded-full p-4">
                <FiMail className="h-8 w-8" style={{ color: '#2E2E2C' }} />
              </div>
            </div>
            
            <h1 className="text-3xl font-medium text-black mb-2">
              Ingresa el código
            </h1>
            <p className="text-sm text-black/70 mb-2">
              Enviado a {email || 'tu email'}
            </p>
            <p className="text-xs text-black/60">
              Código de 6 dígitos
            </p>
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

          <form onSubmit={handleSubmit}>
            {/* Code inputs */}
            <div className="flex justify-center space-x-3 mb-8">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-12 h-14 text-center text-xl font-bold bg-white/50 backdrop-blur-xl border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black/40 transition-all duration-200"
                  style={{ color: '#2E2E2C' }}
                  disabled={isSubmitting}
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || code.join('').length !== 6}
              className="w-full bg-black text-white py-3 rounded-full font-medium hover:bg-gray-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Verificando...' : 'Verificar código'}
            </button>
          </form>

          {/* Resend code */}
          <div className="text-center mt-6">
            <p className="text-sm text-black/70 mb-2">
              ¿No recibiste el código?
            </p>
            <button
              onClick={handleResendCode}
              className="text-sm text-black hover:underline font-medium transition-all duration-200"
              disabled={isSubmitting}
            >
              Reenviar código
            </button>
          </div>

          {/* Sign in with different email */}
          <div className="text-center mt-4">
            <Link href="/login" className="text-sm text-black/70 hover:text-black transition-colors duration-200">
              Iniciar sesión con otro email
            </Link>
          </div>

          {/* Footer links */}
          <div className="text-center mt-6 space-x-4">
            <Link href="/privacy-policy" className="text-xs text-black/60 hover:text-black/80 transition-colors duration-200">
              Política de privacidad
            </Link>
            <Link href="/terms" className="text-xs text-black/60 hover:text-black/80 transition-colors duration-200">
              Términos de servicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
