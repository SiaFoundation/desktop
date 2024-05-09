const { version } = require('../package.json')

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  env: {
    version,
  },
}

module.exports = nextConfig
