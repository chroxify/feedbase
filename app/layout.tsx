import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { cn } from '@/lib/utils';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { headers } from 'next/headers';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Luminar',
  description: 'Collect feedback & communicating updates with ease.',
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
          defaultTheme='light'
          enableSystem={false}
          forcedTheme={host === process.env.NEXT_PUBLIC_ROOT_DOMAIN && pathname === '/' ? 'dark' : undefined}>
          <main
            className={cn('flex min-h-screen w-full flex-col items-center bg-background', inter.className)}>
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
