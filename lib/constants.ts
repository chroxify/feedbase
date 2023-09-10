export const APP_DOMAIN =
  process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'
    ? `https://app.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`
    : 'http://app.localhost:3000';
