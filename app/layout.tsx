import './globals.css';
import type { Metadata } from 'next';
import Header from '@/components/header';
import Footer from '@/components/footer';

export const metadata: Metadata = {
  title: 'KraveEat | Fast Food in Abuja',
  description: 'Responsive food ordering experience for KraveEat Abuja.',
  icons: {
    icon: '/imagewithlogo1.png',
    apple: '/imagewithlogo1.png'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
