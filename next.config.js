/** @type {import('next').NextConfig} */
const nextTranslate = require('next-translate')
const nextConfig = nextTranslate({
  reactStrictMode: true,
  swcMinify: true,
  async rewrites() {
    return [
      {
        source: '/pin/:path*',
        destination: 'https://api.pinata.cloud:80/pinning/:path*'
      }
    ]
  }
})

module.exports = nextConfig
