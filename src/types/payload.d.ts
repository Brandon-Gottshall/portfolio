declare module 'payload/config' {
  export interface PayloadConfig {
    admin?: {
      user?: string
      [key: string]: unknown
    }
    collections?: unknown[]
    editor?: unknown
    db?: unknown
    serverURL?: string
    secret?: string
    typescript?: {
      outputFile: string
    }
    graphQL?: {
      schemaOutputFile: string
    }
    [key: string]: unknown
  }

  export function buildConfig(config: PayloadConfig): PayloadConfig
}

declare module 'payload' {
  export interface InitOptions {
    config: unknown
    local?: boolean
    secret?: string
    [key: string]: unknown
  }

  export function init(options: InitOptions): Promise<Payload>

  export interface Payload {
    find: <T = unknown>(options: {
      collection: string
      limit?: number
      depth?: number
      where?: Record<string, unknown>
    }) => Promise<{ docs: T[]; totalDocs: number }>
    create: <T = unknown>(options: {
      collection: string
      data: unknown
    }) => Promise<T>
    update: <T = unknown>(options: {
      collection: string
      id: number | string
      data: unknown
    }) => Promise<T>
    delete: <T = unknown>(options: {
      collection: string
      id: number | string
    }) => Promise<T>
    db: {
      drizzle: {
        execute: (sql: string) => Promise<unknown>
        [key: string]: unknown
      }
      [key: string]: unknown
    }
    [key: string]: unknown
  }
}

declare module 'payload/types' {
  import type { User } from '../payload-types'

  export interface CollectionConfig {
    slug: string
    auth?: boolean
    admin?: {
      useAsTitle?: string
      [key: string]: unknown
    }
    access?: {
      read?: (args: { req: { user?: User | null } }) => boolean
      create?: (args: { req: { user?: User | null } }) => boolean
      update?: (args: {
        req: { user?: User | null }
        id: string | number
      }) => boolean
      delete?: (args: { req: { user?: User | null } }) => boolean
      [key: string]: unknown
    }
    fields?: {
      name: string
      type: string
      required?: boolean
      defaultValue?: unknown
      options?: { label: string; value: string }[]
      [key: string]: unknown
    }[]
    upload?: {
      staticDir: string
      mimeTypes?: string[]
      adminThumbnail?: string
      imageSizes?: {
        name: string
        width: number
        height?: number
        position?: string
      }[]
      [key: string]: unknown
    }
    [key: string]: unknown
  }
}

declare module '@payloadcms/db-postgres' {
  export interface PostgresAdapterConfig {
    pool?: {
      connectionString?: string
      ssl?: {
        rejectUnauthorized?: boolean
      }
    }
    migrationDir?: string
    push?: boolean
    logger?: boolean
  }

  export function postgresAdapter(config: PostgresAdapterConfig): unknown
}

declare module '@payloadcms/richtext-lexical' {
  export function lexicalEditor(config?: Record<string, unknown>): unknown
}

declare module '@payloadcms/next/payload' {
  export function payload(
    config: unknown
  ): (req: unknown, res: unknown) => Promise<unknown>
}

declare module '@payloadcms/next/admin' {
  export function admin(
    config: unknown
  ): (req: unknown, res: unknown) => Promise<unknown>
}

declare module '@payloadcms/next/withPayload' {
  export function withPayload(config: unknown): unknown
}
