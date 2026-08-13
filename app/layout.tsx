import './globals.css';
import type { Metadata } from 'next';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { CartProvider } from '@/lib/cart';

export const metadata: Metadata = {
  title: 'KraveEat | Fast Food in Abuja — Burgers, Shawarma, Loaded Fries',
  description: 'Order delicious fast food in Abuja. KraveEat serves burgers, shawarma, loaded fries, chicken & chips and more. Fast delivery to South End Estate and surrounding areas.',
  icons: {
    icon: '/assets/imagewithlogo1.png',
    apple: '/assets/imagewithlogo1.png'
  },
  openGraph: {
    title: 'KraveEat | Fast Food in Abuja',
    description: 'Order burgers, shawarma, loaded fries and more from KraveEat Abuja.',
    url: 'https://kraveat.com',
    siteName: 'KraveEat',
    images: [
      {
        url: '/assets/imagewithlogo1.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_NG',
    type: 'website',
  },
  metadataBase: new URL('https://kraveat.com'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col">
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
