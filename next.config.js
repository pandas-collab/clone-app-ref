/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // appDir is no longer needed in Next.js 14 - it's the default
  },
  images: {
    domains: ['localhost'],
  },
}

module.exports = nextConfig
