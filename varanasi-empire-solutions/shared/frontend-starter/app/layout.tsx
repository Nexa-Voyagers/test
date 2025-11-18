import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import { ToastProvider } from '@/components/toast-provider';
import { ErrorBoundary } from '@/components/error-boundary';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Varanasi Empire Solutions',
  description: 'Enterprise Solutions for Modern Businesses',
  keywords: ['enterprise', 'solutions', 'business', 'varanasi'],
  authors: [{ name: 'Varanasi Empire' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://varanasi-empire.com',
    title: 'Varanasi Empire Solutions',
    description: 'Enterprise Solutions for Modern Businesses',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ErrorBoundary>
          <ToastProvider />
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
