const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/:path*",
        destination: `/:path*`,
      },
      {
        source: "/portal",
        destination: `${process.env.PORTAL_URL}/blog`,
      },
      {
        source: "/portal/:path*",
        destination: `${process.env.PORTAL_URL}/:path*`,
      },
    ];
  },
};

export default nextConfig;
