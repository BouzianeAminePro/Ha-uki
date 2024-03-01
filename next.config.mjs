/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
        // !! WARN !!
        // Dangerously allow production builds to successfully complete even if
        // your project has type errors.
        // !! WARN !!
        ignoreBuildErrors: true,
    },
    images: {
        domains: ['lh3.googleusercontent.com']
    },
    webpack5: true,
    webpack: (config) => {
      config.resolve.fallback = { fs: false, net: false, dns: false, tls: false, child_process: false };
  
      return config;
    },
};

export default nextConfig;
