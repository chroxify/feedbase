import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { cn } from '@/lib/utils';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Luminar',
  description: 'Collect feedback & communicating updates with ease.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body>
        <ThemeProvider attribute='class' defaultTheme='light' enableSystem={false}>
          <main
            className={cn('flex min-h-screen w-full flex-col items-center bg-background', inter.className)}>
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
