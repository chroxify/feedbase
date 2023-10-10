import './globals.css';
import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { headers } from 'next/headers';
import { Analytics } from '@vercel/analytics/react';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/components/theme-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Luminar',
  description: 'Collect feedback & communicating updates with ease.',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1', // Prevents auto-zoom on mobile
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const headerList = headers();
  const host = headerList.get('host');
  const pathname = headerList.get('x-pathname');

  return (
    <html lang='en' suppressHydrationWarning>
      <body>
        <Analytics />
        <ThemeProvider
          attribute='class'
          defaultTheme='dark'
          enableSystem={false}
          forcedTheme={host === process.env.NEXT_PUBLIC_ROOT_DOMAIN && pathname === '/' ? 'dark' : undefined}>
          <main className={cn('bg-root flex min-h-screen w-full flex-col items-center', inter.className)}>
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
