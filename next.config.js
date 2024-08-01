/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'oaidalleapiprodscus.blob.core.windows.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'supabase.chatagency.ai',
        port: '',
        pathname: '/storage/v1/object/public/idea-images/**',
      },
    ],
  },
};

module.exports = nextConfig;
