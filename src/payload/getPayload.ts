import payload from 'payload'
import type { Payload } from 'payload'
import configPromise from '@payload-config'

interface PayloadCache {
  client: Payload | null
  promise: Promise<Payload> | null
}

// Define type for global with payload property
type GlobalWithPayload = typeof global & {
  payload: PayloadCache
}

// Initialize cache or use existing
if (!(global as GlobalWithPayload).payload) {
  ;(global as GlobalWithPayload).payload = {
    client: null,
    promise: null
  }
}

// We can now safely use non-null assertion
// since we've ensured it's initialized above
const cached = (global as GlobalWithPayload).payload

interface Args {
  initOptions?: Record<string, unknown>
}

export default async function getPayloadClient({
  initOptions
}: Args = {}): Promise<Payload> {
  if (!process.env.PAYLOAD_SECRET) {
    throw new Error('PAYLOAD_SECRET environment variable is missing')
  }

  if (cached.client) {
    return cached.client
  }

  if (!cached.promise) {
    cached.promise = payload.init({
      // Use the compiled config
      config: await configPromise,
      // Ensure we're in local mode
      local: true,
      // Spread any additional options
      ...initOptions,
      // Override with required options
      secret: process.env.PAYLOAD_SECRET
    })
  }

  try {
    cached.client = await cached.promise
  } catch (e) {
    cached.promise = null
    console.error('Error initializing Payload client:', e)
    throw e
  }

  return cached.client
}
