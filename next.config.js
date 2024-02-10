/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: false,
  images: {
    domains: ['exemple.com', 'via.placeholder.com', 'ipfs-mainnet.trnnfr.com','ipfs-dev.trnnfr.com'], // Ajoutez ici les domaines de vos images
    deviceSizes: [82, 110, 140, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        cache: true,
      }),
    ],
  },
  target: () => undefined
}

module.exports = nextConfig
