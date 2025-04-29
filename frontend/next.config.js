/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'source.unsplash.com', 'images.unsplash.com', 'picsum.photos'],
    unoptimized: true, // Disable image optimization for external images
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://backend:4000/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig; 