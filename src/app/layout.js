import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import QueryProvider from '@/providers/QueryProvider'; // Import the QueryProvider
import 'react-loading-skeleton/dist/skeleton.css';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { ToastProvider } from '@/lib/toast-context';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
});

export const metadata = {
  title: "X. It's what's happening / X",
  description: "X. It's what's happening / X"
};

export default async function RootLayout({ children, modal }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} bg-[var(--background)] antialiased`}>
        <QueryProvider>
          <ToastProvider>
            {children}
            {modal}
          </ToastProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
