import './globals.css';
import { Metadata } from 'next';
import { headers } from 'next/headers';
import { cn } from '@ui/lib/utils';
import { Analytics } from '@vercel/analytics/react';
import { GeistSans } from 'geist/font';
import { ThemeProvider } from '@/components/theme-provider';

export const metadata: Metadata = {
  title: 'Luminar',
  description: 'Collect feedback & communicating updates with ease.',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1', // Prevents auto-zoom on mobile

  // PWA
  themeColor: '#05060A',
  manifest: '/manifest.json',
  icons: [
    {
      rel: 'apple-touch-icon',
      url: '/favicon.ico',
    },
  ],
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
          <main className={cn('bg-root flex min-h-screen w-full flex-col items-center', GeistSans.className)}>
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
