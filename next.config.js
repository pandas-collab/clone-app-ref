/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'example.com'],
  },
  experimental: {
    webpackBuildWorker: true
  }
}

module.exports = nextConfig
