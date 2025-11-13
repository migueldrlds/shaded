'use client';

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

type Language = 'en' | 'es';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translations
const translations: Record<Language, Record<string, string>> = {
  en: {
    'header.shopNow': 'Shop Now',
    'header.collection': 'Collection',
    'header.cart': 'Cart',
    'footer.language': 'Language',
    'footer.customerService': 'Customer Service',
    'footer.returnPolicy': 'Return and Exchange Policy',
    'footer.shippingPolicy': 'Shipping Policy',
    'footer.terms': 'Terms and Conditions',
    'footer.customerSupport': 'Customer Support',
    'footer.contactForm': 'Contact Form',
    'footer.collections': 'Collections',
    'footer.allCollections': 'All Collections',
    'footer.connectWithUs': 'Connect with us',
    'footer.copyright': '© 2024 Shaded. All rights reserved.',
    'footer.privacyPolicy': 'Privacy Policy',
    'footer.cookiePolicy': 'Cookie Policy',
    'footer.description': 'Join the movement with Shaded! Follow us on Social media for exclusive updates, style inspiration, and special offers. Be part of our community and stay connected with the latest in athleisure!',
    'common.english': 'English',
    'common.spanish': 'Español'
  },
  es: {
    'header.shopNow': 'Comprar Ahora',
    'header.collection': 'Colección',
    'header.cart': 'Carrito',
    'footer.language': 'Idioma',
    'footer.customerService': 'Servicio al Cliente',
    'footer.returnPolicy': 'Política de Devoluciones y Cambios',
    'footer.shippingPolicy': 'Política de Envío',
    'footer.terms': 'Términos y Condiciones',
    'footer.customerSupport': 'Soporte al Cliente',
    'footer.contactForm': 'Formulario de Contacto',
    'footer.collections': 'Colecciones',
    'footer.allCollections': 'Todas las Colecciones',
    'footer.connectWithUs': 'Conéctate con nosotros',
    'footer.copyright': '© 2024 Shaded. Todos los derechos reservados.',
    'footer.privacyPolicy': 'Política de Privacidad',
    'footer.cookiePolicy': 'Política de Cookies',
    'footer.description': '¡Únete al movimiento con Shaded! Síguenos en las redes sociales para actualizaciones exclusivas, inspiración de estilo y ofertas especiales. Sé parte de nuestra comunidad y mantente conectado con lo último en athleisure!',
    'common.english': 'English',
    'common.spanish': 'Español'
  }
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    // Get language from cookie or localStorage on mount
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('language') as Language;
      if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'es')) {
        setLanguageState(savedLanguage);
      }
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang);
      // Also set cookie for server-side access
      document.cookie = `locale=${lang}; path=/; max-age=31536000`; // 1 year
    }
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

