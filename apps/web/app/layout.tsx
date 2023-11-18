import './globals.css';
import { Metadata, Viewport } from 'next';
import { cn } from '@ui/lib/utils';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { GeistSans } from 'geist/font';
import { formatRootUrl } from '@/lib/utils';
import { ThemeProvider } from '@/components/theme-provider';

export const metadata: Metadata = {
  title: 'Luminar',
  description: 'Collect feedback & communicating updates with ease.',
  metadataBase: new URL(formatRootUrl()),
  openGraph: {
    images: [
      {
        url: '/og-image.png',
      },
    ],
  },
  // PWA
  manifest: '/manifest.json',
  icons: [
    {
      rel: 'apple-touch-icon',
      url: '/favicon.ico',
    },
  ],
};

export const viewport: Viewport = {
  // Prevents auto-zoom on mobile for input fields
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#05060A',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body>
        <Analytics />
        <SpeedInsights />
        <ThemeProvider attribute='class' defaultTheme='dark' enableSystem={false} forcedTheme='dark'>
          <main className={cn('bg-root flex min-h-screen w-full flex-col items-center', GeistSans.className)}>
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
