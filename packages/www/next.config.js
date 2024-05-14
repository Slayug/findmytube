
const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
        port: '',
      },
    ],
  },
    experimental: {
      outputFileTracingRoot: path.join(__dirname, './'),
  },

}

module.exports = nextConfig
