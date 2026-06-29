/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
        port: '',
      },
      { protocol: "https", hostname: "i.ibb.co" },

    ],
  },
  reactCompiler: true,
};

export default nextConfig;
