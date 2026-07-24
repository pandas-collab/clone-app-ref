/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'blob.vercel-storage.com']
  },
  webpack: (config, { dev, isServer }) => {
    // Fix encoding module resolution issue
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        encoding: false,
        fs: false,
        net: false,
        tls: false
      };
    }

    // Ignore warnings for missing modules
    config.ignoreWarnings = [
      /Critical dependency: the request of a dependency is an expression/,
      /Module not found: Can't resolve 'encoding'/
    ];

    return config;
  }
};

module.exports = nextConfig;
