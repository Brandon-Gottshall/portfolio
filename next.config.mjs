import { fileURLToPath } from 'node:url'
import createJiti from 'jiti'
import { withPayload } from '@payloadcms/next/withPayload'

const jiti = createJiti(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Allow publishing without blocking on ESLint during build
    ignoreDuringBuilds: true
  },
  // Payload recommends disabling reactCompiler for now if issues arise
  // experimental: { reactCompiler: false },
  turbopack: {
    rules: {
      '**/*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js'
      }
    }
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'hebbkx1anhila5yf.public.blob.vercel-storage.com',
        port: '',
        pathname: '/**' // Allow any path under this hostname
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/media/**'
      },
      { // Added configuration for simpleicons.org images
        protocol: 'https',
        hostname: 'simpleicons.org',
        port: '',
        pathname: '/icons/**'
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com'
      },
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io'
      }
    ]
  },
  async redirects () {
    return [
      { source: '/resume', destination: '/about', permanent: false },
      { source: '/blog', destination: '/notes', permanent: false }
    ]
  },
  webpack: (config, options) => {
    // Exclude TypeScript declaration files from module resolution to avoid parsing errors
    if (config.resolve && Array.isArray(config.resolve.extensions)) {
      config.resolve.extensions = config.resolve.extensions.filter(ext => ext !== '.d.ts')
    }
    // Handle SVG imports
    config.module.rules.push({
      test: /\\.svg$/,
      use: ['@svgr/webpack']
    })
    // Treat TypeScript declaration files as raw source to bypass parsing errors from third-party packages
    config.module.rules.push({
      test: /\\.d\\.ts$/,
      type: 'asset/source'
    })
    // Skip parsing any TypeScript declaration files entirely
    if (!config.module.noParse) config.module.noParse = []
    if (Array.isArray(config.module.noParse)) {
      config.module.noParse.push(/\.d\.ts$/)
      config.module.noParse.push(/esbuild\/lib\/main\.d\.ts$/)
    }
    return config
  }
}

// Use the official Payload Next.js integration
export default withPayload(nextConfig)
