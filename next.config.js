/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: false,
  images: {
    domains: ['exemple.com', 'via.placeholder.com', 'ipfs-mainnet.trnnfr.com'], // Ajoutez ici les domaines de vos images
  },
}

module.exports = nextConfig
