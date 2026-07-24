/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true
  },
  images: {
    domains: ['localhost']
  },
  webpack: (config, { dev, isServer }) => {
    if (!dev) {
      config.ignoreWarnings = [
        /Critical dependency: the request of a dependency is an expression/,
        /Module not found: Can't resolve 'encoding'/
      ];
    }

    // Optimize bundle splitting
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };
    }

    return config;
  },

  // Compress responses
  compress: true,

  // Power pack optimization
  poweredByHeader: false,

  // Generate a standalone output for deployment
  output: 'standalone',

  // Trailing slash configuration
  trailingSlash: false,

  // Skip trailing slash redirect
  skipTrailingSlashRedirect: false,

  // React strict mode
  reactStrictMode: true,

  // SWC minification
  swcMinify: true,

  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: false,
  },

  // ESLint configuration
  eslint: {
    ignoreDuringBuilds: false,
  },

  // Compiler options
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
  }
};

module.exports = nextConfig;
