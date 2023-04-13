/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  swcMinify: true,
  env: {
    API_ROOT: 'http://localhost:8000',
  },
};

module.exports = nextConfig;
