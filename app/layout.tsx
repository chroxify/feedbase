import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';

export const metadata = {
  title: 'Luminar',
  description: 'Collect feedback & communicating updates with ease.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body>
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
          <main className='flex min-h-screen flex-col items-center bg-background'>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
