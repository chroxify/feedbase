import { Inter, JetBrains_Mono } from '@next/font/google'; // eslint-disable-line
import localFont from '@next/font/local';

export const fontSans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const fontMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-monospace',
});

export const satoshi = localFont({
  src: './Satoshi-Variable.woff2',
  variable: '--font-satoshi',
  weight: '300 700',
});
