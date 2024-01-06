/** @type {import('next').NextConfig} */

// Supabase url from .env file
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL or env.NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

const hostPath = process.env.NEXT_PUBLIC_SUPABASE_URL.split(':');

const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['ui'],
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: hostPath[0],
        hostname: hostPath[1].replace('//', ''),
        port: hostPath[2],
        pathname: '/storage/v1/object/public/changelog-images/**',
      },
      {
        protocol: hostPath[0],
        hostname: hostPath[1].replace('//', ''),
        port: hostPath[2],
        pathname: '/storage/v1/object/public/projects/**',
      },
    ],
  },
};

module.exports = withPWA(nextConfig);
