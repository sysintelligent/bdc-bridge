/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  images: {
    domains: [], // Add any image domains you need here
  },
  // Optimize for production
  poweredByHeader: false,
  compress: true,
  generateEtags: true,
}

module.exports = nextConfig 