import './globals.css';
import type { Metadata } from 'next';

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
      <body>{children}</body>
    </html>
  );
}
