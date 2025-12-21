import { AuthProvider } from 'components/auth/auth-context';
import { CartProvider } from 'components/cart/cart-context';
import { CartModalProvider } from 'components/cart/cart-modal-context';
import CartModal from 'components/cart/modal';
import ClientLayout from 'components/client-layout';
import FooterController from 'components/layout/footer-controller';
import HeaderWrapper from 'components/layout/header-wrapper';
import { LanguageProvider } from 'components/providers/language-provider';
import { getCart } from 'lib/shopify';
import { baseUrl } from 'lib/utils';
import { ViewTransitions } from 'next-view-transitions';
import { Inter, Teko } from 'next/font/google';
import { cookies } from 'next/headers';
import { ReactNode } from 'react';
import { Toaster } from 'sonner';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const teko = Teko({ subsets: ['latin'], variable: '--font-teko', weight: ['300', '400', '500', '600', '700'] });

const { SITE_NAME } = process.env;

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Shaded | Embrace comfort, experience quality',
    template: `%s | Shaded`
  },
  description: 'Embrace comfort, experience quality.',
  robots: {
    follow: true,
    index: true
  }
};

export default async function RootLayout({
  children
}: {
  children: ReactNode;
}) {
  // Don't await the fetch, pass the Promise to the context provider
  const cart = getCart();

  // Get language from cookie on server
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get('locale');
  const initialLanguage = (localeCookie?.value === 'en' || localeCookie?.value === 'es')
    ? localeCookie.value as 'en' | 'es'
    : 'en';

  return (
    <html lang={initialLanguage} className={`${inter.variable} ${teko.variable}`}>
      <body className={`${inter.className} bg-transparent text-black selection:bg-teal-300 dark:text-white dark:selection:bg-pink-500 dark:selection:text-white`}>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var cookies = document.cookie.split('; ');
                  var localeCookie = null;
                  for (var i = 0; i < cookies.length; i++) {
                    if (cookies[i].indexOf('locale=') === 0) {
                      localeCookie = cookies[i].split('=')[1];
                      break;
                    }
                  }
                  var lang = (localeCookie === 'en' || localeCookie === 'es') 
                    ? localeCookie 
                    : 'en';
                  if (document.documentElement) {
                    document.documentElement.lang = lang;
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
        <ViewTransitions>
          <ClientLayout>
            <LanguageProvider initialLanguage={initialLanguage}>
              <AuthProvider>
                <CartProvider cartPromise={cart}>
                  <CartModalProvider>
                    <HeaderWrapper />
                    <main>
                      {children}
                      <Toaster closeButton />
                    </main>
                    <FooterController />
                    <CartModal />
                  </CartModalProvider>
                </CartProvider>
              </AuthProvider>
            </LanguageProvider>
          </ClientLayout>
        </ViewTransitions>
      </body>
    </html>
  );
}
