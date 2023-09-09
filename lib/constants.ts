export const APP_DOMAIN =
  process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'
    ? 'https://app.luminar.so'
    : 'http://app.localhost:3000';
