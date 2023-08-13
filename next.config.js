/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'innmcibhgnhxpghxldrr.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/changelog-images/**',
      },
    ],
  },
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;
