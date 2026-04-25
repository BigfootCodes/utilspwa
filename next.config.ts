import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: false,
  },
  output: 'export',
  images: {
    unoptimized: true,
  },
  transpilePackages: ['motion'],
  turbopack: {}, // Suppress Turbopack error since we are not using custom webpack config anymore
};

export default nextConfig;
