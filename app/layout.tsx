import type {Metadata} from 'next';
import './globals.css'; // Global styles
import QueryProvider from '@/src/providers/QueryProvider';

export const metadata: Metadata = {
  title: 'Portfolio Admin Dashboard Plan',
  description: 'Architecture plan and setup commands for a React + Vite admin dashboard.',
  openGraph: {
    title: 'Portfolio Admin Dashboard Plan',
    description: 'Architecture plan and setup commands for a React + Vite admin dashboard.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Portfolio Admin Dashboard Plan',
    description: 'Architecture plan and setup commands for a React + Vite admin dashboard.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
