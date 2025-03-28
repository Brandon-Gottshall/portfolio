import { fileURLToPath } from 'node:url'
import createJiti from 'jiti'
import { withPayload } from '@payloadcms/next/withPayload'

const jiti = createJiti(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Payload recommends disabling reactCompiler for now if issues arise
    // reactCompiler: false,
    turbo: {
      rules: {
        '**/*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js'
        }
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
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack']
    })
    return config
  }
}

// Use the official Payload Next.js integration
export default withPayload(nextConfig) 