import { AuthProvider } from 'components/auth/auth-context';
import { CartProvider } from 'components/cart/cart-context';
import { CartModalProvider } from 'components/cart/cart-modal-context';
import CartModal from 'components/cart/modal';
import FooterController from 'components/layout/footer-controller';
import HeaderWrapper from 'components/layout/header-wrapper';
import { LanguageProvider } from 'components/providers/language-provider';
import { GeistSans } from 'geist/font/sans';
import { getCart } from 'lib/shopify';
import { baseUrl } from 'lib/utils';
import { ReactNode } from 'react';
import { Toaster } from 'sonner';
import './globals.css';

const { SITE_NAME } = process.env;

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: SITE_NAME!,
    template: `%s | ${SITE_NAME}`
  },
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

  return (
    <html lang="en" className={GeistSans.variable}>
      <body className="bg-transparent text-black selection:bg-teal-300 dark:text-white dark:selection:bg-pink-500 dark:selection:text-white">
        <LanguageProvider>
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
      </body>
    </html>
  );
}
