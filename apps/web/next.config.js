// Supabase url from .env file
const hostPath = process.env.NEXT_PUBLIC_SUPABASE_URL.split(':');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['ui'],
  images: {
    remotePatterns: [
      {
        protocol: hostPath[0],
        hostname: hostPath[1].replace('//', ''),
        port: hostPath[2],
        pathname: '/storage/v1/object/public/changelog-images/**',
      },
    ],
  },
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;
