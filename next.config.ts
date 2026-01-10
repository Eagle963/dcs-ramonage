import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Optimisations pour la production
  reactStrictMode: true,

  // Transpilation des packages ESM pour @react-pdf/renderer
  transpilePackages: ['@react-pdf/renderer'],

  // Configuration Webpack pour @react-pdf/renderer
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
  
  // Optimisation des images
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Pour les avis Google
      },
      {
        protocol: 'https',
        hostname: '*.cloudflare.com',
      },
    ],
  },
  
  // Headers de sécurité
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  // Redirections SEO
  async redirects() {
    return [
      // Redirection www vers non-www (à adapter selon le choix)
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.dcs-ramonage.fr' }],
        destination: 'https://dcs-ramonage.fr/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
