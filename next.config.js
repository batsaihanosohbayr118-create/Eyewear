/** @type {import('next').NextConfig} */
const nextConfig = {
  // The contact page was folded into the footer; keep old links working.
  async redirects() {
    return [{ source: "/contact", destination: "/#contact", permanent: true }];
  },
  images: {
    remotePatterns: [
      {protocol: 'https', hostname: '**'},
    ],
  },
};

module.exports = nextConfig;
